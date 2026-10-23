import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sparkles, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      backgroundColor: 'rgba(255, 253, 249, 0.92)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand & Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img
            src="/learnora-logo.png"
            alt="Learnora logo"
            style={{
              height: '42px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <div>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: '800',
              color: 'var(--navy)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontFamily: "'Outfit', sans-serif",
            }}>
              Learnora
            </div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: '600',
              color: 'var(--accent-sky)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Learn &bull; Grow &bull; Achieve
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link
            to="/courses"
            style={{
              fontSize: '0.94rem',
              fontWeight: '600',
              color: 'var(--navy)',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={16} color="var(--navy)" />
            Course Catalogue
          </Link>

          <Link
            to="/#features"
            style={{
              fontSize: '0.94rem',
              fontWeight: '600',
              color: 'var(--navy)',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} color="var(--accent-sky)" />
            AI Adaptive Engine
          </Link>
        </nav>

        {/* Auth CTA Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={user?.role === 'instructor' ? '/instructor' : '/dashboard'}
                className="btn btn-primary btn-sm"
              >
                <LayoutDashboard size={15} />
                {user?.role === 'instructor' ? 'Instructor Portal' : 'My Dashboard'}
              </Link>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={15} />
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
