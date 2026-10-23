import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'var(--card-blue)', border: 'var(--border-light)', iconBg: '#FFFFFF', iconColor: 'var(--navy)' },
    pink: { bg: 'var(--card-pink)', border: '#ebd0d7', iconBg: '#FFFFFF', iconColor: '#8c2e47' },
    yellow: { bg: 'var(--card-yellow)', border: '#ebd6a0', iconBg: '#FFFFFF', iconColor: '#7a5e12' },
    lavender: { bg: 'var(--card-lavender)', border: '#dcd4f0', iconBg: '#FFFFFF', iconColor: '#553c7b' },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div style={{
      backgroundColor: scheme.bg,
      border: `1px solid ${scheme.border}`,
      borderRadius: 'var(--radius-md)',
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-xs)',
      transition: 'var(--transition)',
    }}>
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--navy)', margin: '4px 0 2px', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: scheme.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <Icon size={22} color={scheme.iconColor} />
        </div>
      )}
    </div>
  );
}
