/**
 * LEARNORA API Client
 * Centralized HTTP request wrapper with dynamic URL resolution,
 * safe response parsing, and comprehensive error handling.
 */

export const getApiBaseUrl = () => {
  // 1. If an explicit environment variable was configured (e.g. VITE_API_URL on Vercel)
  if (import.meta.env.VITE_API_URL) {
    const raw = String(import.meta.env.VITE_API_URL).trim().replace(/\/$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }

  // 2. If running locally in development, use relative '/api' with Vite proxy
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return '/api';
  }

  // 3. Deployed production default: connect directly to the deployed Render backend
  return 'https://learnora-backend-dq7l.onrender.com/api';
};

export const apiClient = {
  getToken() {
    return localStorage.getItem('learnora_token');
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;
    const headers = this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkError) {
      console.error(`Network Error on [${options.method || 'GET'} ${url}]:`, networkError);
      throw new Error(
        'Unable to reach the Learnora backend server. Please verify your internet connection or check that the backend is awake.'
      );
    }

    // Safely retrieve response body as text first to avoid 'Unexpected end of JSON input'
    let rawText = '';
    try {
      rawText = await response.text();
    } catch (readError) {
      console.error('Failed to read response body:', readError.message);
    }

    let data = null;
    if (rawText && rawText.trim().length > 0) {
      try {
        data = JSON.parse(rawText);
      } catch (jsonParseError) {
        console.warn(`Non-JSON response from [${url}]:`, rawText.substring(0, 150));
      }
    }

    // Handle HTTP error statuses (4xx, 5xx)
    if (!response.ok) {
      let serverMessage = '';
      if (data && typeof data === 'object') {
        serverMessage = data.message || data.error;
      } else if (typeof data === 'string' && data.trim()) {
        serverMessage = data;
      }

      if (serverMessage && typeof serverMessage === 'string') {
        throw new Error(serverMessage);
      }

      if (response.status === 401) {
        throw new Error('Invalid email or password.');
      }

      if (response.status === 404) {
        throw new Error(`API endpoint '${cleanEndpoint}' was not found on the Learnora server.`);
      }

      if (response.status === 502 || response.status === 503 || response.status === 504) {
        throw new Error(
          'Learnora backend service is waking up on Render. Please wait a few moments and try again.'
        );
      }

      throw new Error(`Server request failed with status code ${response.status}.`);
    }

    // For successful responses, verify data was parsed
    if (!data) {
      if (response.status === 204) {
        return { success: true };
      }
      throw new Error('Received an empty response from server.');
    }

    return data;
  },

  // Auth
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe() {
    return this.request('/auth/me');
  },

  // Courses
  getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/courses${query ? `?${query}` : ''}`);
  },

  getCourseById(id) {
    return this.request(`/courses/${id}`);
  },

  enrollCourse(courseId) {
    return this.request('/courses/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },

  getMyEnrollments() {
    return this.request('/courses/my/enrollments');
  },

  createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  updateCourse(id, courseData) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  },

  // Lessons
  getLessonsByCourse(courseId) {
    return this.request(`/lessons/course/${courseId}`);
  },

  getLessonById(id) {
    return this.request(`/lessons/${id}`);
  },

  markLessonCompleted(lessonId) {
    return this.request(`/lessons/${lessonId}/complete`, {
      method: 'POST',
    });
  },

  createLesson(lessonData) {
    return this.request('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  },

  // Quizzes
  getQuizById(id) {
    return this.request(`/quizzes/${id}`);
  },

  submitQuiz(quizId, userAnswers) {
    return this.request(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ userAnswers }),
    });
  },

  getMyAttempts() {
    return this.request('/quizzes/my/attempts');
  },

  createQuiz(quizData) {
    return this.request('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  // Recommendations
  getRecommendations() {
    return this.request('/recommendations');
  },

  // Analytics
  getStudentAnalytics() {
    return this.request('/analytics/student');
  },

  getInstructorAnalytics() {
    return this.request('/analytics/instructor');
  },
};
