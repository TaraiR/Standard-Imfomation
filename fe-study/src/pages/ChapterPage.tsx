import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getChapterById, curriculum } from '../data/curriculum';
import Diagram from '../components/Diagram';
import Quiz from '../components/Quiz';

const ChapterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chapter = getChapterById(id || '');
  const [activeSection, setActiveSection] = useState(0);

  // セクション変更時にページ先頭にスクロール
  const changeSection = (index: number) => {
    setActiveSection(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // チャプターが変わったらセクションをリセット
  useEffect(() => {
    setActiveSection(0);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [id]);

  if (!chapter) {
    return (
      <div className="not-found">
        <h2>章が見つかりません</h2>
        <Link to="/">トップに戻る</Link>
      </div>
    );
  }

  const allChapters = curriculum;
  const currentIndex = allChapters.findIndex(c => c.id === id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const section = chapter.sections[activeSection];
  const allQuestions = chapter.sections.flatMap(s => s.questions);

  return (
    <div className="chapter-page">
      <aside className="chapter-sidebar">
        <div className="sidebar-header">
          <span className={`subject-tag ${chapter.subject === 'A' ? 'subject-a' : 'subject-b'}`}>
            科目{chapter.subject}
          </span>
          <h2 className="sidebar-title">{chapter.title}</h2>
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
          <Link to="/">トップ</Link>
          <span> / </span>
          <span>{chapter.title}</span>
          {activeSection < chapter.sections.length && (
            <>
              <span> / </span>
              <span>{section.title}</span>
            </>
          )}
        </div>

        {activeSection < chapter.sections.length ? (
          <div className="section-content">
            <h2 className="section-title">{section.title}</h2>

            <div
              className="section-body"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />

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
              <button
                className="nav-btn next"
                onClick={() => changeSection(activeSection + 1)}
              >
                {activeSection < chapter.sections.length - 1
                  ? `次へ: ${chapter.sections[activeSection + 1].title} →`
                  : '章末確認問題へ →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="section-content">
            <h2 className="section-title">章末確認問題：{chapter.title}</h2>
            <p className="chapter-quiz-desc">
              この章で学んだ内容を確認しましょう。全 {allQuestions.length} 問です。
            </p>
            <Quiz key="chapter-end" questions={allQuestions} />

            <div className="chapter-nav">
              {prevChapter && (
                <button className="nav-btn prev" onClick={() => navigate(`/chapter/${prevChapter.id}`)}>
                  ← 前の章: {prevChapter.title}
                </button>
              )}
              {nextChapter && (
                <button className="nav-btn next" onClick={() => navigate(`/chapter/${nextChapter.id}`)}>
                  次の章: {nextChapter.title} →
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChapterPage;
