import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Enrollment from '../models/Enrollment.js';
import LessonProgress from '../models/LessonProgress.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { initialUsers, initialCourses, initialLessons, initialQuizzes } from './seedData.js';

dotenv.config();

const seedMongoDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnora';
  console.log(`[Learnora Seed] Connecting to MongoDB: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('[Learnora Seed] Connected! Clearing existing collections...');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Enrollment.deleteMany({});
    await LessonProgress.deleteMany({});
    await QuizAttempt.deleteMany({});

    console.log('[Learnora Seed] Inserting users...');
    const salt = await bcrypt.genSalt(10);
    const createdUsers = [];
    for (const u of initialUsers) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        avatar: u.avatar,
      });
      createdUsers.push(user);
    }

    const studentUser = createdUsers.find((u) => u.role === 'student');
    const instructorUser = createdUsers.find((u) => u.role === 'instructor');

    console.log('[Learnora Seed] Inserting courses, lessons, and quizzes...');
    for (const c of initialCourses) {
      const course = await Course.create({
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        instructor: instructorUser._id,
        instructorName: c.instructorName,
        estimatedHours: c.estimatedHours,
        cardColor: c.cardColor,
      });

      // Insert lessons for this course
      const courseLessons = initialLessons.filter((l) => l.course === c._id);
      const createdLessonIds = [];
      for (const l of courseLessons) {
        const lesson = await Lesson.create({
          course: course._id,
          title: l.title,
          topic: l.topic,
          content: l.content,
          estimatedDuration: l.estimatedDuration,
          order: l.order,
          keyPoints: l.keyPoints,
          codeSnippet: l.codeSnippet,
        });
        createdLessonIds.push(lesson._id);
      }

      // Insert quizzes for this course
      const courseQuizzes = initialQuizzes.filter((q) => q.course === c._id);
      const createdQuizIds = [];
      for (const q of courseQuizzes) {
        const quiz = await Quiz.create({
          course: course._id,
          title: q.title,
          topic: q.topic,
          difficulty: q.difficulty,
          passingScore: q.passingScore,
          questions: q.questions,
        });
        createdQuizIds.push(quiz._id);
      }

      await Course.findByIdAndUpdate(course._id, {
        lessons: createdLessonIds,
        quizzes: createdQuizIds,
      });
    }

    console.log('[Learnora Seed] Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Learnora Seed Error]:', err.message);
    process.exit(1);
  }
};

seedMongoDB();
