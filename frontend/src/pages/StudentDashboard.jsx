import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Database,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function StudentDashboard() {
  const { user, storageMode } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, enrollmentsRes, recsRes] = await Promise.all([
          apiClient.getStudentAnalytics(),
          apiClient.getMyEnrollments(),
          apiClient.getRecommendations(),
        ]);

        setAnalytics(analyticsRes.data);
        setEnrollments(enrollmentsRes.data || []);
        setRecommendations(recsRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardColors = ['blue', 'pink', 'yellow', 'lavender'];

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        {/* Transparent Storage Mode Banner */}
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
            <span>Active Database Engine:</span>
            <span className="badge badge-sky">{analytics?.storageMode || storageMode}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            College Major Project &bull; Learnora Adaptive Runtime
          </div>
        </div>

        {/* Welcome Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-peach">
                <Flame size={12} />
                Streak: 4 Days Active
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--navy)', lineHeight: 1.2 }}>
              Welcome back, {user?.name || 'Scholar'}!
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your personalized curriculum has been updated based on your recent quiz scores.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/courses" className="btn btn-outline btn-sm">
              <BookOpen size={16} />
              Browse Catalogue
            </Link>
            <Link to="/recommendations" className="btn btn-primary btn-sm">
              <Sparkles size={16} />
              View Recommendations
            </Link>
          </div>
        </div>

        {/* 4 Pastel Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '32px',
        }}>
          <StatCard
            title="Enrolled Courses"
            value={analytics?.totalCoursesEnrolled ?? enrollments.length}
            subtitle={`${analytics?.completedCoursesCount ?? 0} course(s) completed`}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Overall Progress"
            value={`${analytics?.avgProgress ?? 0}%`}
            subtitle={`${analytics?.completedLessonsCount ?? 0} lessons finished`}
            icon={TrendingUp}
            color="pink"
          />
          <StatCard
            title="Average Quiz Score"
            value={`${analytics?.avgScore ?? 0}%`}
            subtitle={`Across ${analytics?.totalQuizzesTaken ?? 0} attempt(s)`}
            icon={Award}
            color="yellow"
          />
          <StatCard
            title="Weekly Activity"
            value="12.4 Hrs"
            subtitle="Paced for steady growth"
            icon={Clock}
            color="lavender"
          />
        </div>

        {/* Continue Learning Section */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--navy)' }}>
              Continue Learning
            </h2>
            <Link to="/courses" style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Courses <ArrowRight size={14} />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              textAlign: 'center',
            }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You have not enrolled in any courses yet.
              </p>
              <Link to="/courses" className="btn btn-primary btn-sm">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {enrollments.map((enr, idx) => {
                const course = enr.course || {};
                const color = course.cardColor || cardColors[idx % cardColors.length];
                const cardClass = `card-pastel-${color}`;

                return (
                  <div
                    key={enr._id}
                    className={cardClass}
                    style={{
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span className="badge badge-sky">
                          {course.category || 'Computer Science'}
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)' }}>
                          {course.difficulty || 'Beginner'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.18rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>
                        {course.title}
                      </h3>

                      <p style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {course.description}
                      </p>
                    </div>

                    <div>
                      {/* Progress Bar */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px' }}>
                          <span>Progress</span>
                          <span>{enr.progress || 0}%</span>
                        </div>
                        <div className="progress-bar-container">
                          <div
                            className={`progress-bar-fill ${color === 'pink' ? 'peach' : color === 'lavender' ? 'lavender' : ''}`}
                            style={{ width: `${enr.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        to={`/learn/${course._id}`}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      >
                        Resume Syllabus
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Personalized Recommendations Section */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent-sky)" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--navy)' }}>
                  Recommended for You
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                AI-curated based on topic performance and recent quiz results.
              </p>
            </div>
            <Link to="/recommendations" style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--navy)' }}>
              See All Suggestions &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {recommendations.slice(0, 3).map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </section>

        {/* Analytics & Activity Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          {/* Weekly Learning Activity Chart */}
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--navy)' }}>
                  Weekly Study Hours
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Activity trend across current week
                </span>
              </div>
              <span className="badge badge-blue">
                Consistent Pacing
              </span>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.weeklyActivity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EFF7" />
                  <XAxis dataKey="day" stroke="var(--navy)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--navy)" fontSize={12} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="hours" fill="#38BDF8" radius={[6, 6, 0, 0]} name="Hours Studied" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Study Planner */}
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--navy)' }}>
                    Upcoming Study Schedule
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Curated weekly milestones
                  </span>
                </div>
                <Calendar size={18} color="var(--navy)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--card-blue)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--navy)' }}>
                      Python Functions & Recursion
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Today &bull; 25 Minutes scheduled
                    </div>
                  </div>
                  <span className="badge badge-sky">Today</span>
                </div>

                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--card-yellow)',
                  border: '1px solid #ebd6a0',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--navy)' }}>
                      B-Tree Indexing Diagnostic Quiz
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Tomorrow &bull; 10 Minutes scheduled
                    </div>
                  </div>
                  <span className="badge badge-yellow">Upcoming</span>
                </div>

                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--card-lavender)',
                  border: '1px solid #dcd4f0',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--navy)' }}>
                      Full-Stack REST Architecture
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Friday &bull; 30 Minutes scheduled
                    </div>
                  </div>
                  <span className="badge badge-lavender">Friday</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target: Complete 3 lessons before Sunday
              </span>
            </div>
          </div>
        </div>

        {/* Recent Quiz Results Table */}
        <div style={{
          backgroundColor: 'var(--panel-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--navy)' }}>
              Recent Quiz Results & Diagnostic Breakdown
            </h3>
            <Link to="/analytics" style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)' }}>
              Detailed Analytics &rarr;
            </Link>
          </div>

          {(!analytics?.recentAttempts || analytics.recentAttempts.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No quiz attempts recorded yet. Take an adaptive quiz to start receiving recommendations!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-light)', color: 'var(--navy)' }}>
                    <th style={{ padding: '10px 14px' }}>Quiz Title</th>
                    <th style={{ padding: '10px 14px' }}>Course</th>
                    <th style={{ padding: '10px 14px' }}>Score</th>
                    <th style={{ padding: '10px 14px' }}>Result</th>
                    <th style={{ padding: '10px 14px' }}>Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentAttempts.map((attempt) => (
                    <tr key={attempt._id} style={{ borderBottom: '1px solid #f0f6fa' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--navy)' }}>
                        {attempt.quiz?.title || 'Course Quiz'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {attempt.course?.title || 'Computer Science'}
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
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <Link
                          to={`/quiz/${attempt.quiz?._id || attempt.quiz}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          Retry Quiz
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
