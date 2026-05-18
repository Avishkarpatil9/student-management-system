import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import studentApi from '../services/studentApi';

const StudentForm = ({ editStudent, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
    });

    const [marks, setMarks] = useState([{ subject: '', mark: '' }]);
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = editStudent !== null;

    // Pre-fill form when editing
    useEffect(() => {
        if (editStudent) {
            setFormData({
                first_name: editStudent.first_name || '',
                last_name:  editStudent.last_name  || '',
                email:      editStudent.email       || '',
                dob:        editStudent.dob ? editStudent.dob.split('T')[0] : '',
            });

            if (editStudent.marks && editStudent.marks.length > 0) {
                setMarks(editStudent.marks.map(m => ({
                    subject: m.subject,
                    mark:    m.mark.toString(),
                })));
            } else {
                setMarks([{ subject: '', mark: '' }]);
            }
        } else {
            setFormData({ first_name: '', last_name: '', email: '', dob: '' });
            setMarks([{ subject: '', mark: '' }]);
        }
    }, [editStudent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMarkChange = (index, field, value) => {
        const updatedMarks = [...marks];
        updatedMarks[index][field] = value;
        setMarks(updatedMarks);
    };

    const addMarkRow = () => {
        setMarks([...marks, { subject: '', mark: '' }]);
    };

    const removeMarkRow = (index) => {
        if (marks.length === 1) return;
        const updatedMarks = marks.filter((_, i) => i !== index);
        setMarks(updatedMarks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const validMarks = marks
                .filter(m => m.subject.trim() !== '' && m.mark !== '')
                .map(m => ({
                    subject: m.subject.trim(),
                    mark:    parseInt(m.mark, 10),
                }));

            const payload = { ...formData, marks: validMarks };

            if (isEditMode) {
                await studentApi.update(editStudent.id, payload);
                Swal.fire({
                    title: 'Updated!',
                    text: 'Student updated successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await studentApi.create(payload);
                Swal.fire({
                    title: 'Created!',
                    text: 'Student created successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            onSuccess();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Something went wrong',
                icon: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                    {isEditMode ? 'Edit Student' : 'Add New Student'}
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="first_name" className="form-label">
                                First Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="last_name" className="form-label">
                                Last Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">
                                Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="dob" className="form-label">
                                Date of Birth <span className="text-danger">*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <hr />
                    <h6 className="mb-3">Marks</h6>

                    {marks.map((mark, index) => (
                        <div className="row mb-2 align-items-end" key={index}>
                            <div className="col-md-5">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={mark.subject}
                                    onChange={(e) =>
                                        handleMarkChange(index, 'subject', e.target.value)
                                    }
                                    placeholder="e.g. Mathematics"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Mark (0-100)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={mark.mark}
                                    onChange={(e) =>
                                        handleMarkChange(index, 'mark', e.target.value)
                                    }
                                    placeholder="e.g. 85"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeMarkRow(index)}
                                    disabled={marks.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm mb-3"
                        onClick={addMarkRow}
                    >
                        + Add Subject
                    </button>

                    <hr />
                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={submitting}
                        >
                            {submitting
                                ? (isEditMode ? 'Updating...' : 'Saving...')
                                : (isEditMode ? 'Update Student' : 'Save Student')
                            }
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
