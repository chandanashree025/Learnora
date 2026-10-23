import { dataStore } from '../services/dataStore.js';

export const getCourses = async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;
    let courses = await dataStore.getAllCourses();

    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      courses = courses.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      courses = courses.filter((c) => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      storageMode: dataStore.getStorageMode(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses.',
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await dataStore.getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const lessons = await dataStore.getLessonsByCourse(id);
    const quizzes = await dataStore.getQuizzesByCourse(id);

    // If student is logged in, check enrollment status
    let enrollment = null;
    let lessonProgress = [];
    if (req.user) {
      enrollment = await dataStore.findEnrollment(req.user._id, id);
      lessonProgress = await dataStore.getLessonProgressByStudent(req.user._id);
    }

    res.status(200).json({
      success: true,
      data: {
        ...course._doc ? course._doc : course,
        lessons,
        quizzes,
        enrollment,
        lessonProgress: lessonProgress.filter((p) => String(p.course) === String(id)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details.',
      error: error.message,
    });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId is required.',
      });
    }

    const course = await dataStore.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const existing = await dataStore.findEnrollment(studentId, courseId);
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course.',
        data: existing,
      });
    }

    const enrollment = await dataStore.createEnrollment(studentId, courseId);

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${course.title}!`,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course.',
      error: error.message,
    });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await dataStore.getEnrollmentsByStudent(studentId);

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments.',
      error: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, estimatedHours, cardColor } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category.',
      });
    }

    const newCourse = await dataStore.createCourse({
      title,
      description,
      category,
      difficulty: difficulty || 'Beginner',
      estimatedHours: Number(estimatedHours) || 8,
      cardColor: cardColor || 'blue',
      instructor: req.user._id,
      instructorName: req.user.name,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course.',
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await dataStore.updateCourse(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course.',
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteCourse(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course and related content deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course.',
      error: error.message,
    });
  }
};
