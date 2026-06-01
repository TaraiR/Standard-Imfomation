import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { curriculum } from '../data/curriculum';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const subjectA = curriculum.filter(c => c.subject === 'A');
  const subjectB = curriculum.filter(c => c.subject === 'B');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="brand-icon">📘</span>
          <span className="brand-text">基本情報技術者 学習サイト</span>
        </Link>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="メニュー">
          <span /><span /><span />
        </button>

        <div className={`nav-menu ${open ? 'open' : ''}`}>
          <div className="nav-group">
            <span className="nav-group-label subject-a">科目A</span>
            {subjectA.map(ch => (
              <Link
                key={ch.id}
                to={`/chapter/${ch.id}`}
                className={`nav-link ${location.pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {ch.title}
              </Link>
            ))}
          </div>
          <div className="nav-group">
            <span className="nav-group-label subject-b">科目B</span>
            {subjectB.map(ch => (
              <Link
                key={ch.id}
                to={`/chapter/${ch.id}`}
                className={`nav-link ${location.pathname === `/chapter/${ch.id}` ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {ch.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
