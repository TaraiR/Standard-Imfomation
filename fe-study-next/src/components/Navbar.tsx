'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { curriculum } from '@/data/curriculum';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<'A' | 'B' | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const subjectA = curriculum.filter(c => c.subject === 'A');
  const subjectB = curriculum.filter(c => c.subject === 'B');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setDropdownOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  const isSubjectActive = (subject: 'A' | 'B') =>
    curriculum.filter(c => c.subject === subject)
      .some(c => pathname === `/chapter/${c.id}`);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-icon">📘</span>
          <span className="brand-text">基本情報技術者 学習サイト</span>
        </Link>

        <div className="nav-desktop">
          {(['A', 'B'] as const).map(subject => {
            const chapters = subject === 'A' ? subjectA : subjectB;
            return (
              <div className="dropdown-wrap" key={subject}>
                <button
                  className={`dropdown-trigger ${isSubjectActive(subject) ? 'active' : ''} ${dropdownOpen === subject ? 'open' : ''}`}
                  onClick={() => setDropdownOpen(dropdownOpen === subject ? null : subject)}
                >
                  <span className={`subject-tag subject-${subject.toLowerCase()}`}>科目{subject}</span>
                  <span className="dropdown-arrow">{dropdownOpen === subject ? '▲' : '▼'}</span>
                </button>
                {dropdownOpen === subject && (
                  <div className="dropdown-menu">
                    {chapters.map((ch, i) => (
                      <Link
                        key={ch.id}
                        href={`/chapter/${ch.id}`}
                        className={`dropdown-item ${pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
                      >
                        <span className="dropdown-num">{i + 1}</span>
                        {ch.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="メニュー">
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {(['A', 'B'] as const).map(subject => {
            const chapters = subject === 'A' ? subjectA : subjectB;
            return (
              <div className="mobile-section" key={subject}>
                <div className={`mobile-section-label subject-${subject.toLowerCase()}`}>科目{subject}</div>
                {chapters.map((ch, i) => (
                  <Link
                    key={ch.id}
                    href={`/chapter/${ch.id}`}
                    className={`mobile-link ${pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
                  >
                    <span className="mobile-num">{i + 1}</span>{ch.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
