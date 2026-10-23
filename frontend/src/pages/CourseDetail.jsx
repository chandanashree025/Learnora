import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  BookOpen,
  Clock,
  User,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await apiClient.getCourseById(id);
        setCourseData(res.data);
      } catch (err) {
        console.error('Failed to load course detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await apiClient.enrollCourse(id);
      const updated = await apiClient.getCourseById(id);
      setCourseData(updated.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--navy)' }}>
        Loading syllabus details...
      </div>
    );
  }

  if (!courseData) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--navy)' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const isEnrolled = !!courseData.enrollment;
  const lessons = courseData.lessons || [];
  const quizzes = courseData.quizzes || [];

  const content = (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Back button */}
      <Link
        to="/courses"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.86rem',
          fontWeight: '700',
          color: 'var(--navy)',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={16} />
        Back to Course Catalogue
      </Link>

      {/* Hero Header */}
      <div style={{
        backgroundColor: 'var(--panel-main)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <span className="badge badge-sky">{courseData.category}</span>
          <span className="badge badge-navy">{courseData.difficulty}</span>
        </div>

        <h1 style={{ fontSize: '2.3rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '14px', lineHeight: 1.2 }}>
          {courseData.title}
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          {courseData.description}
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-light)',
          marginBottom: '24px',
          fontSize: '0.9rem',
          color: 'var(--navy)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--accent-sky)" />
            Instructor: <strong>{courseData.instructorName || 'Learnora Faculty'}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--accent-sky)" />
            Estimated: <strong>{courseData.estimatedHours || 10} Hours</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--accent-sky)" />
            Curriculum: <strong>{lessons.length} Lessons, {quizzes.length} Diagnostic Quizzes</strong>
          </span>
        </div>

        {/* Call to Action */}
        <div>
          {isEnrolled ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to={`/learn/${courseData._id}`} className="btn btn-primary btn-lg">
                <span>Continue Course Syllabus</span>
                <ArrowRight size={18} />
              </Link>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                You are enrolled! Current progress: {courseData.enrollment?.progress || 0}%
              </div>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="btn btn-primary btn-lg"
            >
              {enrolling ? 'Enrolling...' : 'Enroll in this Course Now'}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Syllabus Breakdown */}
      <div style={{
        backgroundColor: 'var(--panel-main)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '20px' }}>
          Course Syllabus & Learning Modules
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
          {lessons.map((lesson, idx) => (
            <div
              key={lesson._id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--card-blue)',
                  color: 'var(--navy)',
                  fontWeight: '800',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--navy)' }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Topic: {lesson.topic} &bull; {lesson.estimatedDuration || 15} mins
                  </div>
                </div>
              </div>

              {isEnrolled && (
                <Link
                  to={`/learn/${courseData._id}?lesson=${lesson._id}`}
                  className="btn btn-outline btn-sm"
                >
                  Start Lesson
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--accent-sky)" />
              Diagnostic Adaptive Quizzes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  style={{
                    backgroundColor: 'var(--card-blue)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--navy)' }}>
                      {quiz.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Topic: {quiz.topic} &bull; Passing Score: {quiz.passingScore || 60}%
                    </div>
                  </div>
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Start Adaptive Quiz
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return isAuthenticated ? (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{content}</main>
    </div>
  ) : (
    <div>
      <Navbar />
      <div style={{ padding: '30px 24px' }}>{content}</div>
    </div>
  );
}
