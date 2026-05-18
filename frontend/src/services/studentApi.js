import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/students',
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAll = async (page = 1, limit = 5) => {
    const response = await API.get(`/?page=${page}&limit=${limit}`);
    return response.data;
};

const getById = async (id) => {
    const response = await API.get(`/${id}`);
    return response.data;
};

const create = async (studentData) => {
    const response = await API.post('/', studentData);
    return response.data;
};

const update = async (id, studentData) => {
    const response = await API.put(`/${id}`, studentData);
    return response.data;
};

const remove = async (id) => {
    const response = await API.delete(`/${id}`);
    return response.data;
};

const studentApi = { getAll, getById, create, update, remove };
export default studentApi;
