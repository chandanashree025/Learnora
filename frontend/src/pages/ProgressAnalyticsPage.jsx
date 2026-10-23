import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import {
  BarChart3,
  Award,
  TrendingUp,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
} from 'recharts';

export default function ProgressAnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.getStudentAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartColors = ['#1E3A5F', '#38BDF8', '#FDBA9A', '#B8A6E8'];

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content" style={{ padding: '24px 32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-sky">
              <BarChart3 size={13} />
              Performance Analytics
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--navy)' }}>
            Learning Analytics & Diagnostic Insights
          </h1>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Inspect your overall syllabus progress, topic-wise mastery levels, quiz history, and targeted growth suggestions.
          </p>
        </div>

        {/* 4 Pastel Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '32px',
        }}>
          <StatCard
            title="Syllabus Progress"
            value={`${analytics?.avgProgress || 0}%`}
            subtitle="Across enrolled courses"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Completed Lessons"
            value={analytics?.completedLessonsCount || 0}
            subtitle="Modules finished"
            icon={CheckCircle2}
            color="pink"
          />
          <StatCard
            title="Average Quiz Score"
            value={`${analytics?.avgScore || 0}%`}
            subtitle={`${analytics?.totalQuizzesTaken || 0} quizzes submitted`}
            icon={Award}
            color="yellow"
          />
          <StatCard
            title="Total Study Hours"
            value="12.4"
            subtitle="Recorded platform time"
            icon={Compass}
            color="lavender"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Topic-Wise Scores Bar Chart */}
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{ fontSize: '1.18rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
              Topic-Wise Mastery Breakdown
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Average score by concept area (calculated from verified submissions)
            </p>

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.topicScores || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EFF7" />
                  <XAxis
                    dataKey="topic"
                    stroke="var(--navy)"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="var(--navy)" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="averageScore" radius={[6, 6, 0, 0]} name="Score (%)">
                    {analytics?.topicScores?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.averageScore >= 75 ? '#38BDF8' : entry.averageScore >= 60 ? '#FDBA9A' : '#1E3A5F'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quiz Score History Timeline Chart */}
          <div style={{
            backgroundColor: 'var(--panel-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{ fontSize: '1.18rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>
              Score Trajectory & History
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Performance trend over chronological attempts
            </p>

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    analytics?.recentAttempts?.map((a, i) => ({
                      attempt: `#${i + 1}`,
                      title: a.quiz?.title || 'Quiz',
                      score: a.score,
                    })).reverse() || []
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EFF7" />
                  <XAxis dataKey="attempt" stroke="var(--navy)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--navy)" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#1E3A5F"
                    strokeWidth={3}
                    dot={{ fill: '#38BDF8', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Score (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths & Improvement Areas Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Strengths Card */}
          <div className="card-pastel-blue" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="var(--navy)" />
              Verified Topic Strengths (≥75%)
            </h3>

            {(!analytics?.strengths || analytics.strengths.length === 0) ? (
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Keep completing quizzes! Scoring 75% or higher on concepts will populate your verified strengths here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analytics.strengths.map((str, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--navy)' }}>
                      {str.topic}
                    </span>
                    <span className="badge badge-sky">{str.averageScore}% Mastery</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="card-pastel-pink" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#8c2e47', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#8c2e47" />
              Focus Areas for Revision (&lt;60%)
            </h3>

            {(!analytics?.needsImprovement || analytics.needsImprovement.length === 0) ? (
              <p style={{ fontSize: '0.86rem', color: '#8c2e47' }}>
                Great job! No topics currently fall below the 60% revision threshold.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analytics.needsImprovement.map((imp, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #ebd0d7',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--navy)' }}>
                      {imp.topic}
                    </span>
                    <span className="badge badge-pink">{imp.averageScore}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Redirect Banner */}
        <div style={{
          backgroundColor: 'var(--card-lavender)',
          border: '1px solid #dcd4f0',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color="var(--navy)" />
              <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--navy)' }}>
                Ready to act on these diagnostic findings?
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              The Learnora AI engine has converted your performance data into custom revision and challenge recommendations.
            </p>
          </div>

          <Link to="/recommendations" className="btn btn-primary">
            <span>Open AI Recommendations</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
