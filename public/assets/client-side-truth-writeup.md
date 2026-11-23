# GH 200 — Wave 2: "Client-Side Truth" — Writeup

**Flag:** `POCTF{136.374.12c2b97d7ae020372675e8c479b972e4.NWJFNGUMHSYQYS7L5MNN6URWUT}`

## Summary

The challenge ships a Godot game client that fights a boss over HTTP. The
flavor text telegraphs the bug directly: the server claims to be
"server-authoritative" and "100% SEC-UR[E]", except the dev admits "if the
client decides what's true, the client can lie." Decompiling the shipped
`.gdc` scripts confirmed exactly that: the player's **position** is
self-reported by the client with no server-side movement/physics validation.
A gating region (`count_room_aabb`) controls access to the boss fight, but
since the server trusts whatever `x, y, z` the client sends in
`POST /game/pos`, you can teleport into that region without ever playing the
level, then spam `fire` until the boss dies — no actual gameplay skill
required.

## Recon

Two things were provided: the distributed game binaries, and a decompiled
Godot project (`Project Recovery` / `.pck` extraction showing `.gdc`/`.gd.remap`
files under `res://`). Key scripts recovered:

- `auth_check.gd` — login/credential handling for the game client
- `NetworkClient.gd` (shown as `extends Node`, class unnamed in the dump) —
  all gameplay HTTP calls (`game/start`, `game/pos`, `game/fire`,
  `game/state`, `game/win_marker`)
- `FlagToken.gd` — a *separate* endpoint (`/api/challenges/51/complete`) used
  only to mint the final platform marker from a `nonce`
- `SessionStore.gd` — just a plain data holder (`game_token`, `team_key`,
  `nonce`, `team_id`), no logic

### The trust bug

Reading `NetworkClient.gd`:

```gdscript
func game_pos(pos: Vector3) -> void:
	_http_post("/challenges/client-side-truth/game/pos", {
		"ts": _server_ts_ms_estimate(),
		"x": pos.x, "y": pos.y, "z": pos.z,
	}, func(_d): pass)
```

The client just tells the server where it is. Compare this to `game_fire`
and `game_state`, where the **server** computes `hit` / `boss_hp` / `won` —
those are safe. Position is the one value the server blindly accepts from
the client, and the challenge name/flavor text make clear that's the
intended vulnerability.

### Working out authentication

`auth_check.gd` revealed how credentials map to a numeric `team_id`, which
isn't given directly in the credentials bundle — it has to be derived from
the team key:

```gdscript
func _parse_team_id(team_key: String) -> int:
	var parts := team_key.strip_edges().split("-")
	for i in range(parts.size()):
		if i == 0: continue
		if parts[i].is_valid_int():
			return parts[i].to_int()
	return 0
```

For team key `TEAMKEY136-374-7CD759972AF2`, splitting on `-` gives
`["TEAMKEY136", "374", "7CD759972AF2"]`; skipping index 0, the first valid
integer is `374` → **`team_id = 374`**. (Earlier guesses of `5`, `136`, and
`0`, pulled from the token/key strings themselves, all failed auth with
`401 {"error":"auth"}`.)

The same script also contains a `_dev_bypass()` that fires whenever
`OS.is_debug_build()` is true, hardcoding a second, universal dev
token/key pair that skips auth entirely — a second latent issue, not needed
for this solve but worth flagging separately.

Auth headers used for the gameplay API (per `NetworkClient._headers()`):

```
Authorization: Bearer <game_token>
X-Team-ID: <team_id>
```

## Exploit

Once `/game/start` returned the arena bounds:

```json
{
  "arena": {
    "count_room": {"min": [-22.5, 20.6, 15.6], "max": [-17.5, 23.0, 20.6]},
    "floor":      {"min": [-25.0, -0.5, -25.0], "max": [25.0, 5.0, 25.0]}
  },
  "boss_pos": [0.0, 1.0, 15.0],
  "boss_hp": 500,
  "boss_max_hp": 500,
  "spawn": [0.0, 0.5, -15.0]
}
```

the plan was:

1. Compute the center of `count_room_aabb` → `(-20.0, 21.8, 18.1)`.
2. `POST /game/pos` with that point as `x,y,z`, despite never having moved
   there. The server accepted it with a plain `{"ok": true}` — **no
   distance/speed/teleport check at all**.
3. Loop `POST /game/fire` (re-asserting position each time, to be safe
   against any possible per-shot re-validation), until `boss_hp` hit `0`.
   The server computed `hit: true` and decremented HP by 50 every call —
   confirming the damage/hit logic itself is legitimately server-side; only
   position was forgeable.
4. `GET /game/state` → `"won": true`.
5. `GET /game/win_marker` → server returned the flag directly.

No rendering, no in-game navigation, no actual combat — ten raw HTTP
requests from a Python script.

## Script

```python
import requests
import time

API_BASE = "https://pointeroverflowctf.com"

GAME_TOKEN = "POCTF-GAME-5-136-718aac0bc1359cdaf9bbe1"
TEAM_KEY = "TEAMKEY136-374-7CD759972AF2"
TEAM_ID = 374  # parsed from team.key per auth_check.gd's _parse_team_id logic

session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {GAME_TOKEN}",
    "X-Team-ID": str(TEAM_ID),
    "Content-Type": "application/json",
})

def post(path, body=None):
    r = session.post(API_BASE + path, json=body or {})
    print(path, "->", r.status_code, r.text[:300])
    r.raise_for_status()
    return r.json()

def get(path):
    r = session.get(API_BASE + path)
    print(path, "->", r.status_code, r.text[:300])
    r.raise_for_status()
    return r.json()

# 1. Start the game, get arena info
start = post("/challenges/client-side-truth/game/start")
boss_pos = start.get("boss_pos", [0, 1.5, 6.0])
arena = start.get("arena", {})
count_room = arena.get("count_room", {})

def center_of_aabb(aabb):
    if not aabb:
        return None
    mn, mx = aabb.get("min"), aabb.get("max")
    if mn and mx:
        return [(mn[i] + mx[i]) / 2 for i in range(3)]
    return None

target = center_of_aabb(count_room) or boss_pos
print("Reporting position:", target)

# 2. Report a fabricated position inside the gating region, never walked to
post("/challenges/client-side-truth/game/pos", {
    "ts": int(time.time() * 1000),
    "x": target[0], "y": target[1], "z": target[2],
})

# 3. Spam fire until the boss is dead, re-asserting position each time
for i in range(100):
    post("/challenges/client-side-truth/game/pos", {
        "ts": int(time.time() * 1000),
        "x": target[0], "y": target[1], "z": target[2],
    })
    result = post("/challenges/client-side-truth/game/fire",
                   {"ts": int(time.time() * 1000)})
    hp = result.get("boss_hp")
    print(f"shot {i}: hit={result.get('hit')} boss_hp={hp}")
    if hp is not None and hp <= 0:
        break

# 4. Confirm win, pull the flag
state = get("/challenges/client-side-truth/game/state")
print("won:", state.get("won"))

if state.get("won"):
    marker = get("/challenges/client-side-truth/game/win_marker")
    print("FLAG / MARKER:", marker.get("flag"))
```

## Full run output

```
/challenges/client-side-truth/game/start -> 200 {"arena":{"count_room":{"max":[-17.5,23.0,20.6],"min":[-22.5,20.6,15.6]},"floor":{"max":[25.0,5.0,25.0],"min":[-25.0,-0.5,-25.0]}},"boss_hp":500,"boss_max_hp":500,"boss_pos":[0.0,1.0,15.0],"lag_comp_ms":150,"ok":true,"server_ts_ms":1794757010308,"spawn":[0.0,0.5,-15.0]}

boss_pos: [0.0, 1.0, 15.0]
count_room_aabb: {'max': [-17.5, 23.0, 20.6], 'min': [-22.5, 20.6, 15.6]}
floor_aabb: {'max': [25.0, 5.0, 25.0], 'min': [-25.0, -0.5, -25.0]}
Reporting position: [-20.0, 21.8, 18.1]

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757010513}
/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757010717}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":450,"hit":true,"ok":true,"server_ts_ms":1794757010915}
shot 0: hit=True boss_hp=450

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757011120}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":400,"hit":true,"ok":true,"server_ts_ms":1794757011328}
shot 1: hit=True boss_hp=400

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757011539}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":350,"hit":true,"ok":true,"server_ts_ms":1794757011737}
shot 2: hit=True boss_hp=350

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757011946}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":300,"hit":true,"ok":true,"server_ts_ms":1794757012143}
shot 3: hit=True boss_hp=300

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757012342}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":250,"hit":true,"ok":true,"server_ts_ms":1794757012565}
shot 4: hit=True boss_hp=250

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757012774}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":200,"hit":true,"ok":true,"server_ts_ms":1794757012976}
shot 5: hit=True boss_hp=200

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757013181}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":150,"hit":true,"ok":true,"server_ts_ms":1794757013378}
shot 6: hit=True boss_hp=150

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757013577}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":100,"hit":true,"ok":true,"server_ts_ms":1794757013774}
shot 7: hit=True boss_hp=100

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757014003}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":50,"hit":true,"ok":true,"server_ts_ms":1794757014205}
shot 8: hit=True boss_hp=50

/challenges/client-side-truth/game/pos -> 200 {"ok":true,"server_ts_ms":1794757014411}
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":0,"hit":true,"ok":true,"server_ts_ms":1794757014609}
shot 9: hit=True boss_hp=0

/challenges/client-side-truth/game/state -> 200 {"boss_hp":0,"has_pos":true,"ok":true,"server_player_pos":[-20.0,21.8,18.1],"server_ts_ms":1794757014807,"won":true}
won: True

/challenges/client-side-truth/game/win_marker -> 200 {"flag":"POCTF{136.374.12c2b97d7ae020372675e8c479b972e4.NWJFNGUMHSYQYS7L5MNN6URWUT}","ok":true}
FLAG / MARKER: POCTF{136.374.12c2b97d7ae020372675e8c479b972e4.NWJFNGUMHSYQYS7L5MNN6URWUT}
```

## Root cause

**Missing server-side authority over client-reported position.** The game
correctly keeps damage calculation, hit detection, and win-state on the
server — but the one input that *gates* access to the boss fight (standing
in `count_room`) is taken verbatim from the client with no plausibility
check (e.g. comparing against the last known position, bounding movement
speed between timestamps, or simply not trusting client-reported position
for anything security-relevant). A client can claim to be anywhere, at any
time, with no cost.

## Fix recommendation

- Never trust client-reported absolute position for gating logic. If
  position must come from the client (e.g. for cosmetic lag compensation),
  validate it against a maximum plausible delta from the last
  server-accepted position and timestamp, and reject discontinuous jumps.
- Prefer deriving "is the player in the count room" from server-side state
  transitions (e.g. an explicit server-validated `enter_room` event tied to
  a path/trigger check) rather than raw coordinates.
- Separately: remove or properly gate the `_dev_bypass()` path in
  `auth_check.gd` behind a build flag that can't ship in the distributed
  binary — relying on `OS.is_debug_build()` alone means a non-exported or
  mis-exported debug build leaks a universal auth bypass.

## Secondary finding (not required for this solve)

`auth_check.gd`'s `_dev_bypass()` hardcodes a working token/key pair
(`POCTF-GAME-5-136-ebb8ab57829e79d045fd0f` /
`TEAMKEY136--1-280BC7B13C60`) and skips the normal credential-file read
entirely whenever `OS.is_debug_build()` is true. If any distributed binary
is accidentally an unexported/debug build, this pair would grant
unconditional access regardless of which team it's used for.
