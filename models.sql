-- SQL schema for Student Result App (MySQL)
-- Database: student_app

CREATE DATABASE IF NOT EXISTS student_app;
USE student_app;

-- Table: students
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll VARCHAR(100) NOT NULL UNIQUE,
  dob DATE NOT NULL,
  total INT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  grade VARCHAR(2) NOT NULL,
  overall_pass BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: subjects
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  marks INT NOT NULL,
  pass BOOLEAN NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Sample Data: Students
INSERT INTO students (name, roll, dob, total, percentage, grade, overall_pass) VALUES
('Alice Johnson', 'R001', '2005-01-15', 420, 84.00, 'A', TRUE),
('Bob Smith', 'R002', '2005-02-20', 365, 73.00, 'B', TRUE),
('Charlie Lee', 'R003', '2005-03-12', 290, 58.00, 'C', TRUE);

-- Sample Data: Subjects
INSERT INTO subjects (student_id, name, marks, pass) VALUES
-- Alice
(1, 'Math', 90, TRUE),
(1, 'Physics', 85, TRUE),
(1, 'Chemistry', 80, TRUE),
(1, 'English', 85, TRUE),
(1, 'Biology', 80, TRUE),
-- Bob
(2, 'Math', 75, TRUE),
(2, 'Physics', 70, TRUE),
(2, 'Chemistry', 60, TRUE),
(2, 'English', 80, TRUE),
(2, 'Biology', 80, TRUE),
-- Charlie
(3, 'Math', 50, TRUE),
(3, 'Physics', 55, TRUE),
(3, 'Chemistry', 60, TRUE),
(3, 'English', 65, TRUE),
(3, 'Biology', 60, TRUE);
