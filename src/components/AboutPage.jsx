import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const credentials = [
  { title: 'Cisco Networking Academy: Introduction to Cybersecurity', desc: 'Completed Cisco Networking Academy course covering cyber threats, cryptography, network security, and defense fundamentals.', issuer: 'Cisco Networking Academy', icon: 'fas fa-certificate', url: '/assets/cisco_intro_to_cybersecurity_cert.pdf' },
  { title: 'Cisco Networking Academy: Network Basics', desc: 'Learned fundamental networking concepts, protocols, and basic device configurations.', issuer: 'Cisco Networking Academy', icon: 'fas fa-certificate', url: '/assets/_certificate_aaronleeapolonio-gmail-com_35a814af-b757-4025-a67c-be9081a97175.pdf' },
  { title: 'Cisco Networking Academy: Network Addressing and Basic Troubleshootng', desc: 'Mastered IPv4/IPv6 subnets, addressing schemes, and basic troubleshooting techniques.', issuer: 'Cisco Networking Academy', icon: 'fas fa-certificate', url: '/assets/_certificate_aaronleeapolonio-gmail-com_72b44c73-862a-4d8f-b67c-ff929daf6890.pdf' },
  { title: 'Cisco Networking Academy: Network Support and Security', desc: 'Completed formal routing protocols, switching essentials, and network security concepts.', issuer: 'Cisco Networking Academy', icon: 'fas fa-certificate', url: '/assets/_certificate_aaronleeapolonio-gmail-com_fae30db4-24d8-4cb6-8eed-4eba367686f6.pdf' },
  { title: 'Cisco Networking Academy: Network Device and Initial Configuration', desc: ' Learned to configure and troubleshoot Cisco network devices.', issuer: 'Cisco Networking Academy', icon: 'fas fa-certificate', url: '/assets/_certificate_aaronleeapolonio-gmail-com_b873b5be-0b4a-44aa-8447-61b6282d1194 (1).pdf' },
  { title: 'Cyber404: Certified Cybersecurity Associate (CCA)', desc: 'Credential verifying proficiency in core cybersecurity concepts, vulnerability assessment, and defensive strategies.', issuer: 'CYBER404, PDG', icon: 'fas fa-certificate', url: '/assets/cyber404_cca_cert.pdf' },
  { title: 'ADBI E-Learning | Cybersecurity Course', desc: 'Completed the ADBI E-Learning Cybersecurity course.', issuer: 'ADBI E-Learning', icon: 'fas fa-trophy', url: '/assets/Aaron-Lee-Apolonio–Cybersecurity–Cybersecurity–ADBI-E-Learning.pdf' },
  { title: 'ITLympics 2025 | Web Design Champion', desc: 'Awarded Gold Medal for exceptional performance and creative excellence in the Web Design category.', issuer: 'Pamantasan ng Lungsod ng Valenzuela', icon: 'fas fa-trophy', url: '/assets/webdescert.jpg' },
  { title: 'ITLympics 2025 | PC Networking Champion', desc: 'Awarded Gold Medal for technical mastery in PC networking, configuration, and troubleshooting.', issuer: 'Pamantasan ng Lungsod ng Valenzuela', icon: 'fas fa-trophy', url: '/assets/networkingcert.jpg' },
  { title: 'UMAK 14th IT Skills Olympics 2025 | 4th Place PC Networking Category', desc: 'Selected as the School Representative for the University of Makati in the city-wide IT Skills Olympics.', issuer: 'University of Makati', icon: 'fas fa-medal', url: '/assets/umak_cert.png' },
  { title: 'Inventi Hackathon 2025', desc: 'Participated in a high-intensity hackathon, collaborating on innovative tech solutions.', issuer: 'Inventi Asia', icon: 'fas fa-laptop-code', url: '/assets/inventi_cert.png' },
  { title: 'ITLympics 2026 | Cybersecurity Champion Team', desc: 'Awarded Gold Medal for demonstrating advanced skills in cybersecurity and defensive networking.', issuer: 'Pamantasan ng Lungsod ng Valenzuela', icon: 'fas fa-trophy', url: '/assets/cybersecitlympicscert.jpg' },
  { title: 'Global Cyber Skills Benchmark 2026 Project Nightfall- HackTheBox', desc: 'Completed the Global Cyber Skills Benchmark 2026 Project Nightfall.', issuer: 'HackTheBox', icon: 'fas fa-certificate', url: '/assets/Certificate-ilon.pdf' },
  { title: 'GoldRush Gauntlet 2026 | Placement: 26/97', desc: 'Participated in the GoldRush Gauntlet 2026 cybersecurity competition.', issuer: 'GoldRush Gauntlet', icon: 'fas fa-shield-halved', url: '/assets/goldrushgauntletctf.jpg' },
  { title: 'Kyokugen: CTF Competition 2026 | Team 2nd Place', desc: 'Achieved Team 2nd Place in the Kyokugen CTF Competition 2026.', issuer: 'Kyokugen', icon: 'fas fa-trophy', url: '/assets/kyokugenctf.jpg' },
  { title: 'Kaspersky CTF 2026 | Asia/Oceana Team Placement: 105/635', desc: 'Participated in the Kaspersky CTF 2026 cybersecurity competition.', issuer: 'Kaspersky', icon: 'fas fa-shield-halved', url: '/assets/kasperskyctf.png' },
  { title: 'Pointer Overflow CTF 2026 | Top 4/68 in Academics, Top 9/1253 Overall', desc: 'Achieved Top 4 out of 68 academic teams in the Pointer Overflow CTF 2026 competition.', issuer: 'University of Wisconsin - Stevens Point', icon: 'fas fa-trophy', url: '/assets/pointer_overflow_ctf_2026.pdf' },
  { title: 'UMAK 15th IT Skills Olympics 2026 | Top 4 Overall, Top 2 Batch 2 Cybersecurity Category', desc: 'Competed in the Cybersecurity Category at the University of Makati 15th IT Skills Olympics, placing Top 4 Overall and Top 2 in Batch 2 representing Pamantasan ng Lungsod ng Valenzuela.', issuer: 'University of Makati', icon: 'fas fa-trophy', url: '/assets/umak_15th_cybersec_cert_2026.pdf' }
];

const badgeCategories = [
  {
    category: 'Cyber404',
    items: [
      {
        id: 'cyber404-cca',
        name: 'Certified Cybersecurity Associate (CCA)',
        image: '/assets/cyber404_cca_badge.jpg',
        certUrl: '/assets/cyber404_cca_cert.pdf',
      },
    ],
  },
  {
    category: 'Cisco',
    items: [
      {
        id: 'cisco-intro-cybersecurity',
        name: 'Introduction to Cybersecurity',
        image: '/assets/cisco_intro_to_cybersecurity_badge.png',
        certUrl: '/assets/cisco_intro_to_cybersecurity_cert.pdf',
      },
      {
        id: 'cisco-networking-basics',
        name: 'Networking Basics',
        image: '/assets/cisco_networking_basics_badge.png',
        certUrl: '/assets/_certificate_aaronleeapolonio-gmail-com_35a814af-b757-4025-a67c-be9081a97175.pdf',
      },
      {
        id: 'cisco-network-addressing',
        name: 'Network Addressing and Basic Troubleshooting',
        image: '/assets/cisco_network_addressing_badge.png',
        certUrl: '/assets/_certificate_aaronleeapolonio-gmail-com_72b44c73-862a-4d8f-b67c-ff929daf6890.pdf',
      },
      {
        id: 'cisco-network-support-security',
        name: 'Network Support and Security',
        image: '/assets/cisco_network_support_security_badge.png',
        certUrl: '/assets/_certificate_aaronleeapolonio-gmail-com_fae30db4-24d8-4cb6-8eed-4eba367686f6.pdf',
      },
      {
        id: 'cisco-networking-devices',
        name: 'Networking Devices and Initial Configuration',
        image: '/assets/cisco_networking_devices_badge.png',
        certUrl: '/assets/_certificate_aaronleeapolonio-gmail-com_b873b5be-0b4a-44aa-8447-61b6282d1194 (1).pdf',
      },
    ],
  },
];

export default function AboutPage({ onOpenSource, onOpenLightbox, onPlayAudio }) {
  const [hoveredCred, setHoveredCred] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleCredMouseMove = (e) => {
    const cardWidth = 320;
    const cardHeight = 220;
    const padding = 16;

    let x = e.clientX + 18;
    let y = e.clientY + 12;

    if (x + cardWidth > window.innerWidth - padding) {
      x = e.clientX - cardWidth - 14;
    }
    if (y + cardHeight > window.innerHeight - padding) {
      y = e.clientY - cardHeight - 14;
    }

    setMousePos({ x: Math.max(padding, x), y: Math.max(padding, y) });
  };

  return (
    <article id="page-about">
      {/* Lead Paragraph + Right Infobox */}
      <div id="lead" className="wiki-lead-section">

        {/* DevOps Specialized Infobox */}
        <aside className="wiki-infobox">
          <div className="wiki-infobox-image-wrap">
            <img
              src="/assets/thisisme.jpg"
              alt="Aaron Lee Apolonio"
              className="wiki-infobox-image"
            />
            <div className="wiki-infobox-caption">Aaron Lee Apolonio, 2026</div>
          </div>

          <table className="wiki-infobox-table">
            <tbody>


              <tr>
                <td className="wiki-infobox-label">Email</td>
                <td className="wiki-infobox-value">
                  <a href="mailto:aaronleeapolonio@gmail.com">aaronleeapolonio@gmail.com</a>
                </td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">GitHub</td>
                <td className="wiki-infobox-value">
                  <a href="https://github.com/ilon07" target="_blank" rel="noopener noreferrer">github.com/ilon07</a>
                </td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">LinkedIn</td>
                <td className="wiki-infobox-value">
                  <a href="https://www.linkedin.com/in/aaron-lee-apolonio-222798382" target="_blank" rel="noopener noreferrer">linkedin.com/in/aaron-lee-apolonio</a>
                </td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Facebook</td>
                <td className="wiki-infobox-value">
                  <a href="https://www.facebook.com/aaronlee.apolonio.315/" target="_blank" rel="noopener noreferrer">facebook.com/aaronlee.apolonio</a>
                </td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">HackTheBox</td>
                <td className="wiki-infobox-value">
                  <a href="https://app.hackthebox.com/users/4161147" target="_blank" rel="noopener noreferrer">hackthebox.com/users/4161147</a>
                </td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Credly</td>
                <td className="wiki-infobox-value">
                  <a href="https://www.credly.com/users/aaron-lee-apolonio" target="_blank" rel="noopener noreferrer">credly.com/users/aaron-lee-apolonio</a>
                </td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Education</td>
                <td className="wiki-infobox-value">
                  <strong>Pamantasan ng Lungsod ng Valenzuela</strong><br />
                  <span style={{ fontSize: '0.78rem', color: 'var(--wiki-text-muted)' }}>BSIT (2023–2027)</span><br />
                  <strong>Our Lady of Fatima University</strong><br />
                  <span style={{ fontSize: '0.78rem', color: 'var(--wiki-text-muted)' }}>STEM (2021–2023)</span>
                </td>
              </tr>

            </tbody>
          </table>

          {/* Infobox Skills Section */}
          <div className="wiki-infobox-section-title">Skills</div>
          <table className="wiki-infobox-table">
            <tbody>
              <tr>
                <td className="wiki-infobox-label">Languages</td>
                <td className="wiki-infobox-value">HTML, CSS, JavaScript, PHP, Python, Java, C#, C</td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Frameworks</td>
                <td className="wiki-infobox-value">React, React Native, Expo, FlutterFlow, Tailwind, Node.js</td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Databases</td>
                <td className="wiki-infobox-value">SQL, PostgreSQL, MySQL</td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Security</td>
                <td className="wiki-infobox-value">Kali Linux, Wireshark, Burp Suite, Packet Tracer</td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Tools</td>
                <td className="wiki-infobox-value">Git, GitHub Copilot, Antigravity, Gemini, Vercel, Supabase</td>
              </tr>
              <tr>
                <td className="wiki-infobox-label">Multimedia</td>
                <td className="wiki-infobox-value">Photoshop, Premiere, After Effects, CapCut, Canva</td>
              </tr>
            </tbody>
          </table>

        </aside>

        {/* Lead Text Header */}
        <h2 className="wiki-h2" style={{ marginTop: 0 }}>
          <span>$ whoami</span>
        </h2>

        {/* Lead Text */}
        <p className="wiki-paragraph">
          Hello, I am <span className="wiki-lead-bold">Aaron Lee Apolonio</span> (also known as "ilon" in CTF competitions), a student and passionate vibe coder stepping into the fields of cybersecurity, networking, and software development. I am currently learning how digital networks connect and how to build secure, robust applications.
        </p>

        <p className="wiki-paragraph">
          While I am still early in my journey, I love exploring the intersection of application development and defensive security. My hands-on practice involves configuring network topologies in Cisco Packet Tracer, exploring vulnerability analysis on Kali Linux, and coding responsive frontends with React.
        </p>

        <p className="wiki-paragraph">
          Driven by curiosity and aesthetics, I am dedicated to continuously researching, practicing, and expanding my skillset as I work toward mastering secure code architecture and network defense.
        </p>
      </div>

      {/* Education Section */}
      <section id="education" className="wiki-section">
        <h2 className="wiki-h2">
          <span>$ cat education.txt</span>
        </h2>
        <p className="wiki-paragraph" style={{ marginBottom: '10px' }}>
          <strong>Pamantasan ng Lungsod ng Valenzuela</strong> — Bachelor of Science in Information Technology 2023–2027
        </p>
        <p className="wiki-paragraph">
          <strong>Our Lady of Fatima University</strong> — Science, Technology, Engineering and Mathematics 2021–2023
        </p>
      </section>

      {/* Skills Section */}
      <section id="skills" className="wiki-section">
        <h2 className="wiki-h2">
          <span>$ cat skills.txt</span>
        </h2>

        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Languages:</strong> HTML, CSS, JavaScript, PHP, Python, Java, C#, C
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Frameworks:</strong> React, React Native, Expo, FlutterFlow, Tailwind CSS, Bootstrap, Node.js, Unity Engine
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Databases:</strong> SQL, PostgreSQL, MySQL
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Cybersec & Networking:</strong> Kali Linux, Wireshark, Burp Suite, Cisco Packet Tracer, Network Architecture
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Tools:</strong> GitHub Copilot, Antigravity, Gemini, Supabase, Vercel, Git
        </p>
        <p className="wiki-paragraph">
          <strong>Multimedia:</strong> Adobe Photoshop, Adobe Premiere Pro, Adobe After Effects, CapCut, Canva
        </p>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="wiki-section">
        <h2 className="wiki-h2">
          <span>$ cat contacts.txt</span>
        </h2>

        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Email:</strong>{' '}
          <a href="mailto:aaronleeapolonio@gmail.com">aaronleeapolonio@gmail.com</a>
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>GitHub:</strong>{' '}
          <a href="https://github.com/ilon07" target="_blank" rel="noopener noreferrer">
            github.com/ilon07
          </a>
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>LinkedIn:</strong>{' '}
          <a href="https://www.linkedin.com/in/aaron-lee-apolonio-222798382" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/aaron-lee-apolonio
          </a>
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>Facebook:</strong>{' '}
          <a href="https://www.facebook.com/aaronlee.apolonio.315/" target="_blank" rel="noopener noreferrer">
            facebook.com/aaronlee.apolonio
          </a>
        </p>
        <p className="wiki-paragraph" style={{ marginBottom: '8px' }}>
          <strong>HackTheBox:</strong>{' '}
          <a href="https://app.hackthebox.com/users/4161147" target="_blank" rel="noopener noreferrer">
            hackthebox.com/users/4161147
          </a>
        </p>
        <p className="wiki-paragraph">
          <strong>Credly:</strong>{' '}
          <a href="https://www.credly.com/users/aaron-lee-apolonio" target="_blank" rel="noopener noreferrer">
            credly.com/users/aaron-lee-apolonio
          </a>
        </p>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="wiki-section">
        <h2 className="wiki-h2">
          <span>$ cat certifications/achievements.txt</span>
        </h2>

        <ul className="wiki-cert-list">
          {credentials.map((cred, idx) => (
            <li key={idx} className="wiki-cert-item">
              <a
                href={cred.url}
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-cert-link"
                onMouseEnter={(e) => {
                  setHoveredCred(cred);
                  handleCredMouseMove(e);
                }}
                onMouseMove={handleCredMouseMove}
                onMouseLeave={() => setHoveredCred(null)}
              >
                {cred.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Badges & Credentials Section */}
      <section id="badges" className="wiki-section">
        <h2 className="wiki-h2">
          <span>$ ls -la badges/</span>
        </h2>

        {badgeCategories.map((group) => (
          <div key={group.category} className="wiki-badge-group">
            <h3 className="wiki-badge-group-title">
              {group.category}
            </h3>

            <div className="wiki-badge-minimal-grid">
              {group.items.map((b) => (
                <div key={b.id} className="wiki-badge-minimal-item">
                  <a
                    href={b.certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wiki-badge-minimal-img-link"
                    onMouseEnter={(e) => {
                      setHoveredCred({ title: b.name, url: b.certUrl });
                      handleCredMouseMove(e);
                    }}
                    onMouseMove={handleCredMouseMove}
                    onMouseLeave={() => setHoveredCred(null)}
                    title={`View Certificate: ${b.name}`}
                  >
                    <img src={b.image} alt={b.name} className="wiki-badge-minimal-img" />
                  </a>
                  <a
                    href={b.certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wiki-badge-minimal-name-link"
                    onMouseEnter={(e) => {
                      setHoveredCred({ title: b.name, url: b.certUrl });
                      handleCredMouseMove(e);
                    }}
                    onMouseMove={handleCredMouseMove}
                    onMouseLeave={() => setHoveredCred(null)}
                  >
                    {b.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Floating Certificate Hover Preview */}
      {hoveredCred && typeof document !== 'undefined' && createPortal(
        <div
          className="wiki-cert-hover-preview"
          style={{
            position: 'fixed',
            top: `${mousePos.y}px`,
            left: `${mousePos.x}px`,
            pointerEvents: 'none',
            zIndex: 999999,
          }}
        >
          {hoveredCred.url ? (
            /\.pdf$/i.test(hoveredCred.url) ? (
              <iframe
                src={`${hoveredCred.url}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                title={hoveredCred.title}
                className="wiki-cert-hover-iframe"
                scrolling="no"
              />
            ) : (
              <img
                src={hoveredCred.url}
                alt={hoveredCred.title}
                className="wiki-cert-hover-img"
              />
            )
          ) : (
            <div className="wiki-cert-hover-placeholder">
              <span>No preview available</span>
            </div>
          )}
        </div>,
        document.body
      )}
    </article>
  );
}
