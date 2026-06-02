import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { curriculum } from '../data/curriculum';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<'A' | 'B' | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const subjectA = curriculum.filter(c => c.subject === 'A');
  const subjectB = curriculum.filter(c => c.subject === 'B');

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ページ遷移時に閉じる
  useEffect(() => {
    setDropdownOpen(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const isSubjectActive = (subject: 'A' | 'B') =>
    curriculum.filter(c => c.subject === subject)
      .some(c => location.pathname === `/chapter/${c.id}`);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📘</span>
          <span className="brand-text">基本情報技術者 学習サイト</span>
        </Link>

        {/* デスクトップ: ドロップダウン */}
        <div className="nav-desktop">
          {/* 科目A ドロップダウン */}
          <div className="dropdown-wrap">
            <button
              className={`dropdown-trigger ${isSubjectActive('A') ? 'active' : ''} ${dropdownOpen === 'A' ? 'open' : ''}`}
              onClick={() => setDropdownOpen(dropdownOpen === 'A' ? null : 'A')}
            >
              <span className="subject-tag subject-a">科目A</span>
              <span className="dropdown-arrow">{dropdownOpen === 'A' ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen === 'A' && (
              <div className="dropdown-menu">
                {subjectA.map((ch, i) => (
                  <Link
                    key={ch.id}
                    to={`/chapter/${ch.id}`}
                    className={`dropdown-item ${location.pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
                  >
                    <span className="dropdown-num">{i + 1}</span>
                    {ch.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 科目B ドロップダウン */}
          <div className="dropdown-wrap">
            <button
              className={`dropdown-trigger ${isSubjectActive('B') ? 'active' : ''} ${dropdownOpen === 'B' ? 'open' : ''}`}
              onClick={() => setDropdownOpen(dropdownOpen === 'B' ? null : 'B')}
            >
              <span className="subject-tag subject-b">科目B</span>
              <span className="dropdown-arrow">{dropdownOpen === 'B' ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen === 'B' && (
              <div className="dropdown-menu">
                {subjectB.map((ch, i) => (
                  <Link
                    key={ch.id}
                    to={`/chapter/${ch.id}`}
                    className={`dropdown-item ${location.pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
                  >
                    <span className="dropdown-num">{i + 1}</span>
                    {ch.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ハンバーガー（モバイル） */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="メニュー">
          <span /><span /><span />
        </button>
      </div>

      {/* モバイルメニュー */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-section">
            <div className="mobile-section-label subject-a">科目A</div>
            {subjectA.map((ch, i) => (
              <Link
                key={ch.id}
                to={`/chapter/${ch.id}`}
                className={`mobile-link ${location.pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
              >
                <span className="mobile-num">{i + 1}</span>{ch.title}
              </Link>
            ))}
          </div>
          <div className="mobile-section">
            <div className="mobile-section-label subject-b">科目B</div>
            {subjectB.map((ch, i) => (
              <Link
                key={ch.id}
                to={`/chapter/${ch.id}`}
                className={`mobile-link ${location.pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
              >
                <span className="mobile-num">{i + 1}</span>{ch.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
