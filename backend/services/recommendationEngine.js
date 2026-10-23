/**
 * LEARNORA PERSONALIZED RECOMMENDATION ENGINE
 * 
 * Core rule-based AI engine that analyzes:
 * 1. Topic-wise quiz performance (<60% = beginner/revision, 60-79% = practice quizzes, >=80% = advanced/challenges)
 * 2. Uncompleted enrolled lessons & syllabus momentum
 * 3. Explainable recommendation reasons: "Recommended because your [Topic] quiz score was [Score]%"
 * 4. Starter recommendations fallback when student has no attempts yet
 */

export class RecommendationEngine {
  /**
   * Generates tailored recommendations for a given student
   * @param {Object} student - The user object
   * @param {Array} attempts - List of quiz attempts by the student
   * @param {Array} enrollments - List of courses enrolled by the student
   * @param {Array} lessonProgress - List of completed lessons
   * @param {Array} allCourses - All available courses
   * @param {Array} allLessons - All available lessons
   * @param {Array} allQuizzes - All available quizzes
   * @returns {Array} List of explainable recommendation objects
   */
  static generate({
    studentId,
    attempts = [],
    enrollments = [],
    lessonProgress = [],
    allCourses = [],
    allLessons = [],
    allQuizzes = [],
  }) {
    const recommendations = [];
    const completedLessonIds = new Set(
      lessonProgress.filter((p) => p.completed).map((p) => String(p.lesson))
    );

    // 1. Group quiz attempts by topic to find student's strengths and weaknesses
    const topicStats = {}; // topic -> { totalScore: number, attemptsCount: number, latestScore: number }

    // Sort attempts chronologically
    const sortedAttempts = [...attempts].sort(
      (a, b) => new Date(a.attemptDate || a.createdAt) - new Date(b.attemptDate || b.createdAt)
    );

    sortedAttempts.forEach((attempt) => {
      // Analyze attempt overall & topic-wise performance
      if (attempt.topicWisePerformance && attempt.topicWisePerformance.length > 0) {
        attempt.topicWisePerformance.forEach((tp) => {
          if (!topicStats[tp.topic]) {
            topicStats[tp.topic] = { scores: [], latestScore: tp.percentage };
          }
          topicStats[tp.topic].scores.push(tp.percentage);
          topicStats[tp.topic].latestScore = tp.percentage;
        });
      } else {
        // Fallback to quiz topic
        const quizObj = allQuizzes.find((q) => String(q._id) === String(attempt.quiz));
        const topic = (quizObj && quizObj.topic) || 'General';
        if (!topicStats[topic]) {
          topicStats[topic] = { scores: [], latestScore: attempt.score };
        }
        topicStats[topic].scores.push(attempt.score);
        topicStats[topic].latestScore = attempt.score;
      }
    });

    // 2. Apply Rule-Based Scoring Archetypes
    // Archetype A: Score < 60% -> Recommend Beginner Lessons & Revision Materials
    // Archetype B: Score 60% - 79% -> Recommend Additional Practice Quizzes
    // Archetype C: Score >= 80% -> Recommend Advanced Lessons / Deep-dive Challenges

    for (const [topic, stat] of Object.entries(topicStats)) {
      const avgScore = Math.round(
        stat.scores.reduce((sum, val) => sum + val, 0) / stat.scores.length
      );
      const latestScore = stat.latestScore;

      if (latestScore < 60) {
        // Rule: score < 60% -> Beginner lessons and revision materials
        const revisionLessons = allLessons.filter(
          (l) => l.topic.toLowerCase() === topic.toLowerCase() && !completedLessonIds.has(String(l._id))
        );

        if (revisionLessons.length > 0) {
          const lesson = revisionLessons[0];
          const course = allCourses.find((c) => String(c._id) === String(lesson.course));
          recommendations.push({
            id: `rec-rev-${lesson._id}`,
            type: 'lesson',
            targetId: lesson._id,
            courseId: lesson.course,
            courseTitle: course ? course.title : 'Course Revision',
            title: lesson.title,
            topic: topic,
            difficulty: 'Beginner',
            estimatedDuration: `${lesson.estimatedDuration || 15} mins`,
            badgeType: 'pink',
            badgeText: 'Priority Revision',
            reason: `Recommended because your ${topic} quiz score was ${latestScore}%. Reinforce the fundamentals before retrying.`,
            actionLabel: 'Review Lesson',
            actionUrl: `/learn/${lesson.course}?lesson=${lesson._id}`,
            priority: 1, // Highest urgency
          });
        } else {
          // If all lessons in this topic were marked done, suggest a targeted review
          const anyLesson = allLessons.find((l) => l.topic.toLowerCase() === topic.toLowerCase());
          if (anyLesson) {
            const course = allCourses.find((c) => String(c._id) === String(anyLesson.course));
            recommendations.push({
              id: `rec-rev-all-${anyLesson._id}`,
              type: 'lesson',
              targetId: anyLesson._id,
              courseId: anyLesson.course,
              courseTitle: course ? course.title : 'Course Revision',
              title: `Revisit: ${anyLesson.title}`,
              topic: topic,
              difficulty: 'Beginner',
              estimatedDuration: '15 mins',
              badgeType: 'pink',
              badgeText: 'Revision Recommended',
              reason: `Recommended because your ${topic} quiz score was ${latestScore}%. A quick recap will boost mastery.`,
              actionLabel: 'Revisit Lesson',
              actionUrl: `/learn/${anyLesson.course}?lesson=${anyLesson._id}`,
              priority: 1,
            });
          }
        }
      } else if (latestScore >= 60 && latestScore < 80) {
        // Rule: score 60-79% -> Additional practice quizzes
        const practiceQuizzes = allQuizzes.filter(
          (q) => q.topic.toLowerCase() === topic.toLowerCase()
        );

        if (practiceQuizzes.length > 0) {
          const quiz = practiceQuizzes[0];
          const course = allCourses.find((c) => String(c._id) === String(quiz.course));
          recommendations.push({
            id: `rec-quiz-${quiz._id}`,
            type: 'quiz',
            targetId: quiz._id,
            courseId: quiz.course,
            courseTitle: course ? course.title : 'Course Assessment',
            title: `${quiz.title} (Practice)`,
            topic: topic,
            difficulty: 'Intermediate',
            estimatedDuration: '10 mins',
            badgeType: 'yellow',
            badgeText: 'Skill Practice',
            reason: `Recommended because your ${topic} quiz score was ${latestScore}%. Practice quizzes strengthen core concepts.`,
            actionLabel: 'Start Practice Quiz',
            actionUrl: `/quiz/${quiz._id}`,
            priority: 2,
          });
        }
      } else {
        // Rule: score >= 80% -> Recommend advanced lessons or challenges
        const advancedLessons = allLessons.filter(
          (l) => !completedLessonIds.has(String(l._id))
        );

        const advancedCandidate = advancedLessons.find(
          (l) => l.order >= 2 || l.estimatedDuration >= 20
        ) || advancedLessons[0];

        if (advancedCandidate) {
          const course = allCourses.find((c) => String(c._id) === String(advancedCandidate.course));
          recommendations.push({
            id: `rec-adv-${advancedCandidate._id}`,
            type: 'lesson',
            targetId: advancedCandidate._id,
            courseId: advancedCandidate.course,
            courseTitle: course ? course.title : 'Advanced Track',
            title: advancedCandidate.title,
            topic: advancedCandidate.topic,
            difficulty: 'Advanced',
            estimatedDuration: `${advancedCandidate.estimatedDuration || 25} mins`,
            badgeType: 'lavender',
            badgeText: 'Advanced Challenge',
            reason: `Recommended because your ${topic} quiz score was ${latestScore}%. You have mastered the basics and are ready for advanced topics!`,
            actionLabel: 'Take Challenge',
            actionUrl: `/learn/${advancedCandidate.course}?lesson=${advancedCandidate._id}`,
            priority: 3,
          });
        }
      }
    }

    // 3. Momentum Rule: Check enrolled courses for next incomplete lessons
    const enrolledCourseIds = new Set(enrollments.map((e) => String(e.course)));
    allCourses
      .filter((c) => enrolledCourseIds.has(String(c._id)))
      .forEach((course) => {
        const courseLessons = allLessons
          .filter((l) => String(l.course) === String(course._id))
          .sort((a, b) => a.order - b.order);

        const nextIncomplete = courseLessons.find((l) => !completedLessonIds.has(String(l._id)));
        if (nextIncomplete && !recommendations.some((r) => r.targetId === nextIncomplete._id)) {
          recommendations.push({
            id: `rec-next-${nextIncomplete._id}`,
            type: 'lesson',
            targetId: nextIncomplete._id,
            courseId: course._id,
            courseTitle: course.title,
            title: nextIncomplete.title,
            topic: nextIncomplete.topic,
            difficulty: course.difficulty || 'Beginner',
            estimatedDuration: `${nextIncomplete.estimatedDuration || 15} mins`,
            badgeType: 'blue',
            badgeText: 'Next in Syllabus',
            reason: `Recommended because this is the next step in your enrolled "${course.title}" track.`,
            actionLabel: 'Continue Learning',
            actionUrl: `/learn/${course._id}?lesson=${nextIncomplete._id}`,
            priority: 4,
          });
        }
      });

    // 4. Starter Recommendations fallback (If student has no history or few recommendations)
    if (recommendations.length < 3) {
      allCourses.forEach((c) => {
        if (!enrolledCourseIds.has(String(c._id)) && recommendations.length < 5) {
          recommendations.push({
            id: `rec-start-${c._id}`,
            type: 'course',
            targetId: c._id,
            courseId: c._id,
            courseTitle: c.title,
            title: `Explore: ${c.title}`,
            topic: c.category,
            difficulty: c.difficulty,
            estimatedDuration: `${c.estimatedHours} hours`,
            badgeType: 'sky',
            badgeText: 'Starter Recommendation',
            reason: 'Recommended for you to build foundational skills across computer science and modern software engineering.',
            actionLabel: 'Enroll Now',
            actionUrl: `/courses/${c._id}`,
            priority: 5,
          });
        }
      });
    }

    // Sort by priority (1: highest urgency revision, then practice, advanced, syllabus, starter)
    return recommendations.sort((a, b) => a.priority - b.priority);
  }
}
