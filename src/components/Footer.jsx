import React from 'react';
import AsciiFire from './AsciiFire';

export default function Footer({ onSwitchTab }) {
  return (
    <footer className="wiki-footer">
      <ul className="wiki-footer-info">
        <li>This page was last edited on 23 November 2026, at 12:52 (UTC).</li>
        <li>
          Text is available under the{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
            Creative Commons Attribution-ShareAlike License 4.0
          </a>
          ; additional terms may apply.
        </li>
        <li>
          Personal portfolio and CTF archive of Aaron Lee Apolonio (ilon). Styled with Wikipedia aesthetics.
        </li>
      </ul>
      <ul className="wiki-footer-links">
        <li>
          <a href="#about" onClick={(e) => { e.preventDefault(); onSwitchTab('about'); }}>
            About Aaron Lee Apolonio
          </a>
        </li>
        <li>
          <a href="#works" onClick={(e) => { e.preventDefault(); onSwitchTab('works'); }}>
            Works
          </a>
        </li>
        <li>
          <a href="/assets/aaronleeapolonio-cv.pdf" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </li>
        <li>
          <a href="mailto:aaronleeapolonio@gmail.com">
            Contact
          </a>
        </li>
        <li>
          <a href="https://github.com/ilon07" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/aaron-lee-apolonio-222798382" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://app.hackthebox.com/users/4161147" target="_blank" rel="noopener noreferrer">
            HackTheBox
          </a>
        </li>
        <li>
          <a href="https://www.credly.com/users/aaron-lee-apolonio" target="_blank" rel="noopener noreferrer">
            Credly
          </a>
        </li>
        <li>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ↑ Back to top
          </a>
        </li>
      </ul>

      {/* Wall of Fire ASCII Animation */}
      <div className="wiki-footer-fire-wrap">
        <AsciiFire />
      </div>
    </footer>
  );
}
