# EduManager - Advanced Student Management System

EduManager is a professional, full-stack student management system designed with a modern AI-company aesthetic. It features a complete CRUD interface, secure JWT authentication, and a visually impressive dashboard with real-time statistics.

## 🚀 Features

- **Modern Dashboard**: Visual statistics using Recharts, recent activity, and quick stats.
- **Complete CRUD**: Add, View, Update, and Delete student records.
- **Advanced Filtering**: Search by name/ID and filter by department or year.
- **Secure Auth**: JWT-based authentication with protected routes and password hashing.
- **Image Uploads**: Support for student profile pictures using Multer.
- **Dark/Light Mode**: Fully responsive theme switching.
- **Premium UI**: Built with Tailwind CSS, Framer Motion, and Lucide Icons.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.js.

## 📂 Project Structure

```text
Students_Management/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth & Theme state
│   │   ├── pages/       # Route pages
│   │   └── services/    # API calls
├── server/              # Node.js Backend
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── middleware/      # Auth & Error handling
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd server
npm install
# Update .env file with your MONGO_URI and JWT_SECRET
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📝 API Explanation

- **POST /api/users**: Register a new admin.
- **POST /api/users/login**: Login and receive JWT.
- **GET /api/students**: Get all students (supports query params: `search`, `department`, `year`).
- **POST /api/students**: Create a new student (Multipart/form-data for image).
- **PUT /api/students/:id**: Update student details.
- **DELETE /api/students/:id**: Remove student record.
- **GET /api/students/stats**: Get dashboard statistics.

## 🎓 Interview Prep (Module Breakdown)

### 1. Authentication Module
- **How it works**: Uses `bcryptjs` to hash passwords before saving. `jsonwebtoken` generates a token upon login, which is stored in the browser's `localStorage`.
- **Key Point**: The `protect` middleware verifies the token for every private API request.

### 2. Student CRUD Module
- **How it works**: Uses Mongoose models to interact with MongoDB. Image uploads are handled by `multer`, which saves files to the `uploads/` folder.
- **Key Point**: Implemented "Soft Search" using MongoDB Regex for a better user experience.

### 3. Dashboard Module
- **How it works**: Uses MongoDB Aggregation pipelines to calculate department-wise counts and total student metrics efficiently.
- **Key Point**: Data is visualized using `recharts` for a professional presentation.

## 👨‍💻 Author
Developed as a placement-ready mini-project for student management.
