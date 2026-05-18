const pool = require('../config/db');

// Get all students with pagination
const getAllStudents = async (page, limit) => {
    const offset = (page - 1) * limit;

    const studentsResult = await pool.query(
        `SELECT id, first_name, last_name, email, dob, created_at
         FROM students
         ORDER BY id ASC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM students');
    const totalRecords = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        students: studentsResult.rows,
        pagination: {
            currentPage: page,
            totalPages,
            totalRecords,
            limit,
        },
    };
};

// Get a single student by ID along with their marks
const getStudentById = async (id) => {
    const studentResult = await pool.query(
        `SELECT id, first_name, last_name, email, dob, created_at
         FROM students
         WHERE id = $1`,
        [id]
    );

    if (studentResult.rows.length === 0) {
        return null;
    }

    const marksResult = await pool.query(
        `SELECT id, subject, mark
         FROM marks
         WHERE student_id = $1
         ORDER BY id ASC`,
        [id]
    );

    return {
        ...studentResult.rows[0],
        marks: marksResult.rows,
    };
};

// Create a new student with marks (uses transaction)
const createStudent = async (studentData) => {
    const { first_name, last_name, email, dob, marks } = studentData;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const studentResult = await client.query(
            `INSERT INTO students (first_name, last_name, email, dob)
             VALUES ($1, $2, $3, $4)
             RETURNING id, first_name, last_name, email, dob, created_at`,
            [first_name, last_name, email, dob]
        );

        const newStudent = studentResult.rows[0];

        const insertedMarks = [];
        if (marks && marks.length > 0) {
            for (const mark of marks) {
                const markResult = await client.query(
                    `INSERT INTO marks (student_id, subject, mark)
                     VALUES ($1, $2, $3)
                     RETURNING id, subject, mark`,
                    [newStudent.id, mark.subject, mark.mark]
                );
                insertedMarks.push(markResult.rows[0]);
            }
        }

        await client.query('COMMIT');

        return { ...newStudent, marks: insertedMarks };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Update an existing student and replace their marks (uses transaction)
const updateStudent = async (id, studentData) => {
    const { first_name, last_name, email, dob, marks } = studentData;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const studentResult = await client.query(
            `UPDATE students
             SET first_name = $1, last_name = $2, email = $3, dob = $4
             WHERE id = $5
             RETURNING id, first_name, last_name, email, dob, created_at`,
            [first_name, last_name, email, dob, id]
        );

        if (studentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const updatedStudent = studentResult.rows[0];

        // Remove old marks and insert the new ones
        await client.query('DELETE FROM marks WHERE student_id = $1', [id]);

        const insertedMarks = [];
        if (marks && marks.length > 0) {
            for (const mark of marks) {
                const markResult = await client.query(
                    `INSERT INTO marks (student_id, subject, mark)
                     VALUES ($1, $2, $3)
                     RETURNING id, subject, mark`,
                    [id, mark.subject, mark.mark]
                );
                insertedMarks.push(markResult.rows[0]);
            }
        }

        await client.query('COMMIT');

        return { ...updatedStudent, marks: insertedMarks };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Delete a student (marks are removed via CASCADE)
const deleteStudent = async (id) => {
    const result = await pool.query(
        `DELETE FROM students WHERE id = $1 RETURNING id, first_name, last_name`,
        [id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};
