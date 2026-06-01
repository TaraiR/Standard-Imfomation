import React from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '../data/curriculum';

const Home: React.FC = () => {
  const subjectA = curriculum.filter(c => c.subject === 'A');
  const subjectB = curriculum.filter(c => c.subject === 'B');

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">基本情報技術者試験</h1>
          <p className="hero-subtitle">図解でわかりやすく学べる無料学習サイト</p>
          <div className="hero-badges">
            <span className="badge badge-a">科目A 対応</span>
            <span className="badge badge-b">科目B 対応</span>
            <span className="badge badge-q">章末問題付き</span>
          </div>
          <Link to="/chapter/a1" className="btn-start">学習を始める →</Link>
        </div>
        <div className="hero-illustration">
          <svg viewBox="0 0 200 200" width="200" height="200">
            <circle cx="100" cy="100" r="90" fill="#667eea" opacity="0.1"/>
            <rect x="50" y="60" width="100" height="80" rx="8" fill="white" stroke="#667eea" strokeWidth="2"/>
            <line x1="65" y1="85" x2="135" y2="85" stroke="#667eea" strokeWidth="2"/>
            <line x1="65" y1="100" x2="120" y2="100" stroke="#e2e8f0" strokeWidth="2"/>
            <line x1="65" y1="115" x2="130" y2="115" stroke="#e2e8f0" strokeWidth="2"/>
            <circle cx="140" cy="145" r="20" fill="#48bb78"/>
            <text x="140" y="151" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">✓</text>
          </svg>
        </div>
      </section>

      <section className="subject-section">
        <h2 className="section-heading">
          <span className="subject-tag subject-a">科目A</span>
          テクノロジ・マネジメント・ストラテジ
        </h2>
        <p className="section-desc">
          コンピュータ基礎・ネットワーク・セキュリティ・経営など幅広い知識を問われます。
        </p>
        <div className="chapter-grid">
          {subjectA.map((ch, i) => (
            <Link key={ch.id} to={`/chapter/${ch.id}`} className="chapter-card chapter-card-a">
              <div className="chapter-num">第{i + 1}章</div>
              <h3 className="chapter-card-title">{ch.title}</h3>
              <p className="chapter-card-desc">{ch.description}</p>
              <div className="chapter-card-footer">
                <span>{ch.sections.length} セクション</span>
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="subject-section">
        <h2 className="section-heading">
          <span className="subject-tag subject-b">科目B</span>
          アルゴリズムとプログラミング
        </h2>
        <p className="section-desc">
          擬似コードを読み解き、アルゴリズムやデータ構造の問題を解く力を養います。
        </p>
        <div className="chapter-grid">
          {subjectB.map((ch, i) => (
            <Link key={ch.id} to={`/chapter/${ch.id}`} className="chapter-card chapter-card-b">
              <div className="chapter-num">第{i + 1}章</div>
              <h3 className="chapter-card-title">{ch.title}</h3>
              <p className="chapter-card-desc">{ch.description}</p>
              <div className="chapter-card-footer">
                <span>{ch.sections.length} セクション</span>
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2>このサイトの特徴</h2>
        <div className="features-grid">
          {[
            { icon: '🎨', title: '図解つき解説', desc: '難しい概念もSVG図解でひと目でわかる' },
            { icon: '✏️', title: '章末問題', desc: '各章の終わりに確認問題で定着チェック' },
            { icon: '💻', title: '擬似コード', desc: '科目Bの擬似コードをステップで解説' },
            { icon: '📱', title: 'スマホ対応', desc: 'どこでも学べるレスポンシブデザイン' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
