import React from 'react';

export function ViewSourceModal({ isOpen, onClose, activeTab, onCopy }) {
  if (!isOpen) return null;

  const wikitext = activeTab === 'about' ? `{{Infobox person
| name          = Aaron Lee Apolonio
| alias         = ilon
| image         = thisisme.jpg
| caption       = Aaron Lee Apolonio, 2026
| education     = Pamantasan ng Lungsod ng Valenzuela (BSIT 2023–2027)
| email         = aaronleeapolonio@gmail.com
| github        = https://github.com/ilon07
| linkedin      = https://www.linkedin.com/in/aaron-lee-apolonio-222798382
| facebook      = https://www.facebook.com/aaronlee.apolonio.315/
| hackthebox    = https://app.hackthebox.com/users/4161147
| credly        = https://www.credly.com/users/aaron-lee-apolonio
}}

'''Aaron Lee Apolonio''' (also known as '''"ilon"''' in CTF competitions) is an Information Technology student and vibe coder stepping into cybersecurity, networking, and software development.

== Education ==
* '''Pamantasan ng Lungsod ng Valenzuela''' — Bachelor of Science in Information Technology (2023–2027)
* '''Our Lady of Fatima University''' — Science, Technology, Engineering and Mathematics (2021–2023)

== Skills ==
* '''Languages:''' HTML, CSS, JavaScript, PHP, Python, Java, C#, C
* '''Frameworks:''' React, React Native, Expo, FlutterFlow, Tailwind CSS, Bootstrap, Node.js
* '''Databases:''' SQL, PostgreSQL, MySQL
* '''Cybersec & Networking:''' Kali Linux, Wireshark, Burp Suite, Cisco Packet Tracer

== Achievements ==
* OPSWAT Introduction to Critical Infrastructure Protection (ICIP)
* Cisco Networking Academy Digital Badges & Certifications
* Cyber404 Certified Cybersecurity Associate (CCA)
* Pointer Overflow CTF 2026 — Top 4 Academics, Top 9 Overall
* UMAK 15th IT Skills Olympics 2026 — Top 4 Overall, Top 2 Batch 2 (Cybersecurity)` : `{{Talk page
| title       = Works & Technical Blueprint Discussions
| owner       = Aaron Lee Apolonio
| status      = In Development
}}

== Section 1: Projects ==
* Projects and technical architectures will be documented here.
-- ~~~~

== Section 2: Writeups ==
* Cybersecurity challenge walkthroughs and writeups will be documented here.
-- ~~~~`;

  return (
    <div className="wiki-modal-overlay" onClick={onClose}>
      <div className="wiki-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="wiki-modal-header">
          <span className="wiki-modal-title">View source: Aaron Lee Apolonio</span>
          <button type="button" className="wiki-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="wiki-modal-body">
          <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--wiki-text-muted)' }}>
            You may view and copy the source wikitext of this page:
          </p>
          <pre className="wiki-code-block" style={{ maxHeight: '380px', whiteSpace: 'pre-wrap', userSelect: 'all' }}>
            {wikitext}
          </pre>
        </div>
        <div className="wiki-modal-footer">
          <button
            type="button"
            className="wiki-action-btn primary"
            onClick={() => onCopy(wikitext)}
          >
            Copy Wikitext
          </button>
          <button type="button" className="wiki-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function ViewHistoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="wiki-modal-overlay" onClick={onClose}>
      <div className="wiki-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="wiki-modal-header">
          <span className="wiki-modal-title">Revision history: Aaron Lee Apolonio</span>
          <button type="button" className="wiki-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="wiki-modal-body">
          <p style={{ fontSize: '0.85rem', marginBottom: '14px', color: 'var(--wiki-text-muted)' }}>
            Compare selected revisions of career milestones and infrastructure deployments:
          </p>

          <ul className="wiki-history-list">
            <li className="wiki-history-row">
              <div className="wiki-history-radios">
                <input type="radio" name="diff-old" defaultChecked />
                <input type="radio" name="diff-new" />
              </div>
              <span className="wiki-history-date">2026-10-28 20:25</span>
              <span className="wiki-history-user">Aaron Apolonio</span>
              <span className="wiki-history-comment">(cur | prev) Converted architecture to React components; pure black theme</span>
            </li>
            <li className="wiki-history-row">
              <div className="wiki-history-radios">
                <input type="radio" name="diff-old" />
                <input type="radio" name="diff-new" defaultChecked />
              </div>
              <span className="wiki-history-date">2026-06-15 11:40</span>
              <span className="wiki-history-user">Aaron Apolonio</span>
              <span className="wiki-history-comment">(cur | prev) Released kube-janitor-x v1.4.0 in Go with automated PVC volume reclamation</span>
            </li>
            <li className="wiki-history-row">
              <div className="wiki-history-radios">
                <input type="radio" name="diff-old" />
                <input type="radio" name="diff-new" />
              </div>
              <span className="wiki-history-date">2025-11-04 09:15</span>
              <span className="wiki-history-user">Aaron Apolonio</span>
              <span className="wiki-history-comment">(cur | prev) Achieved Certified Kubernetes Security Specialist (CKS) credential</span>
            </li>
            <li className="wiki-history-row">
              <div className="wiki-history-radios">
                <input type="radio" name="diff-old" />
                <input type="radio" name="diff-new" />
              </div>
              <span className="wiki-history-date">2024-03-20 16:30</span>
              <span className="wiki-history-user">Aaron Apolonio</span>
              <span className="wiki-history-comment">(cur | prev) Deployed enterprise ArgoCD GitOps architecture across 80+ microservices</span>
            </li>
            <li className="wiki-history-row">
              <div className="wiki-history-radios">
                <input type="radio" name="diff-old" />
                <input type="radio" name="diff-new" />
              </div>
              <span className="wiki-history-date">2022-08-10 14:02</span>
              <span className="wiki-history-user">Aaron Apolonio</span>
              <span className="wiki-history-comment">(cur | prev) Initial commit: Created DevOps engineer biography and core IaC principles</span>
            </li>
          </ul>
        </div>
        <div className="wiki-modal-footer">
          <button
            type="button"
            className="wiki-action-btn primary"
            onClick={() => alert('Selected revisions verified: GitOps signed with GPG.')}
          >
            Compare selected revisions
          </button>
          <button type="button" className="wiki-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function LightboxModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="wiki-modal-overlay" onClick={onClose}>
      <div className="wiki-modal-card" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
        <div className="wiki-modal-header">
          <span className="wiki-modal-title">{data.title || 'Infrastructure Blueprint Preview'}</span>
          <button type="button" className="wiki-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="wiki-modal-body" style={{ textAlign: 'center', backgroundColor: '#000000' }}>
          <img src={data.src} alt={data.title} className="wiki-lightbox-img" />
          <div style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '14px' }}>
            <strong>{data.title}</strong> — {data.desc}
          </div>
        </div>
        <div className="wiki-modal-footer">
          <button type="button" className="wiki-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
