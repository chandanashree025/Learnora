import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide lesson content'],
    },
    topic: {
      type: String,
      required: [true, 'Please specify a topic'],
      trim: true,
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 15,
    },
    order: {
      type: Number,
      default: 1,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    keyPoints: [
      {
        type: String,
      },
    ],
    codeSnippet: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
export default Lesson;
