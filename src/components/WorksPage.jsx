import React, { useState } from 'react';
import { projects as defaultProjects } from '../data/projects';
import {
  writeups as defaultWriteups,
  getWriteupsByCategory
} from '../data/writeups';

export default function WorksPage({
  worksView = 'root',
  selectedProjectId = null,
  selectedCategoryId = null,
  selectedWriteupId = null,
  projects = defaultProjects,
  writeups = defaultWriteups,
  onOpenLightbox
}) {
  const [copiedFlag, setCopiedFlag] = useState(null);

  const handleCopyFlag = (flagText, type) => {
    navigator.clipboard.writeText(flagText);
    setCopiedFlag(type);
    setTimeout(() => setCopiedFlag(null), 2000);
  };

  // 1. Root view: works/
  // "the project and writeup hyperlink text are on the sidebar left, the contents of the right side are just a text that i will decide later"
  if (worksView === 'root') {
    return (
      <article id="page-works">
        <h2
          className="wiki-h2"
          style={{
            borderBottom: 'none',
            paddingBottom: 0,
            marginBottom: '10px',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--wiki-text)'
          }}
        >
          <span>Works</span>
        </h2>
        <p
          className="wiki-paragraph"
          style={{
            color: 'var(--wiki-text-muted)',
            lineHeight: 1.65,
            fontSize: '0.96rem'
          }}
        >
          Select a directory from the left sidebar to explore projects or CTF writeups.
        </p>
      </article>
    );
  }

  // 2. Projects view: works/projects
  // "the first projects that is on the list will show on the right body contents"
  if (worksView === 'projects') {
    const activeProject =
      projects.find((p) => p.id === selectedProjectId) || projects[0];

    if (!activeProject) {
      return (
        <article id="page-works">
          <p className="wiki-paragraph" style={{ color: 'var(--wiki-text-muted)' }}>
            No project selected.
          </p>
        </article>
      );
    }

    return (
      <article id="page-works" key={activeProject.id}>
        <h2
          className="wiki-h2"
          style={{
            borderBottom: 'none',
            paddingBottom: 0,
            marginBottom: '6px',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--wiki-text)'
          }}
        >
          <span>{activeProject.title}</span>
        </h2>

        {activeProject.meta && (
          <p
            className="wiki-paragraph"
            style={{
              color: 'var(--wiki-text-muted)',
              fontSize: '0.88rem',
              marginBottom: '16px'
            }}
          >
            {activeProject.meta}
          </p>
        )}

        {activeProject.image && (
          <div style={{ margin: '16px 0 20px 0' }}>
            <img
              src={activeProject.image}
              alt={activeProject.title}
              style={{
                maxWidth: '100%',
                maxHeight: '440px',
                height: 'auto',
                display: 'block',
                cursor: onOpenLightbox ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (onOpenLightbox) {
                  onOpenLightbox(activeProject.image, activeProject.title, activeProject.meta);
                }
              }}
            />
          </div>
        )}

        {activeProject.overview && (
          <p
            className="wiki-paragraph"
            style={{
              marginBottom: '20px',
              lineHeight: '1.65',
              color: 'var(--wiki-text)'
            }}
          >
            {activeProject.overview}
          </p>
        )}

        {activeProject.link && (
          <p className="wiki-paragraph" style={{ marginTop: '16px' }}>
            <a
              href={activeProject.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '3px'
              }}
            >
              {activeProject.linkLabel || 'Visit Project'}
            </a>
          </p>
        )}
      </article>
    );
  }

  // 3. Writeups view: works/writeups
  if (worksView === 'writeups') {
    return (
      <article id="page-works">
        <h2
          className="wiki-h2"
          style={{
            borderBottom: 'none',
            paddingBottom: 0,
            marginBottom: '10px',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--wiki-text)'
          }}
        >
          <span>Writeups</span>
        </h2>
        <p
          className="wiki-paragraph"
          style={{
            color: 'var(--wiki-text-muted)',
            lineHeight: 1.65,
            fontSize: '0.96rem'
          }}
        >
          Select a CTF competition category from the sidebar to explore challenge writeups.
        </p>
      </article>
    );
  }

  // 4. Category view: works/writeups/<<name>>
  // "when its works/writeups/<<name>> the right side body content will automatically show the first on the list on the left sidebar will show the list of the writeup under that category or folder"
  const categoryWriteups = getWriteupsByCategory(selectedCategoryId, writeups);
  const activeWriteup =
    categoryWriteups.find((w) => w.id === selectedWriteupId) ||
    writeups.find((w) => w.id === selectedWriteupId) ||
    categoryWriteups[0] ||
    writeups[0];

  if (!activeWriteup) {
    return (
      <article id="page-works">
        <p className="wiki-paragraph" style={{ color: 'var(--wiki-text-muted)' }}>
          No writeup available in this category.
        </p>
      </article>
    );
  }

  const filteredTech = (activeWriteup?.tags || []).filter(
    (t) =>
      !t.toLowerCase().includes('ctf') &&
      t.toLowerCase() !== activeWriteup?.platform?.toLowerCase() &&
      t.toLowerCase() !== activeWriteup?.category?.toLowerCase()
  );
  const techStack =
    filteredTech.length > 0
      ? filteredTech
      : (activeWriteup?.tags || []).filter((t) => !t.toLowerCase().includes('ctf'));

  return (
    <article id="page-works" key={activeWriteup.id}>
      <h2
        className="wiki-h2"
        style={{
          borderBottom: 'none',
          paddingBottom: 0,
          marginBottom: '6px',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--wiki-text)'
        }}
      >
        <span>{activeWriteup.title}</span>
      </h2>

      {/* Writeup metadata line: Platform • Difficulty • Date • Read time */}
      <p
        className="wiki-paragraph"
        style={{
          color: 'var(--wiki-text-muted)',
          fontSize: '0.88rem',
          marginBottom: '14px'
        }}
      >
        <span>{activeWriteup.platform}</span>
        {activeWriteup.difficulty && <span> • {activeWriteup.difficulty}</span>}
        {activeWriteup.date && <span> • {activeWriteup.date}</span>}
        {activeWriteup.readTime && <span> • {activeWriteup.readTime}</span>}
      </p>

      {/* Genre, Target & Tech Stack */}
      {(activeWriteup.category || activeWriteup.ip || techStack.length > 0) && (
        <div
          style={{
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.88rem',
            color: 'var(--wiki-text-muted)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
            {activeWriteup.category && (
              <div>
                <strong style={{ color: 'var(--wiki-text)' }}>GENRE: </strong>
                <span>{activeWriteup.category}</span>
              </div>
            )}
            {activeWriteup.ip && (
              <div>
                <strong style={{ color: 'var(--wiki-text)' }}>TARGET: </strong>
                {activeWriteup.ip.startsWith('http') ? (
                  <a
                    href={activeWriteup.ip}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ffffff', textDecoration: 'underline' }}
                  >
                    {activeWriteup.ip}
                  </a>
                ) : (
                  <span>{activeWriteup.ip}</span>
                )}
              </div>
            )}
          </div>

          {techStack.length > 0 && (
            <div>
              <strong style={{ color: 'var(--wiki-text)' }}>TECH STACK: </strong>
              <span>{techStack.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Excerpt */}
      {activeWriteup.excerpt && (
        <p
          className="wiki-paragraph"
          style={{
            fontSize: '0.96rem',
            lineHeight: '1.65',
            color: 'var(--wiki-text)',
            marginBottom: '20px'
          }}
        >
          {activeWriteup.excerpt}
        </p>
      )}

      {/* Flags Section */}
      {(activeWriteup.userFlag || activeWriteup.rootFlag) && (
        <div style={{ marginBottom: '22px' }}>
          {activeWriteup.userFlag && (
            <div
              style={{
                marginBottom: '12px',
                background: '#0a0a0a',
                padding: '10px 14px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--wiki-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {activeWriteup.userFlagLabel ||
                    (activeWriteup.rootFlag ? 'User Flag (user.txt)' : 'Flag')}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyFlag(activeWriteup.userFlag, 'user')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999999',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    padding: 0
                  }}
                >
                  {copiedFlag === 'user' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code
                style={{
                  fontFamily: 'var(--wiki-font-mono, monospace)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  wordBreak: 'break-all'
                }}
              >
                {activeWriteup.userFlag}
              </code>
            </div>
          )}

          {activeWriteup.rootFlag && (
            <div
              style={{
                marginBottom: '12px',
                background: '#0a0a0a',
                padding: '10px 14px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--wiki-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {activeWriteup.rootFlagLabel || 'Root Flag (root.txt)'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyFlag(activeWriteup.rootFlag, 'root')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999999',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    padding: 0
                  }}
                >
                  {copiedFlag === 'root' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code
                style={{
                  fontFamily: 'var(--wiki-font-mono, monospace)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  wordBreak: 'break-all'
                }}
              >
                {activeWriteup.rootFlag}
              </code>
            </div>
          )}
        </div>
      )}

      {/* Content Blocks */}
      {activeWriteup.content && (
        <div className="wiki-writeup-content">
          {activeWriteup.content.map((block, idx) => {
            if (block.type === 'heading') {
              return (
                <h3
                  key={idx}
                  className="wiki-h3"
                  style={{
                    borderBottom: 'none',
                    paddingBottom: 0,
                    marginTop: '28px',
                    marginBottom: '10px',
                    fontSize: '1.18rem',
                    fontWeight: 600,
                    color: 'var(--wiki-text)'
                  }}
                >
                  {block.text}
                </h3>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p
                  key={idx}
                  className="wiki-paragraph"
                  style={{
                    marginBottom: '14px',
                    lineHeight: '1.65',
                    whiteSpace: 'pre-line',
                    color: 'var(--wiki-text)'
                  }}
                >
                  {block.text}
                </p>
              );
            }
            if (block.type === 'table') {
              return (
                <div key={idx} style={{ overflowX: 'auto', marginBottom: '18px' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--wiki-font-mono, monospace)',
                      background: '#0a0a0a',
                      border: '1px solid #1f2937'
                    }}
                  >
                    {block.headers && (
                      <thead>
                        <tr style={{ borderBottom: '1px solid #374151', background: '#111827' }}>
                          {block.headers.map((h, hIdx) => (
                            <th
                              key={hIdx}
                              style={{
                                padding: '9px 14px',
                                textAlign: 'left',
                                color: '#e5e7eb',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em'
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {block.rows?.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{
                            borderBottom: rIdx < block.rows.length - 1 ? '1px solid #1f2937' : 'none'
                          }}
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              style={{
                                padding: '9px 14px',
                                color: cIdx === 0 ? '#9ca3af' : '#f3f4f6',
                                fontWeight: cIdx === 0 ? 500 : 400
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (block.type === 'code') {
              return (
                <pre
                  key={idx}
                  style={{
                    background: '#0a0a0a',
                    padding: '14px',
                    borderRadius: '0',
                    overflowX: 'auto',
                    marginBottom: '16px',
                    border: 'none'
                  }}
                >
                  <code
                    style={{
                      fontFamily: 'var(--wiki-font-mono, monospace)',
                      color: '#e5e7eb',
                      fontSize: '0.85rem',
                      lineHeight: '1.5'
                    }}
                  >
                    {block.code}
                  </code>
                </pre>
              );
            }
            if (
              block.type === 'file' ||
              block.type === 'download' ||
              (block.type === 'image' && block.src?.endsWith('.zip'))
            ) {
              return (
                <div key={idx} style={{ margin: '16px 0' }}>
                  <a
                    href={block.src || block.href}
                    download
                    style={{
                      color: '#ffffff',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      fontSize: '0.92rem'
                    }}
                  >
                    {block.label || block.filename || 'Download file'}
                  </a>
                  {block.caption && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--wiki-text-muted)', marginTop: '4px' }}>
                      {block.caption}
                    </p>
                  )}
                </div>
              );
            }
            if (block.type === 'image') {
              return (
                <figure key={idx} style={{ margin: '20px 0', textAlign: 'center' }}>
                  <img
                    src={block.src}
                    alt={block.alt || 'Challenge Artifact'}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      cursor: onOpenLightbox ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (onOpenLightbox) {
                        onOpenLightbox(block.src, activeWriteup.title, block.caption || block.alt);
                      }
                    }}
                    loading="lazy"
                  />
                  {block.caption && (
                    <figcaption
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--wiki-text-muted)',
                        marginTop: '6px'
                      }}
                    >
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return null;
          })}
        </div>
      )}
    </article>
  );
}

export { WorksPage as ProjectsPage, WorksPage };
