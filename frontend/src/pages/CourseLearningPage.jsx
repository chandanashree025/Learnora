import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Check,
  Code2,
} from 'lucide-react';

export default function CourseLearningPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadCourseData = async () => {
      try {
        const res = await apiClient.getCourseById(id);
        const data = res.data;
        setCourse(data);
        const lList = data.lessons || [];
        setLessons(lList);
        setQuizzes(data.quizzes || []);

        // Track completed lessons from server
        const completedIds = new Set(
          (data.lessonProgress || [])
            .filter((p) => p.completed)
            .map((p) => String(p.lesson))
        );
        setCompletedLessonIds(completedIds);
        setProgressPercentage(data.enrollment?.progress || 0);

        // Select lesson from query parameter or default to 0
        const queryLessonId = searchParams.get('lesson');
        if (queryLessonId) {
          const foundIdx = lList.findIndex((l) => String(l._id) === String(queryLessonId));
          if (foundIdx !== -1) setCurrentLessonIndex(foundIdx);
        }
      } catch (err) {
        console.error('Failed to load course lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id, isAuthenticated]);

  const currentLesson = lessons[currentLessonIndex];
  const isCurrentCompleted = currentLesson ? completedLessonIds.has(String(currentLesson._id)) : false;

  const handleSelectLesson = (idx) => {
    setCurrentLessonIndex(idx);
    setFeedbackNotice('');
    if (lessons[idx]) {
      setSearchParams({ lesson: lessons[idx]._id });
    }
  };

  const handleMarkCompleted = async () => {
    if (!currentLesson) return;
    setMarkingComplete(true);
    setFeedbackNotice('');

    try {
      const res = await apiClient.markLessonCompleted(currentLesson._id);
      setCompletedLessonIds((prev) => new Set([...prev, String(currentLesson._id)]));
      setProgressPercentage(res.data.percentage);
      setFeedbackNotice(`✓ Marked "${currentLesson.title}" as completed!`);
    } catch (err) {
      setFeedbackNotice(`Error: ${err.message}`);
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      handleSelectLesson(currentLessonIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      handleSelectLesson(currentLessonIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--navy)', fontWeight: '600' }}>Loading lesson syllabus...</p>
        </main>
      </div>
    );
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Link to="/courses" className="btn btn-outline btn-sm">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <div style={{ marginTop: '24px' }}>
            <h2>No lessons found for this course.</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content" style={{ padding: '24px 32px' }}>
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}>
          <div>
            <Link
              to="/courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: '700',
                color: 'var(--navy)',
                marginBottom: '4px',
              }}
            >
              <ArrowLeft size={15} />
              Catalogue
            </Link>
            <h1 style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--navy)' }}>
              {course.title}
            </h1>
          </div>

          {/* Quick Quiz launcher */}
          {quizzes.length > 0 && (
            <Link
              to={`/quiz/${quizzes[0]._id}`}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={15} />
              Take Adaptive Quiz ({quizzes[0].title})
            </Link>
          )}
        </div>

        {/* Course Progress Bar */}
        <div style={{
          backgroundColor: 'var(--panel-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)' }}>
              Syllabus Completion
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--navy)' }}>
              {progressPercentage}% Completed ({completedLessonIds.size} of {lessons.length} lessons)
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {/* Learning Layout Grid: Sidebar Lessons + Lesson Reader */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Syllabus Navigation Panel */}
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--accent-sky)" />
              Course Lessons
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lessons.map((lesson, idx) => {
                const isActive = idx === currentLessonIndex;
                const isCompleted = completedLessonIds.has(String(lesson._id));

                return (
                  <button
                    key={lesson._id}
                    onClick={() => handleSelectLesson(idx)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isActive ? 'var(--navy)' : isCompleted ? 'var(--card-blue)' : '#FFFFFF',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--navy)' : 'var(--border-light)',
                      color: isActive ? '#FFFFFF' : 'var(--navy)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        opacity: isActive ? 0.9 : 0.6,
                        flexShrink: 0,
                      }}>
                        0{idx + 1}
                      </span>
                      <span style={{
                        fontSize: '0.86rem',
                        fontWeight: isActive ? '700' : '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {lesson.title}
                      </span>
                    </div>

                    {/* Completion mark: sky blue / navy, strictly no green! */}
                    {isCompleted && (
                      <CheckCircle2
                        size={17}
                        color={isActive ? '#38BDF8' : 'var(--navy)'}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Lesson Content Reader */}
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {/* Lesson Header */}
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="badge badge-sky">Topic: {currentLesson.topic}</span>
                <span className="badge badge-blue">{currentLesson.estimatedDuration || 15} Mins</span>
                {isCurrentCompleted && (
                  <span className="badge badge-lavender">
                    <CheckCircle2 size={12} />
                    Completed
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--navy)', lineHeight: 1.25 }}>
                {currentLesson.title}
              </h2>
            </div>

            {/* Notification alert on action */}
            {feedbackNotice && (
              <div style={{
                backgroundColor: 'var(--card-blue)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                marginBottom: '20px',
                fontWeight: '600',
                color: 'var(--navy)',
                fontSize: '0.88rem',
              }}>
                {feedbackNotice}
              </div>
            )}

            {/* Key Takeaways Card */}
            {currentLesson.keyPoints && currentLesson.keyPoints.length > 0 && (
              <div style={{
                backgroundColor: 'var(--card-blue)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 22px',
                marginBottom: '28px',
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  color: 'var(--navy)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <Sparkles size={14} color="var(--accent-sky)" />
                  Core Knowledge Objectives
                </div>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentLesson.keyPoints.map((pt, i) => (
                    <li key={i} style={{ fontSize: '0.88rem', color: 'var(--navy)', lineHeight: 1.5 }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Lesson Body Text */}
            <div style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '28px',
              whiteSpace: 'pre-line',
            }}>
              {currentLesson.content}
            </div>

            {/* Code Snippet Box (Strictly styled using Navy & Pastel Blue/Peach highlights) */}
            {currentLesson.codeSnippet && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--navy)',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  borderTopLeftRadius: 'var(--radius-sm)',
                  borderTopRightRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                }}>
                  <Code2 size={16} color="var(--accent-sky)" />
                  <span>Verified Syntax / Code Architecture</span>
                </div>
                <pre style={{
                  backgroundColor: '#132640',
                  color: '#BAE6FD',
                  padding: '18px 20px',
                  borderBottomLeftRadius: 'var(--radius-sm)',
                  borderBottomRightRadius: 'var(--radius-sm)',
                  fontFamily: 'Consolas, Monaco, "Courier New", Courier, monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  overflowX: 'auto',
                }}>
                  <code>{currentLesson.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Navigation and Completion Action Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-light)',
              flexWrap: 'wrap',
              gap: '14px',
            }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentLessonIndex === 0}
                className="btn btn-outline"
                style={{ opacity: currentLessonIndex === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={18} />
                Previous Lesson
              </button>

              <button
                type="button"
                onClick={handleMarkCompleted}
                disabled={markingComplete || isCurrentCompleted}
                className={`btn ${isCurrentCompleted ? 'btn-sky' : 'btn-primary'}`}
              >
                {isCurrentCompleted ? (
                  <>
                    <Check size={16} />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    {markingComplete ? 'Saving Progress...' : 'Mark as Completed'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentLessonIndex === lessons.length - 1}
                className="btn btn-outline"
                style={{ opacity: currentLessonIndex === lessons.length - 1 ? 0.4 : 1 }}
              >
                Next Lesson
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
