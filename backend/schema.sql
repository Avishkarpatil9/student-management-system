-- Database Schema for Student Management System
-- Run: psql -U postgres -d student_management -f schema.sql

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    id          SERIAL PRIMARY KEY,
    first_name  VARCHAR(50)  NOT NULL,
    last_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    dob         DATE         NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Create the marks table (one-to-many with students)
CREATE TABLE IF NOT EXISTS marks (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject     VARCHAR(100) NOT NULL,
    mark        INTEGER      NOT NULL CHECK (mark >= 0 AND mark <= 100)
);

-- Sample data for testing
INSERT INTO students (first_name, last_name, email, dob) VALUES
('Rahul',   'Sharma',  'rahul.sharma@example.com',  '2000-05-15'),
('Priya',   'Patel',   'priya.patel@example.com',   '2001-03-22'),
('Amit',    'Kumar',   'amit.kumar@example.com',     '1999-11-08'),
('Sneha',   'Desai',   'sneha.desai@example.com',    '2002-01-30'),
('Vikram',  'Singh',   'vikram.singh@example.com',   '2000-07-14');

INSERT INTO marks (student_id, subject, mark) VALUES
(1, 'Mathematics', 85),
(1, 'Science',     90),
(1, 'English',     78),
(2, 'Mathematics', 92),
(2, 'Science',     88),
(3, 'Mathematics', 74),
(3, 'English',     82),
(4, 'Science',     95),
(4, 'English',     89),
(5, 'Mathematics', 67),
(5, 'Science',     73);
