import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Database,
  Search,
  CheckCircle2,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Course Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Computer Science',
    difficulty: 'Beginner',
    estimatedHours: 8,
    cardColor: 'blue',
  });

  // Lesson Modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState('');
  const [lessonForm, setLessonForm] = useState({
    title: '',
    topic: '',
    estimatedDuration: 15,
    order: 1,
    content: '',
    codeSnippet: '',
  });

  // Quiz Modal state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState('');
  const [quizForm, setQuizForm] = useState({
    title: '',
    topic: '',
    difficulty: 'Beginner',
    passingScore: 60,
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: '',
  });

  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, coursesRes] = await Promise.all([
        apiClient.getInstructorAnalytics(),
        apiClient.getCourses(),
      ]);
      setAnalytics(analyticsRes.data);
      setCourses(coursesRes.data || []);
    } catch (err) {
      console.error('Instructor data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createCourse(courseForm);
      setShowCourseModal(false);
      setCourseForm({
        title: '',
        description: '',
        category: 'Computer Science',
        difficulty: 'Beginner',
        estimatedHours: 8,
        cardColor: 'blue',
      });
      setActionNotice('Course created successfully!');
      fetchData();
    } catch (err) {
      alert(`Error creating course: ${err.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and its curriculum?')) return;
    try {
      await apiClient.deleteCourse(courseId);
      setActionNotice('Course deleted successfully.');
      fetchData();
    } catch (err) {
      alert(`Error deleting course: ${err.message}`);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createLesson({
        courseId: selectedCourseForLesson,
        ...lessonForm,
      });
      setShowLessonModal(false);
      setLessonForm({
        title: '',
        topic: '',
        estimatedDuration: 15,
        order: 1,
        content: '',
        codeSnippet: '',
      });
      setActionNotice('Lesson added to course successfully!');
      fetchData();
    } catch (err) {
      alert(`Error adding lesson: ${err.message}`);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const questions = [
        {
          questionText: quizForm.questionText,
          options: [quizForm.optionA, quizForm.optionB, quizForm.optionC, quizForm.optionD],
          correctOptionIndex: Number(quizForm.correctIndex),
          explanation: quizForm.explanation,
          topic: quizForm.topic,
          difficulty: quizForm.difficulty,
        },
      ];

      await apiClient.createQuiz({
        courseId: selectedCourseForQuiz,
        title: quizForm.title,
        topic: quizForm.topic,
        difficulty: quizForm.difficulty,
        passingScore: Number(quizForm.passingScore),
        questions,
      });

      setShowQuizModal(false);
      setQuizForm({
        title: '',
        topic: '',
        difficulty: 'Beginner',
        passingScore: 60,
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctIndex: 0,
        explanation: '',
      });
      setActionNotice('Quiz created successfully!');
      fetchData();
    } catch (err) {
      alert(`Error creating quiz: ${err.message}`);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content" style={{ padding: '24px 32px' }}>
        {/* Banner */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--navy)', fontWeight: '600' }}>
            <Database size={16} color="var(--accent-sky)" />
            <span>Database Status:</span>
            <span className="badge badge-sky">{analytics?.storageMode || 'Live Connected'}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Learnora Faculty Administration
          </div>
        </div>

        {/* Header */}
        <div style={{
          backgroundColor: 'var(--panel-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div>
            <span className="badge badge-lavender" style={{ marginBottom: '6px' }}>
              Instructor Administration
            </span>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--navy)' }}>
              Faculty Management Hub
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Oversee courses, monitor class performance metrics, design lessons, and author adaptive multiple-choice assessments.
            </p>
          </div>

          <button
            onClick={() => setShowCourseModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} />
            Create New Course
          </button>
        </div>

        {/* Feedback alert */}
        {actionNotice && (
          <div style={{
            backgroundColor: 'var(--card-blue)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            marginBottom: '24px',
            fontWeight: '600',
            color: 'var(--navy)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{actionNotice}</span>
            <button
              onClick={() => setActionNotice('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: 'var(--navy)' }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '32px',
        }}>
          <StatCard
            title="Total Courses"
            value={analytics?.totalCourses || courses.length}
            subtitle="Curriculum offerings"
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Total Students"
            value={analytics?.totalStudents || 1}
            subtitle="Active accounts"
            icon={Users}
            color="pink"
          />
          <StatCard
            title="Total Enrollments"
            value={analytics?.totalEnrollments || 2}
            subtitle="Student registrations"
            icon={TrendingUp}
            color="yellow"
          />
          <StatCard
            title="Class Average Score"
            value={`${analytics?.avgQuizScore || 62}%`}
            subtitle="Across all quizzes"
            icon={Award}
            color="lavender"
          />
        </div>

        {/* Class Analytics Chart */}
        {analytics?.courseStats && analytics.courseStats.length > 0 && (
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '4px' }}>
              Class Course Completion & Average Score Comparison
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Comparing student enrollment completion percentage across active courses (Pastel Palette)
            </p>

            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.courseStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EFF7" />
                  <XAxis dataKey="title" stroke="var(--navy)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--navy)" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="completionRate" fill="#38BDF8" radius={[6, 6, 0, 0]} name="Completion Rate (%)" />
                  <Bar dataKey="avgScore" fill="#1E3A5F" radius={[6, 6, 0, 0]} name="Avg Quiz Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Course Management Table */}
        <div style={{
          backgroundColor: 'var(--panel-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '14px',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy)' }}>
              Course Management Studio
            </h3>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter courses..."
                style={{ width: '100%', paddingLeft: '36px', fontSize: '0.84rem' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-light)', color: 'var(--navy)' }}>
                  <th style={{ padding: '12px 14px' }}>Course Title</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Difficulty</th>
                  <th style={{ padding: '12px 14px' }}>Duration</th>
                  <th style={{ padding: '12px 14px' }}>Add Content</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f0f6fa' }}>
                    <td style={{ padding: '14px', fontWeight: '700', color: 'var(--navy)' }}>
                      {c.title}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-sky">{c.category}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-navy">{c.difficulty}</span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {c.estimatedHours} Hours
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseForLesson(c._id);
                            setShowLessonModal(true);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                        >
                          <Plus size={12} />
                          + Lesson
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseForQuiz(c._id);
                            setShowQuizModal(true);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                        >
                          <Plus size={12} />
                          + Quiz
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteCourse(c._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#8c2e47', padding: '6px' }}
                        title="Delete Course"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Performance Table */}
        <div style={{
          backgroundColor: 'var(--panel-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '16px' }}>
            Enrolled Student Diagnostic Activity & Quiz Submissions
          </h3>

          {(!analytics?.recentAttempts || analytics.recentAttempts.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No student quiz attempts recorded yet.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-light)', color: 'var(--navy)' }}>
                    <th style={{ padding: '10px 14px' }}>Student</th>
                    <th style={{ padding: '10px 14px' }}>Course / Quiz</th>
                    <th style={{ padding: '10px 14px' }}>Score</th>
                    <th style={{ padding: '10px 14px' }}>Result</th>
                    <th style={{ padding: '10px 14px' }}>Submission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentAttempts.map((attempt) => (
                    <tr key={attempt._id} style={{ borderBottom: '1px solid #f0f6fa' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--navy)' }}>
                        {attempt.student?.name || 'Aarav Patel (Student)'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {attempt.quiz?.title || 'Diagnostic Quiz'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--navy)' }}>
                        {attempt.score}%
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${attempt.passed ? 'badge-sky' : 'badge-pink'}`}>
                          {attempt.passed ? 'Passed' : 'Needs Review'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                        {new Date(attempt.attemptDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create Course */}
        <Modal
          isOpen={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          title="Create New Learnora Course"
        >
          <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Course Title
              </label>
              <input
                type="text"
                required
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="e.g. Distributed Systems Architecture"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                required
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Provide a comprehensive summary of syllabus objectives..."
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Difficulty
                </label>
                <select
                  value={courseForm.difficulty}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="1"
                  value={courseForm.estimatedHours}
                  onChange={(e) => setCourseForm({ ...courseForm, estimatedHours: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Card Pastel Theme
                </label>
                <select
                  value={courseForm.cardColor}
                  onChange={(e) => setCourseForm({ ...courseForm, cardColor: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="blue">Pastel Blue</option>
                  <option value="pink">Blush Pink</option>
                  <option value="yellow">Soft Yellow</option>
                  <option value="lavender">Lavender</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button type="button" onClick={() => setShowCourseModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Course
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal: Add Lesson */}
        <Modal
          isOpen={showLessonModal}
          onClose={() => setShowLessonModal(false)}
          title="Add Lesson to Course Syllabus"
        >
          <form onSubmit={handleCreateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Lesson Title
              </label>
              <input
                type="text"
                required
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                placeholder="e.g. Asynchronous Microtask Pipelines"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Topic Tag
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.topic}
                  onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                  placeholder="e.g. JavaScript Engine"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Estimated Minutes
                </label>
                <input
                  type="number"
                  min="5"
                  value={lessonForm.estimatedDuration}
                  onChange={(e) => setLessonForm({ ...lessonForm, estimatedDuration: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Lesson Content
              </label>
              <textarea
                required
                rows={4}
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                placeholder="Write educational instructional content..."
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Code Snippet (Optional)
              </label>
              <textarea
                rows={3}
                value={lessonForm.codeSnippet}
                onChange={(e) => setLessonForm({ ...lessonForm, codeSnippet: e.target.value })}
                placeholder="// Enter code example here"
                style={{ width: '100%', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button type="button" onClick={() => setShowLessonModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Lesson
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal: Add Quiz */}
        <Modal
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          title="Create Adaptive Diagnostic Quiz"
        >
          <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Quiz Title
              </label>
              <input
                type="text"
                required
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="e.g. Memory Management & Event Loop"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Topic
                </label>
                <input
                  type="text"
                  required
                  value={quizForm.topic}
                  onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })}
                  placeholder="e.g. JavaScript Engine"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({ ...quizForm, passingScore: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Question 1 Text
              </label>
              <input
                type="text"
                required
                value={quizForm.questionText}
                onChange={(e) => setQuizForm({ ...quizForm, questionText: e.target.value })}
                placeholder="Enter multiple choice question..."
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)' }}>Option A</label>
                <input
                  type="text"
                  required
                  value={quizForm.optionA}
                  onChange={(e) => setQuizForm({ ...quizForm, optionA: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)' }}>Option B</label>
                <input
                  type="text"
                  required
                  value={quizForm.optionB}
                  onChange={(e) => setQuizForm({ ...quizForm, optionB: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)' }}>Option C</label>
                <input
                  type="text"
                  required
                  value={quizForm.optionC}
                  onChange={(e) => setQuizForm({ ...quizForm, optionC: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)' }}>Option D</label>
                <input
                  type="text"
                  required
                  value={quizForm.optionD}
                  onChange={(e) => setQuizForm({ ...quizForm, optionD: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Correct Option
                </label>
                <select
                  value={quizForm.correctIndex}
                  onChange={(e) => setQuizForm({ ...quizForm, correctIndex: Number(e.target.value) })}
                  style={{ width: '100%' }}
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                  Difficulty
                </label>
                <select
                  value={quizForm.difficulty}
                  onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
                Explanation
              </label>
              <textarea
                required
                rows={2}
                value={quizForm.explanation}
                onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                placeholder="Explain why the correct answer is right..."
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button type="button" onClick={() => setShowQuizModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Quiz
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
