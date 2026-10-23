import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function CourseCatalogue() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [enrollingId, setEnrollingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const categories = ['All', 'Computer Science', 'Web Development', 'Data Engineering', 'Software Engineering'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated) {
      fetchEnrollments();
    }
  }, [isAuthenticated, selectedCategory, selectedDifficulty]);

  const fetchCourses = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;

      const res = await apiClient.getCourses(params);
      setCourses(res.data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await apiClient.getMyEnrollments();
      setEnrollments(res.data || []);
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrollingId(courseId);
    setStatusMessage('');
    try {
      const res = await apiClient.enrollCourse(courseId);
      setStatusMessage(res.message || 'Enrolled successfully!');
      await fetchEnrollments();
    } catch (err) {
      setStatusMessage(err.message || 'Failed to enroll.');
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some((e) => String(e.course?._id || e.course) === String(courseId));
  };

  const cardColors = ['blue', 'pink', 'yellow', 'lavender'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isAuthenticated ? (
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">
            <CatalogueHeader />
            <CatalogueFilters
              search={search}
              setSearch={setSearch}
              handleSearchSubmit={handleSearchSubmit}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              difficulties={difficulties}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />
            {statusMessage && (
              <div style={{
                backgroundColor: 'var(--card-blue)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 18px',
                marginBottom: '20px',
                fontWeight: '600',
                color: 'var(--navy)',
              }}>
                {statusMessage}
              </div>
            )}
            <CourseGrid
              courses={courses}
              isEnrolled={isEnrolled}
              handleEnroll={handleEnroll}
              enrollingId={enrollingId}
              cardColors={cardColors}
            />
          </main>
        </div>
      ) : (
        <div>
          <Navbar />
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px' }}>
            <CatalogueHeader />
            <CatalogueFilters
              search={search}
              setSearch={setSearch}
              handleSearchSubmit={handleSearchSubmit}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              difficulties={difficulties}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />
            <CourseGrid
              courses={courses}
              isEnrolled={isEnrolled}
              handleEnroll={handleEnroll}
              enrollingId={enrollingId}
              cardColors={cardColors}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CatalogueHeader() {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span className="badge badge-sky">
          <Sparkles size={13} />
          Verified Curriculum
        </span>
      </div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--navy)', letterSpacing: '-0.02em' }}>
        Explore Learnora Course Catalogue
      </h1>
      <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
        Enroll in specialized computer science, web engineering, and data systems courses with integrated diagnostic assessments.
      </p>
    </div>
  );
}

function CatalogueFilters({
  search,
  setSearch,
  handleSearchSubmit,
  categories,
  selectedCategory,
  setSelectedCategory,
  difficulties,
  selectedDifficulty,
  setSelectedDifficulty,
}) {
  return (
    <div style={{
      backgroundColor: 'var(--panel-main)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-xs)',
    }}>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course title, topic, or keyword..."
            style={{ width: '100%', paddingLeft: '40px' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Category and Difficulty Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--navy)' }}>Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--navy)' }}>Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={selectedDifficulty === diff ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseGrid({ courses, isEnrolled, handleEnroll, enrollingId, cardColors }) {
  if (courses.length === 0) {
    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '40px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>No courses match your filter criteria.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
    }}>
      {courses.map((course, idx) => {
        const enrolled = isEnrolled(course._id);
        const color = course.cardColor || cardColors[idx % cardColors.length];
        const cardClass = `card-pastel-${color}`;

        return (
          <div
            key={course._id}
            className={cardClass}
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-sky">
                  {course.category}
                </span>
                <span className="badge badge-navy">
                  {course.difficulty}
                </span>
              </div>

              <h2 style={{ fontSize: '1.28rem', fontWeight: '800', color: 'var(--navy)', marginBottom: '10px', lineHeight: 1.3 }}>
                {course.title}
              </h2>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}>
                {course.description}
              </p>
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(30, 58, 95, 0.1)',
                marginBottom: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} color="var(--navy)" />
                  {course.instructorName || 'Learnora Faculty'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} color="var(--navy)" />
                  {course.estimatedHours || 10} Hours
                </span>
              </div>

              {enrolled ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/learn/${course._id}`}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Continue Learning
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-outline"
                    title="Course Syllabus Details"
                  >
                    Details
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrollingId === course._id}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {enrollingId === course._id ? 'Enrolling...' : 'Enroll in Course'}
                  </button>
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-outline"
                  >
                    Details
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
