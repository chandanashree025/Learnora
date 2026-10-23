import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Enrollment from '../models/Enrollment.js';
import LessonProgress from '../models/LessonProgress.js';
import { initialUsers, initialCourses, initialLessons, initialQuizzes } from '../seed/seedData.js';

class DataStore {
  constructor() {
    this.isMongoConnected = false;
    
    // In-Memory / Local Development Collections
    this.users = [];
    this.courses = [];
    this.lessons = [];
    this.quizzes = [];
    this.enrollments = [];
    this.lessonProgress = [];
    this.quizAttempts = [];
    
    this.initLocalStore();
  }

  async initLocalStore() {
    // Hash passwords for seed users
    const salt = await bcrypt.genSalt(10);
    this.users = await Promise.all(
      initialUsers.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, salt),
        createdAt: new Date().toISOString(),
      }))
    );

    this.courses = JSON.parse(JSON.stringify(initialCourses));
    this.lessons = JSON.parse(JSON.stringify(initialLessons));
    this.quizzes = JSON.parse(JSON.stringify(initialQuizzes));

    // Seed an initial demo enrollment and initial quiz attempt so the student dashboard has realistic data
    this.enrollments = [
      {
        _id: 'enr_01',
        student: 'user_student_demo',
        course: 'course_python_101',
        progress: 66,
        completed: false,
        enrolledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'enr_02',
        student: 'user_student_demo',
        course: 'course_db_103',
        progress: 25,
        completed: false,
        enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    this.lessonProgress = [
      {
        _id: 'lp_01',
        student: 'user_student_demo',
        course: 'course_python_101',
        lesson: 'lesson_py_01',
        completed: true,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'lp_02',
        student: 'user_student_demo',
        course: 'course_python_101',
        lesson: 'lesson_py_02',
        completed: true,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Seed one initial quiz attempt (Python: 75% -> triggers practice recommendation; DB not taken or low score)
    this.quizAttempts = [
      {
        _id: 'att_01',
        student: 'user_student_demo',
        quiz: 'quiz_py_01',
        course: 'course_python_101',
        score: 75,
        totalQuestions: 4,
        correctAnswersCount: 3,
        passed: true,
        topicWisePerformance: [
          { topic: 'Python Basics', correctCount: 2, totalCount: 2, percentage: 100 },
          { topic: 'Control Flow', correctCount: 1, totalCount: 1, percentage: 100 },
          { topic: 'Functions & Algorithms', correctCount: 0, totalCount: 1, percentage: 0 },
        ],
        attemptDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'att_02',
        student: 'user_student_demo',
        quiz: 'quiz_db_01',
        course: 'course_db_103',
        score: 50,
        totalQuestions: 4,
        correctAnswersCount: 2,
        passed: false,
        topicWisePerformance: [
          { topic: 'Database Fundamentals', correctCount: 1, totalCount: 2, percentage: 50 },
          { topic: 'Query Optimization', correctCount: 1, totalCount: 2, percentage: 50 },
        ],
        attemptDate: new Date().toISOString(),
      },
    ];
  }

  setMongoConnected(connected) {
    this.isMongoConnected = connected;
  }

  getStorageMode() {
    return this.isMongoConnected ? 'MongoDB (Live Database)' : 'Local Development Mode (In-Memory / State Engine)';
  }

  // --- USER METHODS ---
  async findUserByEmail(email) {
    if (this.isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    if (this.isMongoConnected) {
      return await User.findById(id);
    }
    return this.users.find((u) => String(u._id) === String(id));
  }

  async createUser(userData) {
    if (this.isMongoConnected) {
      return await User.create(userData);
    }
    const newUser = {
      _id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- COURSE METHODS ---
  async getAllCourses() {
    if (this.isMongoConnected) {
      return await Course.find().populate('instructor', 'name email avatar');
    }
    return this.courses;
  }

  async getCourseById(id) {
    if (this.isMongoConnected) {
      return await Course.findById(id);
    }
    return this.courses.find((c) => String(c._id) === String(id));
  }

  async createCourse(courseData) {
    if (this.isMongoConnected) {
      return await Course.create(courseData);
    }
    const newCourse = {
      _id: `course_${Date.now()}`,
      ...courseData,
      lessons: [],
      quizzes: [],
      createdAt: new Date().toISOString(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id, updateData) {
    if (this.isMongoConnected) {
      return await Course.findByIdAndUpdate(id, updateData, { new: true });
    }
    const index = this.courses.findIndex((c) => String(c._id) === String(id));
    if (index === -1) return null;
    this.courses[index] = { ...this.courses[index], ...updateData };
    return this.courses[index];
  }

  async deleteCourse(id) {
    if (this.isMongoConnected) {
      return await Course.findByIdAndDelete(id);
    }
    const index = this.courses.findIndex((c) => String(c._id) === String(id));
    if (index === -1) return null;
    const removed = this.courses.splice(index, 1);
    // Also remove associated lessons and quizzes
    this.lessons = this.lessons.filter((l) => String(l.course) !== String(id));
    this.quizzes = this.quizzes.filter((q) => String(q.course) !== String(id));
    return removed[0];
  }

  // --- LESSON METHODS ---
  async getLessonsByCourse(courseId) {
    if (this.isMongoConnected) {
      return await Lesson.find({ course: courseId }).sort({ order: 1 });
    }
    return this.lessons
      .filter((l) => String(l.course) === String(courseId))
      .sort((a, b) => a.order - b.order);
  }

  async getLessonById(id) {
    if (this.isMongoConnected) {
      return await Lesson.findById(id);
    }
    return this.lessons.find((l) => String(l._id) === String(id));
  }

  async createLesson(lessonData) {
    if (this.isMongoConnected) {
      return await Lesson.create(lessonData);
    }
    const newLesson = {
      _id: `lesson_${Date.now()}`,
      ...lessonData,
      createdAt: new Date().toISOString(),
    };
    this.lessons.push(newLesson);
    return newLesson;
  }

  // --- QUIZ METHODS ---
  async getQuizzesByCourse(courseId) {
    if (this.isMongoConnected) {
      return await Quiz.find({ course: courseId });
    }
    return this.quizzes.filter((q) => String(q.course) === String(courseId));
  }

  async getQuizById(id) {
    if (this.isMongoConnected) {
      return await Quiz.findById(id);
    }
    return this.quizzes.find((q) => String(q._id) === String(id));
  }

  async createQuiz(quizData) {
    if (this.isMongoConnected) {
      return await Quiz.create(quizData);
    }
    const newQuiz = {
      _id: `quiz_${Date.now()}`,
      ...quizData,
      createdAt: new Date().toISOString(),
    };
    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  // --- ENROLLMENT METHODS ---
  async getEnrollmentsByStudent(studentId) {
    if (this.isMongoConnected) {
      return await Enrollment.find({ student: studentId }).populate('course');
    }
    return this.enrollments
      .filter((e) => String(e.student) === String(studentId))
      .map((e) => {
        const course = this.courses.find((c) => String(c._id) === String(e.course));
        return { ...e, course };
      });
  }

  async findEnrollment(studentId, courseId) {
    if (this.isMongoConnected) {
      return await Enrollment.findOne({ student: studentId, course: courseId });
    }
    return this.enrollments.find(
      (e) => String(e.student) === String(studentId) && String(e.course) === String(courseId)
    );
  }

  async createEnrollment(studentId, courseId) {
    if (this.isMongoConnected) {
      return await Enrollment.create({ student: studentId, course: courseId, progress: 0 });
    }
    const newEnrollment = {
      _id: `enr_${Date.now()}`,
      student: studentId,
      course: courseId,
      progress: 0,
      completed: false,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  // --- LESSON PROGRESS METHODS ---
  async getLessonProgressByStudent(studentId) {
    if (this.isMongoConnected) {
      return await LessonProgress.find({ student: studentId });
    }
    return this.lessonProgress.filter((lp) => String(lp.student) === String(studentId));
  }

  async markLessonCompleted(studentId, courseId, lessonId) {
    if (this.isMongoConnected) {
      let progress = await LessonProgress.findOne({ student: studentId, lesson: lessonId });
      if (!progress) {
        progress = await LessonProgress.create({
          student: studentId,
          course: courseId,
          lesson: lessonId,
          completed: true,
          completedAt: new Date(),
        });
      } else {
        progress.completed = true;
        progress.completedAt = new Date();
        await progress.save();
      }

      // Update course enrollment progress percentage
      const totalLessons = await Lesson.countDocuments({ course: courseId });
      const completedCount = await LessonProgress.countDocuments({
        student: studentId,
        course: courseId,
        completed: true,
      });

      const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 100;
      await Enrollment.findOneAndUpdate(
        { student: studentId, course: courseId },
        { progress: percentage, completed: percentage >= 100, lastAccessedAt: new Date() },
        { upsert: true }
      );

      return { progress, percentage };
    }

    // Local Store
    let lp = this.lessonProgress.find(
      (p) => String(p.student) === String(studentId) && String(p.lesson) === String(lessonId)
    );
    if (!lp) {
      lp = {
        _id: `lp_${Date.now()}`,
        student: studentId,
        course: courseId,
        lesson: lessonId,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      this.lessonProgress.push(lp);
    } else {
      lp.completed = true;
      lp.completedAt = new Date().toISOString();
    }

    // Recalculate enrollment progress
    const courseLessons = this.lessons.filter((l) => String(l.course) === String(courseId));
    const completedLessons = this.lessonProgress.filter(
      (p) => String(p.student) === String(studentId) && String(p.course) === String(courseId) && p.completed
    );

    const percentage = courseLessons.length > 0 ? Math.round((completedLessons.length / courseLessons.length) * 100) : 100;

    let enr = this.enrollments.find(
      (e) => String(e.student) === String(studentId) && String(e.course) === String(courseId)
    );
    if (enr) {
      enr.progress = percentage;
      enr.completed = percentage >= 100;
      enr.lastAccessedAt = new Date().toISOString();
    } else {
      enr = {
        _id: `enr_${Date.now()}`,
        student: studentId,
        course: courseId,
        progress: percentage,
        completed: percentage >= 100,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      };
      this.enrollments.push(enr);
    }

    return { progress: lp, percentage };
  }

  // --- QUIZ ATTEMPTS & GRADING ---
  async createQuizAttempt(attemptData) {
    if (this.isMongoConnected) {
      return await QuizAttempt.create(attemptData);
    }
    const newAttempt = {
      _id: `att_${Date.now()}`,
      ...attemptData,
      attemptDate: new Date().toISOString(),
    };
    this.quizAttempts.push(newAttempt);
    return newAttempt;
  }

  async getQuizAttemptsByStudent(studentId) {
    if (this.isMongoConnected) {
      return await QuizAttempt.find({ student: studentId })
        .populate('quiz', 'title topic difficulty')
        .populate('course', 'title')
        .sort({ attemptDate: -1 });
    }
    return this.quizAttempts
      .filter((a) => String(a.student) === String(studentId))
      .map((a) => {
        const quiz = this.quizzes.find((q) => String(q._id) === String(a.quiz));
        const course = this.courses.find((c) => String(c._id) === String(a.course));
        return { ...a, quiz, course };
      })
      .sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
  }

  async getAllQuizAttempts() {
    if (this.isMongoConnected) {
      return await QuizAttempt.find()
        .populate('student', 'name email avatar')
        .populate('quiz', 'title topic difficulty')
        .populate('course', 'title');
    }
    return this.quizAttempts.map((a) => {
      const student = this.users.find((u) => String(u._id) === String(a.student));
      const quiz = this.quizzes.find((q) => String(q._id) === String(a.quiz));
      const course = this.courses.find((c) => String(c._id) === String(a.course));
      return { ...a, student, quiz, course };
    });
  }

  // --- ANALYTICS ---
  async getStudentAnalytics(studentId) {
    const enrollments = await this.getEnrollmentsByStudent(studentId);
    const attempts = await this.getQuizAttemptsByStudent(studentId);
    const progressList = await this.getLessonProgressByStudent(studentId);

    const totalCoursesEnrolled = enrollments.length;
    const completedCoursesCount = enrollments.filter((e) => e.completed || e.progress >= 100).length;
    const avgProgress =
      enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0;

    const avgScore =
      attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
        : 0;

    // Topic strengths & improvement areas
    const topicPerformanceMap = {};
    attempts.forEach((a) => {
      if (a.topicWisePerformance && a.topicWisePerformance.length > 0) {
        a.topicWisePerformance.forEach((tp) => {
          if (!topicPerformanceMap[tp.topic]) {
            topicPerformanceMap[tp.topic] = { totalPercentage: 0, count: 0 };
          }
          topicPerformanceMap[tp.topic].totalPercentage += tp.percentage;
          topicPerformanceMap[tp.topic].count += 1;
        });
      } else if (a.quiz) {
        const topic = a.quiz.topic || 'General';
        if (!topicPerformanceMap[topic]) {
          topicPerformanceMap[topic] = { totalPercentage: 0, count: 0 };
        }
        topicPerformanceMap[topic].totalPercentage += a.score;
        topicPerformanceMap[topic].count += 1;
      }
    });

    const topicScores = Object.entries(topicPerformanceMap).map(([topic, data]) => ({
      topic,
      averageScore: Math.round(data.totalPercentage / data.count),
    }));

    const strengths = topicScores.filter((t) => t.averageScore >= 75);
    const needsImprovement = topicScores.filter((t) => t.averageScore < 60);

    // Weekly activity trend (Strictly styled using pastel colors)
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = daysOfWeek.map((day, idx) => ({
      day,
      hours: [1.5, 2.0, 0.8, 2.5, 1.8, 3.2, 1.2][idx],
      quizzes: [0, 1, 0, 1, 0, 1, 0][idx],
    }));

    return {
      storageMode: this.getStorageMode(),
      totalCoursesEnrolled,
      completedCoursesCount,
      avgProgress,
      avgScore,
      totalQuizzesTaken: attempts.length,
      completedLessonsCount: progressList.filter((p) => p.completed).length,
      topicScores,
      strengths,
      needsImprovement,
      weeklyActivity,
      recentAttempts: attempts.slice(0, 5),
    };
  }

  async getInstructorAnalytics() {
    const courses = await this.getAllCourses();
    const students = this.isMongoConnected
      ? await User.find({ role: 'student' })
      : this.users.filter((u) => u.role === 'student');
    const enrollments = this.isMongoConnected ? await Enrollment.find() : this.enrollments;
    const attempts = await this.getAllQuizAttempts();

    const totalCourses = courses.length;
    const totalStudents = students.length;
    const totalEnrollments = enrollments.length;

    const avgQuizScore =
      attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
        : 0;

    const courseStats = courses.map((course) => {
      const courseEnrollments = enrollments.filter(
        (e) => String(e.course?._id || e.course) === String(course._id)
      );
      const courseAttempts = attempts.filter(
        (a) => String(a.course?._id || a.course) === String(course._id)
      );
      const courseAvgScore =
        courseAttempts.length > 0
          ? Math.round(courseAttempts.reduce((sum, a) => sum + a.score, 0) / courseAttempts.length)
          : 0;
      const completedCount = courseEnrollments.filter((e) => e.completed || e.progress >= 100).length;

      return {
        courseId: course._id,
        title: course.title,
        category: course.category,
        difficulty: course.difficulty,
        enrolledCount: courseEnrollments.length,
        completedCount,
        avgScore: courseAvgScore,
        completionRate:
          courseEnrollments.length > 0
            ? Math.round((completedCount / courseEnrollments.length) * 100)
            : 0,
      };
    });

    return {
      storageMode: this.getStorageMode(),
      totalCourses,
      totalStudents,
      totalEnrollments,
      avgQuizScore,
      courseStats,
      recentAttempts: attempts.slice(0, 10),
    };
  }
}

export const dataStore = new DataStore();
