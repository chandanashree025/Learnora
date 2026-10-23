import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, ArrowRight, GraduationCap, Users } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Field-level client validation
    if (!trimmedName || !trimmedEmail || !password) {
      setError('Please fill out all required fields: full name, email, and password.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address (e.g. student@learnora.edu).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register(trimmedName, trimmedEmail, password, role);

      // Only navigate if newUser was successfully created and returned
      if (newUser && newUser.role === 'instructor') {
        navigate('/instructor');
      } else if (newUser) {
        navigate('/dashboard');
      } else {
        throw new Error('Registration failed to create an authenticated session.');
      }
    } catch (err) {
      console.error('Registration attempt failed:', err);
      setError(err.message || 'Registration failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '480px',
        width: '100%',
        backgroundColor: 'var(--panel-main)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Brand Header with Learnora Official Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            Create an account to start your personalized learning journey
          </p>
        </div>

        {/* Error Alert (Strictly pink / red / navy, never green) */}
        {error && (
          <div style={{
            backgroundColor: 'var(--card-pink)',
            border: '1px solid #ebd0d7',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#8c2e47',
            fontSize: '0.84rem',
            fontWeight: '600',
            lineHeight: 1.45,
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection Toggle */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px' }}>
            Choose Your Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: role === 'student' ? '2px solid var(--navy)' : '1px solid var(--border-light)',
                backgroundColor: role === 'student' ? 'var(--card-blue)' : '#FFFFFF',
                color: 'var(--navy)',
                fontWeight: '700',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <Users size={16} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('instructor')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: role === 'instructor' ? '2px solid var(--navy)' : '1px solid var(--border-light)',
                backgroundColor: role === 'instructor' ? 'var(--card-lavender)' : '#FFFFFF',
                color: 'var(--navy)',
                fontWeight: '700',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <GraduationCap size={16} />
              Instructor
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Patel"
                style={{ width: '100%', paddingLeft: '38px' }}
                disabled={loading}
              />
            </div>
          </div>

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
                placeholder="name@example.com"
                style={{ width: '100%', paddingLeft: '38px' }}
                disabled={loading}
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
                placeholder="Minimum 6 characters"
                style={{ width: '100%', paddingLeft: '38px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '6px', padding: '12px' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '700', color: 'var(--navy)', textDecoration: 'underline' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
