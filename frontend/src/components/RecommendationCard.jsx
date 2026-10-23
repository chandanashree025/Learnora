import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, Compass, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  const {
    id,
    type,
    courseTitle,
    title,
    topic,
    difficulty,
    estimatedDuration,
    badgeType = 'blue',
    badgeText = 'Recommended',
    reason,
    actionLabel = 'Start Now',
    actionUrl = '#',
  } = recommendation;

  const badgeClass = `badge badge-${badgeType}`;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-xs)',
      transition: 'var(--transition)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative top color stripe */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor:
          badgeType === 'pink' ? 'var(--card-pink)' :
          badgeType === 'yellow' ? 'var(--card-yellow)' :
          badgeType === 'lavender' ? 'var(--card-lavender)' :
          'var(--accent-sky)',
      }} />

      <div>
        {/* Header badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          <span className={badgeClass}>
            <Sparkles size={12} />
            {badgeText}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            {type === 'quiz' ? 'Adaptive Quiz' : type === 'lesson' ? 'Lesson Focus' : 'Course Pathway'}
          </span>
        </div>

        {/* Course context */}
        {courseTitle && (
          <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--accent-sky)', marginBottom: '4px' }}>
            {courseTitle}
          </div>
        )}

        {/* Title */}
        <h3 style={{ fontSize: '1.08rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.3 }}>
          {title}
        </h3>

        {/* Explainable Reason Box */}
        <div style={{
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Compass size={12} color="var(--navy)" />
            Why this is recommended:
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {reason}
          </p>
        </div>
      </div>

      {/* Footer details & Action button */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '14px',
          paddingTop: '8px',
          borderTop: '1px solid #f0f6fa',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="var(--navy)" />
            {estimatedDuration}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={13} color="var(--navy)" />
            {difficulty}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {topic}
          </span>
        </div>

        <Link
          to={actionUrl}
          className="btn btn-primary"
          style={{ width: '100%', boxSizing: 'border-box', fontSize: '0.86rem' }}
        >
          <span>{actionLabel}</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
