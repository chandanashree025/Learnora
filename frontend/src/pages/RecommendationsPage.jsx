import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import RecommendationCard from '../components/RecommendationCard';
import {
  Sparkles,
  Info,
  Filter,
  CheckCircle2,
  RefreshCw,
  Award,
} from 'lucide-react';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [sourceNote, setSourceNote] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getRecommendations();
      setRecommendations(res.data || []);
      setSourceNote(res.source || '');
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = recommendations.filter((r) => {
    if (filterType === 'All') return true;
    if (filterType === 'Revision') return r.badgeType === 'pink' || r.badgeText.includes('Revision');
    if (filterType === 'Practice') return r.type === 'quiz' || r.badgeType === 'yellow';
    if (filterType === 'Advanced') return r.badgeType === 'lavender' || r.difficulty === 'Advanced';
    return true;
  });

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content" style={{ padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--panel-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-sky">
              <Sparkles size={13} />
              Personalized AI Recommendation Engine
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--navy)', lineHeight: 1.2 }}>
            Tailored Learning Pathways
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '780px', lineHeight: 1.55 }}>
            Every suggestion below is derived from your real-time quiz attempts, topic mastery percentages, and active course syllabus milestones.
          </p>

          {/* Engine Explanation Card */}
          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            backgroundColor: 'var(--card-blue)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} color="var(--navy)" />
              <span style={{ fontSize: '0.86rem', color: 'var(--navy)', fontWeight: '600' }}>
                {sourceNote}
              </span>
            </div>

            <button
              onClick={fetchRecommendations}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} />
              Recalculate
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)' }}>Filter by Priority:</span>
          {['All', 'Revision', 'Practice', 'Advanced'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={filterType === type ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
            >
              {type === 'Revision' ? 'Priority Revision (<60%)' :
               type === 'Practice' ? 'Practice Quizzes (60-79%)' :
               type === 'Advanced' ? 'Advanced Challenges (≥80%)' : 'All Suggestions'}
            </button>
          ))}
        </div>

        {/* Recommendations Cards Grid */}
        {loading ? (
          <p style={{ color: 'var(--navy)', fontWeight: '600' }}>Generating personalized recommendations...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '40px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>No recommendations match this filter.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
