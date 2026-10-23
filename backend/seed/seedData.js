export const initialUsers = [
  {
    _id: 'user_student_demo',
    name: 'Aarav Patel',
    email: 'student@learnora.edu',
    password: 'Student@123', // Will be hashed or matched
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'user_instructor_demo',
    name: 'Dr. Evelyn Reed',
    email: 'instructor@learnora.edu',
    password: 'Instructor@123',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const initialCourses = [
  {
    _id: 'course_python_101',
    title: 'Python Programming Fundamentals',
    description: 'Master core Python syntax, data structures, control flow, functions, and algorithmic problem-solving with hands-on exercises.',
    category: 'Computer Science',
    difficulty: 'Beginner',
    instructorName: 'Dr. Evelyn Reed',
    instructor: 'user_instructor_demo',
    estimatedHours: 8,
    cardColor: 'blue',
  },
  {
    _id: 'course_js_102',
    title: 'Modern JavaScript & ES6+ Essentials',
    description: 'Deep dive into modern ECMAScript, closures, asynchronous promises, async/await, array pipelines, and DOM interaction.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructorName: 'Dr. Evelyn Reed',
    instructor: 'user_instructor_demo',
    estimatedHours: 12,
    cardColor: 'pink',
  },
  {
    _id: 'course_db_103',
    title: 'Database Systems & SQL Mastery',
    description: 'Understand relational database design, indexing strategies, normalization forms, query optimization, and transaction ACID properties.',
    category: 'Data Engineering',
    difficulty: 'Beginner',
    instructorName: 'Prof. Marcus Vance',
    instructor: 'user_instructor_demo',
    estimatedHours: 10,
    cardColor: 'yellow',
  },
  {
    _id: 'course_web_104',
    title: 'Full-Stack Web Architecture',
    description: 'Explore client-server communication, RESTful API contract design, authentication tokens, caching, and scalable web architecture.',
    category: 'Software Engineering',
    difficulty: 'Intermediate',
    instructorName: 'Dr. Evelyn Reed',
    instructor: 'user_instructor_demo',
    estimatedHours: 14,
    cardColor: 'lavender',
  },
];

export const initialLessons = [
  // Course 1: Python
  {
    _id: 'lesson_py_01',
    course: 'course_python_101',
    title: 'Variables, Types, and Memory in Python',
    topic: 'Python Basics',
    order: 1,
    estimatedDuration: 15,
    keyPoints: [
      'Python uses dynamic typing and everything is an object in memory.',
      'Immutable types include integers, floats, strings, and tuples.',
      'Variable assignment binds a reference name to an object memory address.'
    ],
    codeSnippet: `# Variables and Dynamic Typing
student_score = 94.5
course_name = "Learnora Python"
is_active = True

print(f"{course_name}: {student_score} | Active: {is_active}")
print(f"Object type: {type(student_score)}")`,
    content: `Python is a high-level, dynamically typed language. When you assign a value to a variable, Python allocates memory for the value and binds the variable name to that memory reference.

Unlike statically typed languages like C++ or Java, you don't need to declare explicit data types beforehand. Python infers the type during execution.

Key Primitive Data Types:
- int: Arbitrary precision signed integers (e.g. 42, -7).
- float: IEEE 754 double-precision floating point numbers.
- str: Unicode text strings enclosed in single, double, or triple quotes.
- bool: Boolean truth values (True or False).`,
  },
  {
    _id: 'lesson_py_02',
    course: 'course_python_101',
    title: 'Control Flow, Loops, and Comprehensions',
    topic: 'Control Flow',
    order: 2,
    estimatedDuration: 20,
    keyPoints: [
      'Indentation defines scope and code block hierarchy in Python.',
      'List comprehensions offer concise, idiomatic data transformations.',
      'Avoid modifying lists while iterating over them.'
    ],
    codeSnippet: `# List Comprehension & Conditional Filtering
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [n**2 for n in numbers if n % 2 == 0]

print("Squares of even numbers:", even_squares)
# Output: [4, 16, 36, 64, 100]`,
    content: `Control flow statements regulate the execution path of your program based on conditional logic.

1. Conditional Branching (if, elif, else):
Python uses colon-delimited blocks governed strictly by consistent 4-space indentation.

2. Iteration (for and while):
The 'for' loop in Python is actually a 'for-each' iterator that consumes iterable protocols (lists, tuples, dicts, generators).

3. Comprehensions:
List, dictionary, and set comprehensions provide a readable declarative syntax for mapping and filtering items.`,
  },
  {
    _id: 'lesson_py_03',
    course: 'course_python_101',
    title: 'Python Functions, Scope, and Recursion',
    topic: 'Functions & Algorithms',
    order: 3,
    estimatedDuration: 25,
    keyPoints: [
      'Functions are first-class citizens and can be passed as arguments.',
      'LEGB rule dictates variable lookup: Local, Enclosing, Global, Built-in.',
      'Default arguments are evaluated once at function definition time.'
    ],
    codeSnippet: `# First-class function and recursive factorial
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("Factorial of 5:", factorial(5))`,
    content: `Functions encapsulate reusable logic, improve modularity, and reduce code duplication.

Default Argument Trap:
Always use None as default for mutable arguments (like lists or dictionaries) to prevent cross-call state mutation.`,
  },

  // Course 2: JavaScript
  {
    _id: 'lesson_js_01',
    course: 'course_js_102',
    title: 'Execution Context, Hoisting, and Scope',
    topic: 'JavaScript Engine',
    order: 1,
    estimatedDuration: 20,
    keyPoints: [
      'JavaScript engines execute code in two phases: Creation and Execution.',
      'let and const are hoisted to the Temporal Dead Zone (TDZ).',
      'Closures capture the lexical scope variables even after outer execution ends.'
    ],
    codeSnippet: `// Lexical Scoping and Closures
function createCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment: () => ++count,
    get: () => count
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11`,
    content: `Understanding how the V8 engine interprets JavaScript is critical for writing high-performance web code.

Execution Context:
Whenever code runs, it exists within an Execution Context containing Variable Environment, Scope Chain, and the 'this' binding.`,
  },
  {
    _id: 'lesson_js_02',
    course: 'course_js_102',
    title: 'Asynchronous JavaScript: Promises & Async/Await',
    topic: 'Asynchronous Programming',
    order: 2,
    estimatedDuration: 25,
    keyPoints: [
      'The Event Loop processes the Call Stack, Microtask queue, and Macrotask queue.',
      'Promises resolve microtasks before setTimeout macrotasks.',
      'async/await provides syntactic sugar over promise resolution with try/catch error handling.'
    ],
    codeSnippet: `// Asynchronous fetch with async/await
async function fetchCourseData(courseId) {
  try {
    const response = await fetch(\`/api/courses/\${courseId}\`);
    if (!response.ok) throw new Error("Course fetch failed");
    return await response.json();
  } catch (err) {
    console.error("Network error:", err.message);
  }
}`,
    content: `JavaScript is single-threaded with a non-blocking I/O event loop model. Asynchronous tasks avoid freezing the UI thread by delegating operations to web APIs and handling callbacks through queues.`,
  },

  // Course 3: Database
  {
    _id: 'lesson_db_01',
    course: 'course_db_103',
    title: 'Relational Schema Design & Normalization',
    topic: 'Database Fundamentals',
    order: 1,
    estimatedDuration: 25,
    keyPoints: [
      'First Normal Form (1NF) ensures atomic column values.',
      'Second Normal Form (2NF) eliminates partial functional dependencies.',
      'Third Normal Form (3NF) eliminates transitive dependencies on primary keys.'
    ],
    codeSnippet: `-- 3NF Normalized Schema for Courses & Enrollments
CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE enrollments (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id),
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    content: `Database normalization organizes data attributes within tables to minimize redundancy and prevent insertion, update, and deletion anomalies.`,
  },
  {
    _id: 'lesson_db_02',
    course: 'course_db_103',
    title: 'B-Tree Indexing and Query Performance',
    topic: 'Query Optimization',
    order: 2,
    estimatedDuration: 20,
    keyPoints: [
      'B-Trees allow logarithmic O(log N) lookup, insertion, and deletion.',
      'Composite indexes should follow the leftmost prefix rule.',
      'Over-indexing increases write overhead on INSERT and UPDATE operations.'
    ],
    codeSnippet: `-- Creating composite index for fast student lookup
CREATE INDEX idx_student_email_active 
ON students (email, is_active);

-- Analyze execution plan
EXPLAIN ANALYZE SELECT * FROM students WHERE email = 'student@learnora.edu';`,
    content: `Indexes are auxiliary data structures that optimize data retrieval at the cost of disk space and write speed. Understanding EXPLAIN plans is essential for senior developers.`,
  },

  // Course 4: Web Architecture
  {
    _id: 'lesson_web_01',
    course: 'course_web_104',
    title: 'RESTful API Contracts, Status Codes, & Idempotency',
    topic: 'API Design',
    order: 1,
    estimatedDuration: 20,
    keyPoints: [
      'GET, PUT, and DELETE HTTP verbs are idempotent.',
      'POST creates resources and is non-idempotent.',
      'HTTP 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden.'
    ],
    codeSnippet: `// Express.js REST endpoint with standard status codes
app.post('/api/enrollments', authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: "courseId is required" });
  
  const enrollment = await createEnrollment(req.user.id, courseId);
  res.status(201).json({ success: true, data: enrollment });
});`,
    content: `REST (Representational State Transfer) is an architectural style emphasizing stateless client-server interactions, cacheability, and uniform resource identifiers.`,
  },
];

export const initialQuizzes = [
  // Quiz 1 for Python Fundamentals
  {
    _id: 'quiz_py_01',
    course: 'course_python_101',
    title: 'Python Core & Control Flow Evaluation',
    topic: 'Python Basics',
    difficulty: 'Beginner',
    passingScore: 60,
    questions: [
      {
        questionText: 'What is the data type of the expression `[i**2 for i in range(4)]` in Python?',
        options: ['Tuple', 'Set', 'List', 'Generator object'],
        correctOptionIndex: 2,
        explanation: 'Enclosing the comprehension in square brackets `[...]` produces a mutable Python List.',
        topic: 'Python Basics',
      },
      {
        questionText: 'Which of the following data types in Python is IMMUTABLE?',
        options: ['List', 'Dictionary', 'String', 'Set'],
        correctOptionIndex: 2,
        explanation: 'Strings in Python are immutable; any modification creates a new string object in memory.',
        topic: 'Python Basics',
      },
      {
        questionText: 'What rule governs variable resolution order in Python?',
        options: ['FIFO Rule', 'LEGB Rule (Local, Enclosing, Global, Built-in)', 'Alphabetical hierarchy', 'Parent-Child strict lookup'],
        correctOptionIndex: 1,
        explanation: 'Python resolves names using the LEGB scope sequence: Local -> Enclosing -> Global -> Built-in.',
        topic: 'Functions & Algorithms',
      },
      {
        questionText: 'What will `bool([])` evaluate to in Python?',
        options: ['True', 'False', 'TypeError', 'None'],
        correctOptionIndex: 1,
        explanation: 'Empty containers such as empty lists, tuples, and dictionaries are falsy in Python boolean evaluation.',
        topic: 'Control Flow',
      },
    ],
  },

  // Quiz 2 for Database Fundamentals
  {
    _id: 'quiz_db_01',
    course: 'course_db_103',
    title: 'Relational Database Fundamentals & SQL',
    topic: 'Database Fundamentals',
    difficulty: 'Beginner',
    passingScore: 60,
    questions: [
      {
        questionText: 'Which normal form eliminates partial dependencies where non-key attributes depend on only part of a composite candidate key?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correctOptionIndex: 1,
        explanation: '2NF requires that all non-key attributes be fully functionally dependent on the primary key, eliminating partial dependencies.',
        topic: 'Database Fundamentals',
      },
      {
        questionText: 'What data structure is standardly used by relational engines for fast indexed range and point queries?',
        options: ['Binary Search Tree', 'B-Tree / B+ Tree', 'Linked List', 'Hash Table without chaining'],
        correctOptionIndex: 1,
        explanation: 'B+ Trees provide balanced search depth, fast sorted range scans, and high fan-out suited for block storage.',
        topic: 'Query Optimization',
      },
      {
        questionText: 'What does the "I" in database ACID properties stand for?',
        options: ['Idempotency', 'Integrity', 'Isolation', 'Indexability'],
        correctOptionIndex: 2,
        explanation: 'Isolation ensures that concurrent transactions execute without interfering with one another.',
        topic: 'Database Fundamentals',
      },
      {
        questionText: 'Which SQL clause is used to filter aggregated grouped records?',
        options: ['WHERE', 'HAVING', 'FILTER BY', 'GROUP FILTER'],
        correctOptionIndex: 1,
        explanation: 'The HAVING clause filters rows after aggregation has been performed by GROUP BY, while WHERE filters beforehand.',
        topic: 'Query Optimization',
      },
    ],
  },

  // Quiz 3 for JavaScript
  {
    _id: 'quiz_js_01',
    course: 'course_js_102',
    title: 'JavaScript Async & Execution Engine',
    topic: 'JavaScript Engine',
    difficulty: 'Intermediate',
    passingScore: 60,
    questions: [
      {
        questionText: 'Where are variables declared with `let` and `const` kept before their declaration line is executed?',
        options: ['Global Object', 'Temporal Dead Zone (TDZ)', 'Call Stack Frame', 'Heap Garbage Collector'],
        correctOptionIndex: 1,
        explanation: 'Variables declared with let and const are hoisted to their scope but remain in the Temporal Dead Zone (TDZ) until evaluation.',
        topic: 'JavaScript Engine',
      },
      {
        questionText: 'Which queue has higher processing priority in the JavaScript Event Loop?',
        options: ['Macrotask queue (setTimeout)', 'Microtask queue (Promise callbacks)', 'I/O polling cycle', 'RequestAnimationFrame'],
        correctOptionIndex: 1,
        explanation: 'The microtask queue is drained completely after the currently executing call stack task, before processing any macrotasks.',
        topic: 'Asynchronous Programming',
      },
      {
        questionText: 'What is a closure in JavaScript?',
        options: [
          'A function wrapped inside an object literal',
          'A function that retains access to variables from its outer lexical scope even after that outer scope has returned',
          'A method that seals an object from property additions',
          'An immediately invoked arrow function'
        ],
        correctOptionIndex: 1,
        explanation: 'Closures bundle a function with references to its surrounding lexical state, preserving that state across function calls.',
        topic: 'JavaScript Engine',
      },
    ],
  },
];
