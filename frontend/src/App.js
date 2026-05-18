import React, { useState, useEffect, useCallback } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import PaginationBar from './components/PaginationBar';
import studentApi from './services/studentApi';
import './App.css';

function App() {
    const [students, setStudents]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showForm, setShowForm]       = useState(false);
    const [editStudent, setEditStudent] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages]   = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 5;

    const fetchStudents = useCallback(async (page = currentPage) => {
        setLoading(true);
        try {
            const result = await studentApi.getAll(page, limit);
            setStudents(result.data);
            setCurrentPage(result.pagination.currentPage);
            setTotalPages(result.pagination.totalPages);
            setTotalRecords(result.pagination.totalRecords);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit]);

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddClick = () => {
        setEditStudent(null);
        setShowForm(true);
    };

    const handleEditClick = async (student) => {
        try {
            const result = await studentApi.getById(student.id);
            setEditStudent(result.data);
            setShowForm(true);
        } catch (error) {
            console.error('Failed to fetch student details:', error);
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditStudent(null);
        fetchStudents(currentPage);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditStudent(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRefresh = () => {
        fetchStudents(currentPage);
    };

    return (
        <div className="app-wrapper">
            <nav className="navbar navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">
                        Student Management System
                    </span>
                </div>
            </nav>

            <div className="container my-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">
                        Students
                        <span className="badge bg-secondary ms-2">{totalRecords}</span>
                    </h4>
                    {!showForm && (
                        <button
                            className="btn btn-primary"
                            onClick={handleAddClick}
                        >
                            + Add Student
                        </button>
                    )}
                </div>

                {showForm && (
                    <StudentForm
                        editStudent={editStudent}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )}

                <StudentList
                    students={students}
                    onEdit={handleEditClick}
                    onRefresh={handleRefresh}
                    loading={loading}
                />

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                        Page {currentPage} of {totalPages} &middot; {totalRecords} total records
                    </small>
                    <PaginationBar
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <footer className="footer bg-light text-center py-3 mt-auto border-top">
                <div className="container">
                    <small className="text-muted">
                        Student Management System &copy; 2025
                    </small>
                </div>
            </footer>
        </div>
    );
}

export default App;
