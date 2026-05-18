import React from 'react';
import Swal from 'sweetalert2';
import studentApi from '../services/studentApi';

const StudentList = ({ students, onEdit, onRefresh, loading }) => {

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${name}. This cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await studentApi.remove(id);
                Swal.fire({
                    title: 'Deleted!',
                    text: `${name} has been deleted.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
                onRefresh();
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Failed to delete student',
                    icon: 'error',
                });
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    ) : students.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                                No students found. Click "Add Student" to get started.
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>{student.email}</td>
                                <td>{formatDate(student.dob)}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => onEdit(student)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                            handleDelete(
                                                student.id,
                                                `${student.first_name} ${student.last_name}`
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
