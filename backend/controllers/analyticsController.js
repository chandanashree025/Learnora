import { dataStore } from '../services/dataStore.js';

export const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user._id;
    const analytics = await dataStore.getStudentAnalytics(studentId);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student analytics.',
      error: error.message,
    });
  }
};

export const getInstructorAnalytics = async (req, res) => {
  try {
    const analytics = await dataStore.getInstructorAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor analytics.',
      error: error.message,
    });
  }
};
