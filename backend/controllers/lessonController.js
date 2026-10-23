import { dataStore } from '../services/dataStore.js';

export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await dataStore.getLessonsByCourse(courseId);

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lessons.',
      error: error.message,
    });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await dataStore.getLessonById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson.',
      error: error.message,
    });
  }
};

export const markLessonCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const lesson = await dataStore.getLessonById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.',
      });
    }

    const result = await dataStore.markLessonCompleted(studentId, lesson.course, id);

    res.status(200).json({
      success: true,
      message: `Lesson "${lesson.title}" marked as completed!`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson completion status.',
      error: error.message,
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, topic, estimatedDuration, order, keyPoints, codeSnippet } = req.body;

    if (!courseId || !title || !content || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, title, content, and topic.',
      });
    }

    const newLesson = await dataStore.createLesson({
      course: courseId,
      title,
      content,
      topic,
      estimatedDuration: Number(estimatedDuration) || 15,
      order: Number(order) || 1,
      keyPoints: Array.isArray(keyPoints) ? keyPoints : [keyPoints].filter(Boolean),
      codeSnippet: codeSnippet || '',
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully.',
      data: newLesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson.',
      error: error.message,
    });
  }
};
