# Student Management System

Full-stack CRUD application built with Node.js, Express, PostgreSQL, React, and Bootstrap.

## Project Structure

```
student-management-system/
├── backend/
│   ├── config/db.js                  # PostgreSQL connection pool
│   ├── controllers/student.controller.js
│   ├── middleware/errorHandler.js
│   ├── routes/student.routes.js
│   ├── services/student.service.js   # All database queries
│   ├── .env                          # Environment variables
│   ├── .env.example
│   ├── app.js                        # Express entry point
│   ├── package.json
│   └── schema.sql                    # Database tables + sample data
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── StudentList.jsx       # Student table with delete
│       │   ├── StudentForm.jsx       # Add/Edit form with marks
│       │   └── PaginationBar.jsx     # Pagination controls
│       ├── services/studentApi.js    # Axios API calls
│       ├── App.js
│       ├── App.css
│       └── index.js
│
├── postman_collection.json
└── .gitignore
```

## Database Setup

1. Open pgAdmin or psql terminal
2. Create a new database:
   ```sql
   CREATE DATABASE student_management;
   ```
3. Run the schema file to create tables and insert sample data:
   ```bash
   psql -U postgres -d student_management -f backend/schema.sql
   ```

## Backend Setup

```bash
cd backend
cp .env.example .env       # Edit .env with your PostgreSQL credentials
npm install
npm run dev                 # Starts on http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
npm install
npm start                   # Opens on http://localhost:3000
```

## Environment Variables (backend/.env)

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=student_management
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/students?page=1&limit=5 | List students (paginated) |
| GET | /api/students/:id | Get student with marks |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

## Postman Testing

Import `postman_collection.json` into Postman to test all endpoints.
