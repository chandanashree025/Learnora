import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, UserCheck, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Fast-fill demo credentials for major project presentations
  const fillDemo = (role) => {
    if (role === 'student') {
      setEmail('student@learnora.edu');
      setPassword('Student@123');
    } else {
      setEmail('instructor@learnora.edu');
      setPassword('Instructor@123');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--panel-main)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Brand Header with Learnora Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <img
              src="/learnora-logo.png"
              alt="Learnora logo"
              style={{
                height: '56px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--navy)', letterSpacing: '-0.02em' }}>
              Learnora
            </div>
          </Link>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to access your personalized learning portal
          </p>
        </div>

        {/* Demo Credential Quick-Fill Chips */}
        <div style={{
          backgroundColor: 'var(--card-blue)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          marginBottom: '22px',
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--navy)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Demo Presentation Access:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillDemo('student')}
              style={{
                flex: 1,
                padding: '7px 10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <UserCheck size={14} color="var(--accent-sky)" />
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('instructor')}
              style={{
                flex: 1,
                padding: '7px 10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <GraduationCap size={14} color="#8c2e47" />
              Demo Instructor
            </button>
          </div>
        </div>

        {/* Error Alert (Strictly pink / red / navy, never green) */}
        {error && (
          <div style={{
            backgroundColor: 'var(--card-pink)',
            border: '1px solid #ebd0d7',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#8c2e47',
            fontSize: '0.84rem',
            fontWeight: '600',
          }}>
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@learnora.edu"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Learnora'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: '700', color: 'var(--navy)', textDecoration: 'underline' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
