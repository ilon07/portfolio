import React, { useState, useRef, useEffect } from 'react';

export default function Header({ activeTab, onSwitchTab, onNavigateSection }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchContainerRef = useRef(null);

  const searchableItems = [
    { title: "Aaron Lee Apolonio", desc: "DevOps & Cloud Infrastructure Engineer", target: "lead", page: "about" },
    { title: "Kubernetes & EKS", desc: "Multi-cluster orchestration, Cilium eBPF, Helm", target: "competencies", page: "about" },
    { title: "Infrastructure as Code (Terraform)", desc: "Modular HCL, Terragrunt, OpenTofu, State management", target: "competencies", page: "about" },
    { title: "GitOps & ArgoCD", desc: "Zero-touch continuous delivery, preview environments", target: "experience", page: "about" },
    { title: "Observability (Prometheus, Grafana, Thanos)", desc: "2.5M metrics/sec, SLO alerting, Loki logging", target: "competencies", page: "about" },
    { title: "CloudScale Systems", desc: "Staff / Senior DevOps Engineer (2024–Present)", target: "experience", page: "about" },
    { title: "Certifications: CKA, CKS, AWS Pro", desc: "Kubernetes Administrator & Security Specialist", target: "certifications", page: "about" },
    { title: "Projects", desc: "Technical works & architecture implementations", target: "section-projects", page: "works" },
    { title: "Writeups", desc: "Cybersecurity & CTF writeups", target: "section-writeups", page: "works" }
  ];

  const searchResults = searchQuery.trim() === '' ? [] : searchableItems.filter(item =>
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

  const handleSelectResult = (item) => {
    onNavigateSection(item.page, item.target);
    setSearchQuery('');
    setIsSearchActive(false);
  };

  return (
    <header className="wiki-header">
      <div className="wiki-header-start">
        <button type="button" className="wiki-hamburger" aria-label="Main menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" rx="1"></rect>
            <rect y="9" width="20" height="2" rx="1"></rect>
            <rect y="15" width="20" height="2" rx="1"></rect>
          </svg>
        </button>

        <a
          href="#about"
          className="wiki-brand"
          onClick={(e) => { e.preventDefault(); onSwitchTab('about'); }}
        >
          <div className="wiki-logo-icon">W</div>
          <div className="wiki-brand-text">
            <span className="wiki-brand-title">Wikipedia</span>
            <span className="wiki-brand-subtitle">The Free DevOps Encyclopedia</span>
          </div>
        </a>
      </div>

      {/* Center Search Input */}
      <div className="wiki-header-center" ref={searchContainerRef}>
        <div className="wiki-search-box">
          <svg className="wiki-search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
          <input
            type="text"
            className="wiki-search-input"
            placeholder="Search Aaron Lee Apolonio (e.g. Kubernetes, Terraform)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchActive(true);
            }}
            onFocus={() => setIsSearchActive(true)}
          />
        </div>

        {isSearchActive && searchQuery.trim() !== '' && (
          <div className="wiki-search-results">
            {searchResults.length === 0 ? (
              <div className="wiki-search-item">
                <span className="wiki-search-item-desc">No matching sections found for "{searchQuery}"</span>
              </div>
            ) : (
              searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="wiki-search-item"
                  onClick={() => handleSelectResult(item)}
                >
                  <span className="wiki-search-item-title">{item.title}</span>
                  <span className="wiki-search-item-desc">
                    {item.desc} &bull; <em style={{ color: '#ffffff' }}>{item.page === 'about' ? 'About me (Article)' : 'Works (Talk)'}</em>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Header End Actions (No toggle!) */}
      <div className="wiki-header-end">
        <a href="mailto:aaron.apolonio.devops@gmail.com" className="wiki-header-btn">Contact</a>
        <span className="wiki-header-divider">|</span>
        <a href="https://github.com/aaronleeapolonio" target="_blank" rel="noopener noreferrer" className="wiki-header-btn">GitHub</a>
      </div>
    </header>
  );
}