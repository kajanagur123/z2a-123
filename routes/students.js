const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to compute grade
function computeGrade(percentage) {
  if (percentage >= 75) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

// POST /api/students - add student with subjects
router.post('/', async (req, res) => {
  try {
    const { name, roll, dob, subjects } = req.body;
    if (!name || !roll || !dob || !Array.isArray(subjects)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (subjects.length < 1 || subjects.length > 10) {
      return res.status(400).json({ message: 'Subjects must be between 1 and 10' });
    }
    // calculate totals
    let total = 0;
    let overall_pass = true;
    for (const s of subjects) {
      const m = Number(s.marks);
      if (isNaN(m)) return res.status(400).json({ message: 'Marks must be numeric' });
      total += m;
      if (!s.pass) overall_pass = false;
    }
    const percentage = (total / (subjects.length * 100)) * 100;
    const grade = computeGrade(percentage);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(
        'INSERT INTO students (name, roll, dob, total, percentage, grade, overall_pass) VALUES (?,?,?,?,?,?,?)',
        [name, roll, dob, total, percentage.toFixed(2), grade, overall_pass ? 1 : 0]
      );
      const studentId = result.insertId;
      for (const s of subjects) {
        await conn.query(
          'INSERT INTO subjects (student_id, name, marks, pass) VALUES (?,?,?,?)',
          [studentId, s.name, Number(s.marks), s.pass ? 1 : 0]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    res.json({ message: 'Student saved' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Roll number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students - list all students with totals
router.get('/', async (req, res) => {
  try {
    const [students] = await db.query('SELECT id, roll, name, total, percentage, grade, overall_pass FROM students ORDER BY created_at DESC');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students/:roll/:dob - fetch student by roll and dob
router.get('/:roll/:dob', async (req, res) => {
  try {
    const { roll, dob } = req.params;
    const [rows] = await db.query('SELECT * FROM students WHERE roll = ? AND dob = ?', [roll, dob]);
    if (!rows.length) return res.status(404).json({ message: 'Student not found' });
    const student = rows[0];
    const [subjects] = await db.query('SELECT name, marks, pass FROM subjects WHERE student_id = ?', [student.id]);
    res.json({
      roll: student.roll,
      name: student.name,
      dob: student.dob,
      total: student.total,
      percentage: student.percentage,
      grade: student.grade,
      overall_pass: !!student.overall_pass,
      subjects: subjects.map(s => ({ name: s.name, marks: s.marks, pass: !!s.pass }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
