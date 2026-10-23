import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Sparkles,
  BookOpen,
  Target,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '70px 24px 60px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Tagline Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'var(--card-blue)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <Sparkles size={16} color="var(--accent-sky)" />
          <span style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--navy)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            Learnora Official LMS &bull; Learn  Grow  Achieve
          </span>
        </div>

        {/* Hero Heading */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: '800',
          color: 'var(--navy)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: '880px',
          margin: '0 auto 20px',
        }}>
          Learn Smarter. <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--navy) 20%, #0284C7 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Grow at Your Pace.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.18rem',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}>
          Traditional LMS platforms treat every student the same. Learnora analyzes your quiz performance, pinpoints your exact topic strengths and weaknesses, and curates personalized lessons, revision guides, and practice challenges in real time.
        </p>

        {/* Hero CTA Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/courses" className="btn btn-outline btn-lg">
            <BookOpen size={18} color="var(--navy)" />
            <span>Explore Courses</span>
          </Link>
        </div>

        {/* Live Visual Dashboard Preview */}
        <div style={{
          maxWidth: '1080px',
          margin: '0 auto',
          backgroundColor: 'var(--panel-main)',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'left',
        }}>
          {/* Mock Window Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '14px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-peach)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--card-yellow)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-sky)' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '10px' }}>
                learnora.edu/student/dashboard
              </span>
            </div>
            <div className="badge badge-sky">
              Adaptive Engine Active
            </div>
          </div>

          {/* Mini preview grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="card-pastel-blue" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>COURSES ENROLLED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)' }}>4 Active</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Python, JS, DB, Web</div>
            </div>
            <div className="card-pastel-pink" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>AVERAGE SCORE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)' }}>82.5%</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Evaluated across 3 Quizzes</div>
            </div>
            <div className="card-pastel-yellow" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>STUDY GOAL</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)' }}>4.2 Hrs</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Weekly activity pacing</div>
            </div>
            <div className="card-pastel-lavender" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>AI SUGGESTIONS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)' }}>3 Ready</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Derived from quiz results</div>
            </div>
          </div>

          {/* AI Banner inside Preview */}
          <div style={{
            backgroundColor: 'var(--card-white)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--card-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={20} color="var(--navy)" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--navy)' }}>
                  Personalized Recommendation: Review Schema Normalization
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Recommended because your Database Fundamentals quiz score was 50%.
                </div>
              </div>
            </div>
            <span className="btn btn-primary btn-sm">
              Review Lesson
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" style={{
        padding: '70px 24px',
        backgroundColor: 'var(--panel-main)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-blue" style={{ marginBottom: '12px' }}>
            ENGINE ARCHITECTURE
          </div>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '16px' }}>
            How Learnora Transforms Your Study Experience
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 48px' }}>
            Unlike standard video repositories, Learnora continually diagnoses your knowledge retention and shapes your custom curriculum.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', textAlign: 'left' }}>
            {/* Feature 1 */}
            <div className="card-pastel-blue" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <Zap size={24} color="var(--navy)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px' }}>
                  Adaptive Quizzing
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  One-question-at-a-time quizzes with instant server-side evaluation. Never trust client-side scoring; all scores and topic breakdowns are authenticated.
                </p>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--navy)' }}>
                <CheckCircle2 size={16} color="var(--accent-sky)" />
                Verified Server Grading
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card-pastel-pink" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <Sparkles size={24} color="#8c2e47" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px' }}>
                  Explainable AI Suggestions
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Scored under 60%? Receive beginner revision cards. Scored 60-79%? Get targeted practice quizzes. Scored 80%+? Unlock advanced challenges with transparent explanations.
                </p>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', color: '#8c2e47' }}>
                <CheckCircle2 size={16} color="#8c2e47" />
                Rule-Based Transparency
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card-pastel-lavender" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <BarChart2 size={24} color="#553c7b" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px' }}>
                  Progress & Analytics
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Visual radar and timeline charts tracking topic-wise mastery, weekly activity hours, and historical quiz trends without any visual fatigue.
                </p>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', color: '#553c7b' }}>
                <CheckCircle2 size={16} color="#553c7b" />
                Comprehensive Diagnostics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section style={{
        padding: '70px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          backgroundColor: 'var(--card-blue)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '14px' }}>
            Ready to Experience Personalized Learning with Learnora?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px' }}>
            Join our adaptive platform today. Explore courses, take your first quiz, and experience an LMS that adapts to your mind.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Student Account
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
