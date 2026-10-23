/**
 * LEARNORA API Client
 * Centralized HTTP request wrapper with bearer token injection,
 * safe response parsing, and comprehensive error handling.
 */

const API_BASE_URL = '/api';

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
    const url = `${API_BASE_URL}${endpoint}`;
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
      console.error(`Network Error on [${options.method || 'GET'} ${endpoint}]:`, networkError);
      throw new Error(
        'Unable to reach the Learnora backend server. Please verify that the backend is running on port 5000.'
      );
    }

    // Safely retrieve the response body as text first to prevent 'Unexpected end of JSON input'
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
        console.warn(`Non-JSON response from [${endpoint}]:`, rawText.substring(0, 150));
      }
    }

    // Handle HTTP error statuses (4xx, 5xx)
    if (!response.ok) {
      const serverMessage = data && (data.message || data.error);
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      if (response.status === 404) {
        throw new Error(`API endpoint '${endpoint}' was not found on the Learnora server.`);
      }

      if (response.status === 502 || response.status === 503 || response.status === 504) {
        throw new Error(
          'Learnora backend gateway is unreachable. Please ensure the backend server is running on port 5000.'
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
