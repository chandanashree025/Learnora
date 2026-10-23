import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  BarChart3,
  LogOut,
  GraduationCap,
  Layers,
  Database,
  Users,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout, storageMode } = useAuth();
  const navigate = useNavigate();
  const isInstructor = user?.role === 'instructor';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Course Catalogue', icon: BookOpen },
    { to: '/recommendations', label: 'AI Recommendations', icon: Sparkles },
    { to: '/analytics', label: 'Progress & Analytics', icon: BarChart3 },
  ];

  const instructorLinks = [
    { to: '/instructor', label: 'Instructor Hub', icon: LayoutDashboard },
    { to: '/courses', label: 'Explore Catalogue', icon: BookOpen },
    { to: '/instructor/courses', label: 'Course Studio', icon: Layers },
    { to: '/instructor/analytics', label: 'Class Analytics', icon: BarChart3 },
  ];

  const links = isInstructor ? instructorLinks : studentLinks;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <img
          src="/learnora-logo.png"
          alt="Learnora logo"
          style={{
            height: '38px',
            width: '38px',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--navy)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Learnora
          </div>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            color: 'var(--accent-sky)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {isInstructor ? 'Instructor Console' : 'Student Portal'}
          </div>
        </div>
      </div>

      {/* Role & Storage Status Pill */}
      <div style={{ padding: '14px 20px 8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: isInstructor ? 'var(--card-lavender)' : 'var(--card-blue)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
          fontSize: '0.78rem',
          color: 'var(--navy)',
          fontWeight: '600',
        }}>
          {isInstructor ? <GraduationCap size={16} /> : <Users size={16} />}
          <span>Role: {isInstructor ? 'Instructor' : 'Student'}</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/instructor'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: isActive ? '700' : '600',
                color: isActive ? '#FFFFFF' : 'var(--navy)',
                backgroundColor: isActive ? 'var(--navy)' : 'transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} color={isActive ? '#FFFFFF' : 'var(--accent-sky)'} />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Storage Mode Transparency Indicator */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          padding: '8px 10px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-light)',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Database size={13} color="var(--accent-sky)" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {storageMode.includes('Live') ? 'MongoDB Online' : 'Local Dev Mode'}
          </span>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div style={{
        padding: '16px 18px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(234, 245, 252, 0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=1E3A5F`}
            alt={user?.name || 'User'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1.5px solid var(--accent-sky)',
              objectFit: 'cover',
            }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--navy)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.name || 'Learnora User'}
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.email || 'user@learnora.edu'}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: 'none',
            border: 'none',
            padding: '6px',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--navy)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-pink)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
