import React, { useState, useEffect, useRef } from 'react';

import AboutPage from './components/AboutPage';
import WorksPage from './components/WorksPage';
import Footer from './components/Footer';
import { ViewSourceModal, ViewHistoryModal, LightboxModal } from './components/Modals';
import { projects } from './data/projects';
import {
  writeups,
  WRITEUP_CATEGORIES,
  getCategoryForPlatform,
  getWriteupsByCategory
} from './data/writeups';

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [worksView, setWorksView] = useState('root');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'plv-qlib-landing');
  const [selectedCategoryId, setSelectedCategoryId] = useState('packetcapture-ctf-2026');
  const [selectedWriteupId, setSelectedWriteupId] = useState(writeups[0]?.id || null);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchContainerRef = useRef(null);

  const searchableItems = [
    { title: "$ whoami", desc: "Bio, personal dossier, CTF background", target: "lead", page: "about" },
    { title: "Education", desc: "Pamantasan ng Lungsod ng Valenzuela (BSIT), OLFU (STEM)", target: "education", page: "about" },
    { title: "Skills: Languages & Frameworks", desc: "React, Python, JavaScript, PHP, Java, C#, C, Node.js", target: "skills", page: "about" },
    { title: "Skills: Cybersec & Networking", desc: "Kali Linux, Wireshark, Burp Suite, Cisco Packet Tracer", target: "skills", page: "about" },
    { title: "Contacts", desc: "Email, GitHub, LinkedIn, Facebook, HackTheBox, Credly", target: "contacts", page: "about" },
    { title: "Achievements / Certifications", desc: "Cisco, HackTheBox, ITLympics Gold Medalist, Pointer Overflow CTF, CTF competitions", target: "certifications", page: "about" },
    { title: "Pointer Overflow CTF 2026", desc: "Top 4/68 in Academics, Top 9/1253 Overall • University of Wisconsin - Stevens Point", target: "certifications", page: "about" },
    { title: "UMAK 15th IT Skills Olympics 2026", desc: "Top 4 Overall, Top 2 Batch 2 (Cybersecurity Category) • University of Makati", target: "certifications", page: "about" },
    { title: "Badges & Credentials", desc: "Cyber404 CCA, Cisco Networking Academy Digital Badges", target: "badges", page: "about" },
    { title: "Cyber404: Certified Cybersecurity Associate (CCA)", desc: "Cyber404 Digital Badge & Certification • Defensive Security & Core Cybersecurity", target: "badges", page: "about" },
    { title: "Cisco: Introduction to Cybersecurity", desc: "Cisco Networking Academy Digital Badge & Certification", target: "badges", page: "about" },
    { title: "Cisco Networking Academy Badges", desc: "Intro to Cybersecurity, Networking Basics, Network Addressing, Support & Security, Devices", target: "badges", page: "about" },
    ...projects.map((p) => ({
      title: p.title,
      desc: p.meta || p.overview.slice(0, 80),
      target: p.id,
      page: 'works',
      type: 'project'
    })),
    ...writeups.map((w) => ({
      title: w.title,
      desc: `${w.platform} • ${w.difficulty || 'CTF'}`,
      target: w.id,
      page: 'works',
      type: 'writeup'
    }))
  ];

  const filteredSearchResults =
    searchQuery.trim() === ''
      ? []
      : searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with URL Hash
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.slice(1);
      if (!rawHash) {
        setActiveTab('about');
        return;
      }

      const lower = rawHash.toLowerCase();

      if (lower === 'works') {
        setActiveTab('works');
        setWorksView('root');
      } else if (lower.startsWith('works/')) {
        setActiveTab('works');
        const segments = rawHash
          .split('/')
          .map((s) => decodeURIComponent(s.trim()))
          .filter(Boolean);

        if (segments.length === 1) {
          setWorksView('root');
        } else if (segments[1].toLowerCase() === 'projects') {
          setWorksView('projects');
          if (segments[2]?.toLowerCase() === 'writeups') {
            setWorksView('writeups');
          } else if (segments.length >= 3) {
            const foundProj = projects.find(
              (p) => p.id.toLowerCase() === segments[2].toLowerCase()
            );
            if (foundProj) {
              setSelectedProjectId(foundProj.id);
            } else if (projects[0]) {
              setSelectedProjectId(projects[0].id);
            }
          } else if (projects[0]) {
            setSelectedProjectId(projects[0].id);
          }
        } else if (segments[1].toLowerCase() === 'writeups') {
          if (segments.length >= 3) {
            const cat = WRITEUP_CATEGORIES.find(
              (c) =>
                c.slug.toLowerCase() === segments[2].toLowerCase() ||
                c.id.toLowerCase() === segments[2].toLowerCase() ||
                c.name.toLowerCase() === segments[2].toLowerCase()
            );
            if (cat) {
              setSelectedCategoryId(cat.slug);
              setWorksView('writeups-category');
              const catWriteups = getWriteupsByCategory(cat.slug, writeups);
              if (segments.length >= 4) {
                const foundW = catWriteups.find(
                  (w) =>
                    w.id.toLowerCase() === segments[3].toLowerCase() ||
                    w.slug.toLowerCase() === segments[3].toLowerCase()
                );
                if (foundW) {
                  setSelectedWriteupId(foundW.id);
                } else if (catWriteups[0]) {
                  setSelectedWriteupId(catWriteups[0].id);
                }
              } else if (catWriteups[0]) {
                setSelectedWriteupId(catWriteups[0].id);
              }
            } else {
              const foundW = writeups.find(
                (w) =>
                  w.id.toLowerCase() === segments[2].toLowerCase() ||
                  w.slug.toLowerCase() === segments[2].toLowerCase()
              );
              if (foundW) {
                const catForW = getCategoryForPlatform(foundW.platform);
                setSelectedCategoryId(catForW.slug);
                setSelectedWriteupId(foundW.id);
                setWorksView('writeups-category');
              } else {
                setWorksView('writeups');
              }
            }
          } else {
            setWorksView('writeups');
          }
        } else {
          setWorksView('root');
        }
      } else if (lower.startsWith('writeup')) {
        // Backwards compatibility with #writeups/:id
        setActiveTab('works');
        const parts = rawHash
          .split('/')
          .map((s) => decodeURIComponent(s.trim()))
          .filter(Boolean);

        if (parts.length > 1) {
          const found = writeups.find(
            (w) =>
              w.id.toLowerCase() === parts[1].toLowerCase() ||
              w.slug.toLowerCase() === parts[1].toLowerCase() ||
              w.id.replace('pointer-overflow-ctf-2026-', 'poctf-').toLowerCase() ===
              parts[1].toLowerCase() ||
              (w.id === 'pointer-overflow-ctf-2026-a-shipwreck' &&
                (parts[1] === 'osint-the-shipwreck' || parts[1] === 'a-shipwreck'))
          );
          if (found) {
            const catForW = getCategoryForPlatform(found.platform);
            setSelectedCategoryId(catForW.slug);
            setSelectedWriteupId(found.id);
            setWorksView('writeups-category');
          } else {
            setWorksView('writeups');
          }
        } else {
          setWorksView('writeups');
        }
      } else if (lower.startsWith('project')) {
        // Backwards compatibility with #projects/:id
        setActiveTab('works');
        setWorksView('projects');
        const parts = rawHash
          .split('/')
          .map((s) => decodeURIComponent(s.trim()))
          .filter(Boolean);

        if (parts.length > 1) {
          const found = projects.find((p) => p.id.toLowerCase() === parts[1].toLowerCase());
          if (found) {
            setSelectedProjectId(found.id);
          } else if (projects[0]) {
            setSelectedProjectId(projects[0].id);
          }
        } else if (projects[0]) {
          setSelectedProjectId(projects[0].id);
        }
      } else {
        setActiveTab('about');
      }
    };

    handleHash();
    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  // Update Page Title
  useEffect(() => {
    if (activeTab === 'about') {
      document.title = "Aaron Lee Apolonio - Wikipedia, the free encyclopedia";
    } else {
      document.title = "Aaron Lee Apolonio: Works - Wikipedia";
    }
  }, [activeTab]);

  // Back to Top Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg, duration = 2600) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const currentCategory =
    WRITEUP_CATEGORIES.find((c) => c.slug === selectedCategoryId) || WRITEUP_CATEGORIES[0];

  const handleNavigateWorks = (view, params = {}) => {
    setActiveTab('works');
    setWorksView(view);

    let hash = 'works';

    if (view === 'root') {
      hash = 'works';
    } else if (view === 'projects') {
      const projId = params.id || selectedProjectId || projects[0]?.id;
      setSelectedProjectId(projId);
      hash = `works/projects`;
    } else if (view === 'writeups') {
      hash = 'works/writeups';
    } else if (view === 'writeups-category') {
      const catSlug = params.category || selectedCategoryId || WRITEUP_CATEGORIES[0].slug;
      setSelectedCategoryId(catSlug);
      const catWriteups = getWriteupsByCategory(catSlug, writeups);
      const wId = params.id || catWriteups[0]?.id || writeups[0]?.id;
      setSelectedWriteupId(wId);
      hash = `works/writeups/${catSlug}`;
    }

    window.history.pushState(null, '', `#${hash}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    window.history.pushState(null, '', `#works/projects/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWriteup = (id) => {
    setSelectedWriteupId(id);
    window.history.pushState(null, '', `#works/writeups/${selectedCategoryId}/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchResult = (item) => {
    if (item.page === 'works') {
      if (item.type === 'project') {
        handleNavigateWorks('projects');
        setSelectedProjectId(item.target);
      } else {
        const found = writeups.find((w) => w.id === item.target);
        const cat = found ? getCategoryForPlatform(found.platform) : WRITEUP_CATEGORIES[0];
        handleNavigateWorks('writeups-category', { category: cat.slug, id: item.target });
      }
    } else {
      handleNavigateSection(item.page, item.target);
    }
    setSearchQuery('');
    setIsSearchActive(false);
  };

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'works') {
      handleNavigateWorks('root');
    } else {
      window.history.pushState(null, '', `#${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (tab, targetId) => {
    if (tab === 'works') {
      const found = writeups.find((w) => w.id === targetId);
      if (found) {
        const cat = getCategoryForPlatform(found.platform);
        handleNavigateWorks('writeups-category', { category: cat.slug, id: targetId });
      } else {
        handleNavigateWorks('root');
      }
      return;
    }
    if (activeTab !== tab) {
      setActiveTab(tab);
      window.history.pushState(null, '', `#${tab}`);
    }
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Aaron Lee Apolonio");
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast("Playing pronunciation for Aaron Lee Apolonio");
    } else {
      showToast("Audio synthesis not supported by this browser.");
    }
  };

  const handleCopyWikitext = (wikitext) => {
    navigator.clipboard.writeText(wikitext).then(() => {
      showToast("Wikitext copied to clipboard!");
    });
  };

  return (
    <div className="wiki-container">
      {/* Body Container */}
      <div className="wiki-body-container">
        {/* Article Title Bar */}
        <div className="wiki-article-title-wrap">
          <div className="wiki-title-left">
            <pre className="wiki-ascii-banner" aria-label="ILON ASCII Banner">
              {`   ,,            
 ' ||            
\\\\ ||  /'\\\\ \\\\/\\\\
|| || || || || ||
|| || || || || ||
\\\\ \\\\ \\\\,/  \\\\ \\\\`}
            </pre>
            <h1 className="sr-only">
              {activeTab === 'about'
                ? 'Aaron Lee Apolonio'
                : 'Aaron Lee Apolonio: Works'}
            </h1>
          </div>
        </div>

        {/* Toolbar & Tabs: About me | Works | Resume */}
        <div className="wiki-toolbar">
          {/* Navigation Tabs */}
          <ul className="wiki-tabs-left">
            <li className={`wiki-tab-item ${activeTab === 'about' ? 'active' : ''}`}>
              <button
                type="button"
                className="wiki-tab-link tab-about"
                onClick={() => handleSwitchTab('about')}
              >
                About me
              </button>
            </li>
            <li className={`wiki-tab-item ${activeTab === 'works' ? 'active' : ''}`}>
              <button
                type="button"
                className="wiki-tab-link tab-works"
                onClick={() => handleSwitchTab('works')}
              >
                Works
              </button>
            </li>
            <li className="wiki-tab-item">
              <a
                href="/assets/cv_apolonio-aaron-lee.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-tab-link tab-resume"
              >
                Resume
              </a>
            </li>
          </ul>

          {/* Search Input to the right side of the navigations */}
          <div className="wiki-toolbar-right" ref={searchContainerRef}>
            <div className="wiki-toolbar-search-box">
              <svg className="wiki-search-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
              <input
                type="text"
                className="wiki-search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchActive(true);
                }}
                onFocus={() => setIsSearchActive(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="wiki-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {isSearchActive && searchQuery.trim() !== '' && (
              <div className="wiki-toolbar-search-results">
                {filteredSearchResults.length === 0 ? (
                  <div className="wiki-search-item">
                    <span className="wiki-search-item-desc">No matching results for "{searchQuery}"</span>
                  </div>
                ) : (
                  filteredSearchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="wiki-search-item"
                      onClick={() => handleSelectSearchResult(item)}
                    >
                      <span className="wiki-search-item-title">{item.title}</span>
                      <span className="wiki-search-item-desc">
                        {item.desc} &bull; <em style={{ color: '#ffffff' }}>{item.page === 'about' ? 'About me' : 'Works'}</em>
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top Working Directory Breadcrumb Bar - Above Left & Right Side */}
        {activeTab !== 'about' && (
          <div className="wiki-works-top-bar">
            <div className="wiki-sidebar-wd">
              {worksView === 'root' && (
                <span className="wiki-sidebar-wd-current">works/</span>
              )}

              {worksView === 'projects' && (
                <>
                  <button
                    type="button"
                    className="wiki-sidebar-wd-btn"
                    onClick={() => handleNavigateWorks('root')}
                  >
                    works/
                  </button>
                  <span className="wiki-sidebar-wd-current">projects</span>
                </>
              )}

              {worksView === 'writeups' && (
                <>
                  <button
                    type="button"
                    className="wiki-sidebar-wd-btn"
                    onClick={() => handleNavigateWorks('root')}
                  >
                    works/
                  </button>
                  <span className="wiki-sidebar-wd-current">writeups</span>
                </>
              )}

              {worksView === 'writeups-category' && (
                <>
                  <button
                    type="button"
                    className="wiki-sidebar-wd-btn"
                    onClick={() => handleNavigateWorks('root')}
                  >
                    works/
                  </button>
                  <button
                    type="button"
                    className="wiki-sidebar-wd-btn"
                    onClick={() => handleNavigateWorks('writeups')}
                  >
                    writeups/
                  </button>
                  <span className="wiki-sidebar-wd-current">.{currentCategory.name}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Under Navigation: Sidebar + Content Layout */}
        <div className="wiki-content-layout">
          {/* Left Sidebar - Displayed for Works */}
          {activeTab !== 'about' && (
            <aside className="wiki-sidebar-left">
              <div className="wiki-sidebar-toc">
                {/* Back button below "works" (hypertext only, no bg) */}
                {worksView !== 'root' && (
                  <div style={{ marginBottom: '12px' }}>
                    <button
                      type="button"
                      className="wiki-sidebar-back-link"
                      onClick={() => {
                        if (worksView === 'projects') handleNavigateWorks('root');
                        else if (worksView === 'writeups') handleNavigateWorks('root');
                        else if (worksView === 'writeups-category') handleNavigateWorks('writeups');
                      }}
                    >
                      ← back
                    </button>
                  </div>
                )}

                {/* State 1: works/ */}
                {worksView === 'root' && (
                  <ul className="wiki-toc-nav-list" style={{ marginTop: '10px' }}>
                    <li className="wiki-toc-nav-item">
                      <button
                        type="button"
                        className="wiki-sidebar-hyperlink"
                        onClick={() => handleNavigateWorks('projects')}
                      >
                        projects
                      </button>
                    </li>
                    <li className="wiki-toc-nav-item">
                      <button
                        type="button"
                        className="wiki-sidebar-hyperlink"
                        onClick={() => handleNavigateWorks('writeups')}
                      >
                        writeups
                      </button>
                    </li>
                  </ul>
                )}

                {/* State 2: works/projects */}
                {worksView === 'projects' && (
                  <ul className="wiki-toc-nav-list" style={{ marginTop: '6px' }}>
                    {projects.map((proj) => {
                      const isSelected = selectedProjectId === proj.id;
                      return (
                        <li key={proj.id} className="wiki-toc-nav-item">
                          <button
                            type="button"
                            className={`wiki-sidebar-hyperlink ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectProject(proj.id)}
                          >
                            {proj.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* State 3: works/writeups */}
                {worksView === 'writeups' && (
                  <ul className="wiki-toc-nav-list" style={{ marginTop: '6px' }}>
                    {WRITEUP_CATEGORIES.map((cat) => (
                      <li key={cat.id} className="wiki-toc-nav-item">
                        <button
                          type="button"
                          className="wiki-sidebar-hyperlink"
                          onClick={() =>
                            handleNavigateWorks('writeups-category', { category: cat.slug })
                          }
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* State 4: works/writeups/<<name>> */}
                {worksView === 'writeups-category' && (
                  <ul className="wiki-toc-nav-list" style={{ marginTop: '6px' }}>
                    {getWriteupsByCategory(selectedCategoryId, writeups).map((w) => {
                      const isSelected = selectedWriteupId === w.id;
                      return (
                        <li key={w.id} className="wiki-toc-nav-item">
                          <button
                            type="button"
                            className={`wiki-sidebar-hyperlink ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectWriteup(w.id)}
                          >
                            {w.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="wiki-content-main">
            {activeTab === 'about' ? (
              <AboutPage
                onOpenSource={() => setIsSourceOpen(true)}
                onOpenLightbox={(src, title, desc) => setLightboxData({ src, title, desc })}
                onPlayAudio={handlePlayAudio}
              />
            ) : (
              <WorksPage
                worksView={worksView}
                selectedProjectId={selectedProjectId}
                selectedCategoryId={selectedCategoryId}
                selectedWriteupId={selectedWriteupId}
                onNavigate={handleNavigateWorks}
                projects={projects}
                writeups={writeups}
                onOpenLightbox={(src, title, desc) => setLightboxData({ src, title, desc })}
              />
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer onSwitchTab={handleSwitchTab} />

      {/* Floating Back to Top Button */}
      <button
        type="button"
        className={`wiki-back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={handleScrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        <span className="wiki-back-to-top-arrow" aria-hidden="true">↑</span>
        <span className="wiki-back-to-top-text-full">back to top</span>
        <span className="wiki-back-to-top-text-short">top</span>
      </button>

      {/* Modals */}
      <ViewSourceModal
        isOpen={isSourceOpen}
        onClose={() => setIsSourceOpen(false)}
        activeTab={activeTab}
        onCopy={handleCopyWikitext}
      />

      <ViewHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <LightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        data={lightboxData}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="wiki-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
