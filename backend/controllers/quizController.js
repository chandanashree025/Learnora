import { dataStore } from '../services/dataStore.js';

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await dataStore.getQuizById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    // For quiz taking mode, do not expose correctOptionIndex or explanation before submission
    const sanitizedQuestions = quiz.questions.map((q, idx) => ({
      index: idx,
      questionText: q.questionText,
      options: q.options,
      topic: q.topic,
      difficulty: q.difficulty,
    }));

    res.status(200).json({
      success: true,
      data: {
        _id: quiz._id,
        course: quiz.course,
        title: quiz.title,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        passingScore: quiz.passingScore || 60,
        questionsCount: quiz.questions.length,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz.',
      error: error.message,
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { userAnswers } = req.body; // Array of { questionIndex, selectedOptionIndex }
    const studentId = req.user._id;

    const quiz = await dataStore.getQuizById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    if (!Array.isArray(userAnswers)) {
      return res.status(400).json({
        success: false,
        message: 'userAnswers must be an array of answers.',
      });
    }

    // Strict Backend Score Calculation: Evaluate against stored correct answers
    let correctCount = 0;
    const topicTracker = {};
    const detailedFeedback = [];

    quiz.questions.forEach((question, idx) => {
      const userAnswerObj = userAnswers.find((ans) => Number(ans.questionIndex) === idx);
      const selectedOptionIndex = userAnswerObj ? userAnswerObj.selectedOptionIndex : null;
      const isCorrect = selectedOptionIndex !== null && Number(selectedOptionIndex) === Number(question.correctOptionIndex);

      if (isCorrect) correctCount++;

      // Track by topic
      const topic = question.topic || quiz.topic;
      if (!topicTracker[topic]) {
        topicTracker[topic] = { correct: 0, total: 0 };
      }
      topicTracker[topic].total += 1;
      if (isCorrect) topicTracker[topic].correct += 1;

      detailedFeedback.push({
        questionIndex: idx,
        questionText: question.questionText,
        options: question.options,
        selectedOptionIndex,
        correctOptionIndex: question.correctOptionIndex,
        isCorrect,
        explanation: question.explanation,
        topic: question.topic,
      });
    });

    const totalQuestions = quiz.questions.length;
    const calculatedScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingScore = quiz.passingScore || 60;
    const passed = calculatedScore >= passingScore;

    const topicWisePerformance = Object.entries(topicTracker).map(([topic, counts]) => ({
      topic,
      correctCount: counts.correct,
      totalCount: counts.total,
      percentage: Math.round((counts.correct / counts.total) * 100),
    }));

    // Record the attempt in database
    const attemptRecord = await dataStore.createQuizAttempt({
      student: studentId,
      quiz: quiz._id,
      course: quiz.course,
      score: calculatedScore,
      totalQuestions,
      correctAnswersCount: correctCount,
      passed,
      topicWisePerformance,
      answers: detailedFeedback.map((df) => ({
        questionIndex: df.questionIndex,
        selectedOptionIndex: df.selectedOptionIndex,
        isCorrect: df.isCorrect,
        topic: df.topic,
      })),
    });

    // Provide explainable recommendation feedback hint
    let recommendationHint = '';
    if (calculatedScore < 60) {
      recommendationHint = `Your score (${calculatedScore}%) indicates foundational gaps. The Learnora AI engine has prioritized beginner lessons & revision materials for you.`;
    } else if (calculatedScore < 80) {
      recommendationHint = `Good effort (${calculatedScore}%)! The Learnora AI engine recommends targeted practice quizzes to achieve full mastery.`;
    } else {
      recommendationHint = `Outstanding performance (${calculatedScore}%)! You've unlocked advanced lessons & engineering challenges.`;
    }

    res.status(200).json({
      success: true,
      message: 'Quiz evaluated and attempt recorded successfully.',
      data: {
        attemptId: attemptRecord._id,
        score: calculatedScore,
        passingScore,
        passed,
        correctAnswersCount: correctCount,
        totalQuestions,
        topicWisePerformance,
        detailedFeedback,
        recommendationHint,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate quiz submission.',
      error: error.message,
    });
  }
};

export const getStudentAttempts = async (req, res) => {
  try {
    const studentId = req.user._id;
    const attempts = await dataStore.getQuizAttemptsByStudent(studentId);

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quiz attempts.',
      error: error.message,
    });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { courseId, title, topic, difficulty, questions, passingScore } = req.body;

    if (!courseId || !title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, title, and valid questions array.',
      });
    }

    const newQuiz = await dataStore.createQuiz({
      course: courseId,
      title,
      topic: topic || 'General',
      difficulty: difficulty || 'Beginner',
      passingScore: Number(passingScore) || 60,
      questions,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      data: newQuiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create quiz.',
      error: error.message,
    });
  }
};
