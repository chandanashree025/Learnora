import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedOptionIndex: Number,
        isCorrect: Boolean,
        topic: String,
      },
    ],
    score: {
      type: Number, // Percentage 0-100
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswersCount: {
      type: Number,
      required: true,
    },
    topicWisePerformance: [
      {
        topic: String,
        correctCount: Number,
        totalCount: Number,
        percentage: Number,
      },
    ],
    passed: {
      type: Boolean,
      default: false,
    },
    attemptDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
