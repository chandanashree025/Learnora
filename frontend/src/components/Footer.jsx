import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--panel-main)',
      borderTop: '1px solid var(--border-light)',
      padding: '48px 24px 28px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '36px',
        marginBottom: '36px',
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <img
              src="/learnora-logo.png"
              alt="Learnora logo"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <span style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              color: 'var(--navy)',
              letterSpacing: '-0.02em',
            }}>
              Learnora
            </span>
          </div>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '14px',
          }}>
            AI-powered personalized learning management system designed to adapt to your unique pace, topic performance, and mastery goals.
          </p>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: 'var(--card-blue)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-light)',
            fontSize: '0.78rem',
            fontWeight: '700',
            color: 'var(--navy)',
            letterSpacing: '0.04em',
          }}>
            Learn &bull; Grow &bull; Achieve
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '14px' }}>
            Platform Modules
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/courses" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Course Catalogue
              </Link>
            </li>
            <li>
              <Link to="/login" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Student Dashboard
              </Link>
            </li>
            <li>
              <Link to="/login" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Adaptive Quizzes
              </Link>
            </li>
            <li>
              <Link to="/login" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Instructor Studio
              </Link>
            </li>
          </ul>
        </div>

        {/* Major Project Info */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '14px' }}>
            Project Architecture
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
            Developed as a College Major Project integrating React.js, Express REST APIs, Mongoose MongoDB, and rule-based algorithmic recommendations.
          </p>
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--navy)',
            fontWeight: '600',
          }}>
            Stack: React &bull; Node &bull; Express &bull; MongoDB
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <div>&copy; {new Date().getFullYear()} Learnora. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '18px' }}>
          <span>Official Brand: Learnora</span>
          <span>&bull;</span>
          <span>Tagline: Learn &bull; Grow &bull; Achieve</span>
        </div>
      </div>
    </footer>
  );
}
