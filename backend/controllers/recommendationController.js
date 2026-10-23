import { dataStore } from '../services/dataStore.js';
import { RecommendationEngine } from '../services/recommendationEngine.js';

export const getRecommendations = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Gather all historical performance context
    const attempts = await dataStore.getQuizAttemptsByStudent(studentId);
    const enrollments = await dataStore.getEnrollmentsByStudent(studentId);
    const lessonProgress = await dataStore.getLessonProgressByStudent(studentId);
    const allCourses = await dataStore.getAllCourses();
    const allLessons = await dataStore.lessons; // or getLessons for each course
    const allQuizzes = await dataStore.quizzes;

    const recommendations = RecommendationEngine.generate({
      studentId,
      attempts,
      enrollments,
      lessonProgress,
      allCourses,
      allLessons,
      allQuizzes,
    });

    const isStarter = attempts.length === 0;

    res.status(200).json({
      success: true,
      isPersonalized: !isStarter,
      source: isStarter
        ? 'Starter recommendations for new students (Complete a quiz to unlock adaptive recommendations)'
        : `Personalized AI recommendations based on ${attempts.length} quiz attempt(s) and current topic performance`,
      count: recommendations.length,
      data: recommendations,
      storageMode: dataStore.getStorageMode(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations.',
      error: error.message,
    });
  }
};
