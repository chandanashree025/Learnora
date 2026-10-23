import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import {
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';

export default function AdaptiveQuizPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchQuiz();
  }, [id, isAuthenticated]);

  const fetchQuiz = async () => {
    setLoading(true);
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const res = await apiClient.getQuizById(id);
      setQuiz(res.data);
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);

    try {
      // Format answers payload
      const userAnswers = Object.entries(selectedAnswers).map(([qIdx, optIdx]) => ({
        questionIndex: Number(qIdx),
        selectedOptionIndex: Number(optIdx),
      }));

      // Server calculates score based on stored correct answers
      const res = await apiClient.submitQuiz(id, userAnswers);
      setResult(res.data);
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--navy)', fontWeight: '600' }}>Loading adaptive quiz evaluation...</p>
        </main>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <h2>Quiz not found</h2>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Courses
          </Link>
        </main>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content" style={{ padding: '24px 32px' }}>
        {/* If Quiz is Submitted, show Comprehensive Results View */}
        {result ? (
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            {/* Results Score Header */}
            <div style={{
              backgroundColor: 'var(--panel-main)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              textAlign: 'center',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: result.passed ? 'var(--card-blue)' : 'var(--card-pink)',
                border: '1.5px solid var(--border-light)',
                marginBottom: '16px',
              }}>
                <Award size={36} color="var(--navy)" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className={`badge ${result.passed ? 'badge-sky' : 'badge-pink'}`}>
                  {result.passed ? 'Assessment Passed' : 'Revision Required'}
                </span>
                <span className="badge badge-navy">Passing Threshold: {result.passingScore}%</span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--navy)', margin: '10px 0' }}>
                Your Score: {result.score}%
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 20px' }}>
                Answered {result.correctAnswersCount} of {result.totalQuestions} questions correctly.
              </p>

              {/* Recommendation Hint Box */}
              <div style={{
                backgroundColor: 'var(--card-blue)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                maxWidth: '680px',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                textAlign: 'left',
              }}>
                <Sparkles size={20} color="var(--accent-sky)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--navy)', textTransform: 'uppercase' }}>
                    AI Recommendation Impact:
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--navy)', lineHeight: 1.45, marginTop: '3px' }}>
                    {result.recommendationHint}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={fetchQuiz}
                  className="btn btn-outline"
                >
                  <RotateCcw size={16} />
                  Retry This Quiz
                </button>
                <Link to="/recommendations" className="btn btn-primary">
                  <Sparkles size={16} />
                  View Updated Recommendations
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Topic-Wise Performance Breakdown */}
            <div style={{
              backgroundColor: 'var(--panel-main)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="var(--accent-sky)" />
                Topic-Wise Diagnostic Performance
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {result.topicWisePerformance?.map((tp, idx) => {
                  const isStrong = tp.percentage >= 75;
                  const isModerate = tp.percentage >= 60 && tp.percentage < 75;

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--navy)' }}>
                          {tp.topic}
                        </span>
                        <span className={`badge ${isStrong ? 'badge-sky' : isModerate ? 'badge-yellow' : 'badge-pink'}`}>
                          {tp.percentage}%
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {tp.correctCount} of {tp.totalCount} correct
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar-fill ${!isStrong && !isModerate ? 'peach' : ''}`}
                          style={{ width: `${tp.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question by Question Detailed Feedback & Explanations */}
            <div style={{
              backgroundColor: 'var(--panel-main)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '20px' }}>
                Question Explanations & Solution Key
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {result.detailedFeedback?.map((item, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        Question {qIdx + 1} &bull; {item.topic}
                      </span>
                      {/* Strictly NO green: Passed/Correct is Sky Blue, Incorrect is Blush Pink */}
                      <span className={`badge ${item.isCorrect ? 'badge-sky' : 'badge-pink'}`}>
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '14px', lineHeight: 1.4 }}>
                      {item.questionText}
                    </h3>

                    {/* Options list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      {item.options.map((opt, optIdx) => {
                        const isCorrectAnswer = optIdx === item.correctOptionIndex;
                        const wasSelected = optIdx === item.selectedOptionIndex;

                        let optBg = '#FFFFFF';
                        let optBorder = 'var(--border-light)';
                        let optColor = 'var(--navy)';

                        if (isCorrectAnswer) {
                          // Correct answer strictly styled with Sky Blue / Pastel Blue, NEVER GREEN!
                          optBg = 'var(--card-blue)';
                          optBorder = 'var(--accent-sky)';
                          optColor = 'var(--navy)';
                        } else if (wasSelected && !item.isCorrect) {
                          // Wrong choice selected
                          optBg = 'var(--card-pink)';
                          optBorder = '#ebd0d7';
                          optColor = '#8c2e47';
                        }

                        return (
                          <div
                            key={optIdx}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: optBg,
                              border: `1.5px solid ${optBorder}`,
                              fontSize: '0.86rem',
                              fontWeight: isCorrectAnswer || wasSelected ? '700' : '500',
                              color: optColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>{opt}</span>
                            {isCorrectAnswer && (
                              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--navy)' }}>
                                Correct Answer
                              </span>
                            )}
                            {wasSelected && !isCorrectAnswer && (
                              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#8c2e47' }}>
                                Your Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation box */}
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '12px 14px',
                      fontSize: '0.84rem',
                      color: 'var(--navy)',
                      lineHeight: 1.5,
                    }}>
                      <strong>Explanation: </strong> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Question Taking View: One question displayed at a time */
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {/* Header info */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-sky">{quiz.topic}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--navy)' }}>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--navy)' }}>
                {quiz.title}
              </h1>
            </div>

            {/* Progress indicator bar */}
            <div style={{ marginBottom: '28px' }}>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>Answered: {answeredCount} / {totalQuestions}</span>
                <span>{progressPercent}% Complete</span>
              </div>
            </div>

            {/* Question Card */}
            <div style={{
              backgroundColor: 'var(--panel-main)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--navy)', lineHeight: 1.4, marginBottom: '24px' }}>
                {currentQuestion.questionText}
              </h2>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQuestion.options?.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'var(--navy)' : '#FFFFFF',
                        border: '1.5px solid',
                        borderColor: isSelected ? 'var(--navy)' : 'var(--border-light)',
                        color: isSelected ? '#FFFFFF' : 'var(--navy)',
                        fontWeight: isSelected ? '700' : '600',
                        fontSize: '0.94rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        transition: 'var(--transition)',
                      }}
                    >
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--accent-sky)' : 'var(--card-blue)',
                        color: 'var(--navy)',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submission Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline"
                style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
              >
                <ArrowLeft size={16} />
                Previous Question
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                  >
                    Next Question
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    Submit Quiz Evaluation
                    <Sparkles size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Quiz Submission"
        >
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: '16px' }}>
              You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
              {answeredCount < totalQuestions && (
                <span style={{ display: 'block', marginTop: '8px', color: '#8c2e47', fontWeight: '600' }}>
                  Notice: Unanswered questions will be scored as 0.
                </span>
              )}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Once submitted, your answers will be evaluated on the backend, and your personalized recommendation feed will be recalibrated.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline"
              >
                Continue Answering
              </button>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Grading Answers...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
