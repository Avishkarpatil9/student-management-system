const studentService = require('../services/student.service');

// GET /api/students?page=1&limit=5
const getAllStudents = async (req, res, next) => {
    try {
        const page  = Math.max(parseInt(req.query.page, 10)  || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);

        const result = await studentService.getAllStudents(page, limit);

        res.status(200).json({
            success: true,
            data:    result.students,
            pagination: result.pagination,
            message: 'Students fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/students/:id
const getStudentById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID',
            });
        }

        const student = await studentService.getStudentById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${id} not found`,
            });
        }

        res.status(200).json({
            success: true,
            data:    student,
            message: 'Student fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/students
const createStudent = async (req, res, next) => {
    try {
        const { first_name, last_name, email, dob, marks } = req.body;

        if (!first_name || !last_name || !email || !dob) {
            return res.status(400).json({
                success: false,
                message: 'first_name, last_name, email, and dob are required',
            });
        }

        const newStudent = await studentService.createStudent({
            first_name,
            last_name,
            email,
            dob,
            marks: marks || [],
        });

        res.status(201).json({
            success: true,
            data:    newStudent,
            message: 'Student created successfully',
        });
    } catch (error) {
        // Duplicate email (PostgreSQL unique violation)
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'A student with this email already exists',
            });
        }
        next(error);
    }
};

// PUT /api/students/:id
const updateStudent = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID',
            });
        }

        const { first_name, last_name, email, dob, marks } = req.body;

        if (!first_name || !last_name || !email || !dob) {
            return res.status(400).json({
                success: false,
                message: 'first_name, last_name, email, and dob are required',
            });
        }

        const updatedStudent = await studentService.updateStudent(id, {
            first_name,
            last_name,
            email,
            dob,
            marks: marks || [],
        });

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${id} not found`,
            });
        }

        res.status(200).json({
            success: true,
            data:    updatedStudent,
            message: 'Student updated successfully',
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'A student with this email already exists',
            });
        }
        next(error);
    }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID',
            });
        }

        const deletedStudent = await studentService.deleteStudent(id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: `Student with ID ${id} not found`,
            });
        }

        res.status(200).json({
            success: true,
            data:    deletedStudent,
            message: 'Student deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};
