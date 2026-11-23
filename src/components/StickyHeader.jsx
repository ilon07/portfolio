import React, { useState, useEffect } from 'react';

export default function StickyHeader({ activeTab, onSwitchTab }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 140);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`wiki-sticky-header ${isVisible ? 'visible' : ''}`} aria-hidden={!isVisible}>
      <div className="wiki-sticky-start">
        <span className="wiki-sticky-title">
          {activeTab === 'about' 
            ? 'Aaron Lee Apolonio' 
            : 'Aaron Lee Apolonio: Works'}
        </span>
      </div>

      <div className="wiki-sticky-actions">
        <button 
          type="button" 
          className={`wiki-header-btn ${activeTab === 'about' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'about' ? 'bold' : 'normal', color: activeTab === 'about' ? '#ffffff' : '#999999' }}
          onClick={() => onSwitchTab('about')}
        >
          About me
        </button>
        <button 
          type="button" 
          className={`wiki-header-btn ${activeTab === 'works' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'works' ? 'bold' : 'normal', color: activeTab === 'works' ? '#ffffff' : '#999999' }}
          onClick={() => onSwitchTab('works')}
        >
          Works
        </button>
        <a 
          href="/assets/cv_apolonio-aaron-lee.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="wiki-header-btn"
          style={{ fontWeight: 'normal', color: '#999999', textDecoration: 'none' }}
        >
          Resume
        </a>
      </div>
    </header>
  );
}
