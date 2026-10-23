import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructorName: {
      type: String,
      default: 'Learnora Faculty',
    },
    estimatedHours: {
      type: Number,
      default: 10,
    },
    cardColor: {
      type: String,
      enum: ['blue', 'pink', 'yellow', 'lavender'],
      default: 'blue',
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;
