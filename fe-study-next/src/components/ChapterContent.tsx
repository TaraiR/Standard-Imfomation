'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Chapter } from '@/data/curriculum';
import Diagram from './Diagram';
import Quiz from './Quiz';

interface Props {
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export default function ChapterContent({ chapter, prevChapter, nextChapter }: Props) {
  const [activeSection, setActiveSection] = useState(0);
  const router = useRouter();

  const changeSection = (index: number) => {
    setActiveSection(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setActiveSection(0);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [chapter.id]);

  const section = chapter.sections[activeSection];
  const allQuestions = chapter.sections.flatMap(s => s.questions);

  return (
    <div className="chapter-page">
      <aside className="chapter-sidebar">
        <div className="sidebar-header">
          <span className={`subject-tag ${chapter.subject === 'A' ? 'subject-a' : 'subject-b'}`}>
            科目{chapter.subject}
          </span>
          <h1 className="sidebar-title">{chapter.title}</h1>
        </div>
        <nav className="section-nav">
          {chapter.sections.map((sec, i) => (
            <button
              key={sec.id}
              className={`section-nav-btn ${activeSection === i ? 'active' : ''}`}
              onClick={() => changeSection(i)}
            >
              <span className="sec-num">{i + 1}</span>
              {sec.title}
            </button>
          ))}
          <button
            className={`section-nav-btn ${activeSection === chapter.sections.length ? 'active' : ''}`}
            onClick={() => changeSection(chapter.sections.length)}
          >
            <span className="sec-num">✓</span>
            章末確認問題
          </button>
        </nav>
      </aside>

      <main className="chapter-main">
        <div className="breadcrumb">
          <Link href="/">トップ</Link>
          <span> / </span>
          <span>{chapter.title}</span>
          {activeSection < chapter.sections.length && (
            <><span> / </span><span>{section.title}</span></>
          )}
        </div>

        {activeSection < chapter.sections.length ? (
          <div className="section-content">
            <h2 className="section-title">{section.title}</h2>
            <div className="section-body" dangerouslySetInnerHTML={{ __html: section.content }} />
            {section.diagram && (
              <div className="diagram-wrapper">
                <Diagram type={section.diagram} />
              </div>
            )}
            {section.questions.length > 0 && (
              <div className="section-quiz">
                <h3 className="mini-quiz-title">このセクションの確認問題</h3>
                <Quiz key={section.id} questions={section.questions} />
              </div>
            )}
            <div className="section-nav-buttons">
              {activeSection > 0 && (
                <button className="nav-btn prev" onClick={() => changeSection(activeSection - 1)}>
                  ← {chapter.sections[activeSection - 1].title}
                </button>
              )}
              <button className="nav-btn next" onClick={() => changeSection(activeSection + 1)}>
                {activeSection < chapter.sections.length - 1
                  ? `次へ: ${chapter.sections[activeSection + 1].title} →`
                  : '章末確認問題へ →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="section-content">
            <h2 className="section-title">章末確認問題：{chapter.title}</h2>
            <p className="chapter-quiz-desc">この章で学んだ内容を確認しましょう。全 {allQuestions.length} 問です。</p>
            <Quiz key="chapter-end" questions={allQuestions} />

            <a href="https://www.fe-siken.com/fekakomon.php" target="_blank" rel="noopener noreferrer" className="kakomon-banner">
              <span className="kakomon-icon">📝</span>
              <div className="kakomon-text">
                <strong>過去問道場で実力試し</strong>
                <span>実際の過去問を解いて合格力をつけよう（fe-siken.com）</span>
              </div>
              <span className="kakomon-arrow">→</span>
            </a>

            <div className="chapter-nav">
              {prevChapter && (
                <button className="nav-btn prev" onClick={() => router.push(`/chapter/${prevChapter.id}`)}>
                  ← 前の章: {prevChapter.title}
                </button>
              )}
              {nextChapter && (
                <button className="nav-btn next" onClick={() => router.push(`/chapter/${nextChapter.id}`)}>
                  次の章: {nextChapter.title} →
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
