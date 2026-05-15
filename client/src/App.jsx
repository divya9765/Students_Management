import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 3000,
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/students" element={<Layout><Students /></Layout>} />
              <Route path="/home" element={<Layout><div className="p-8 text-center"><h2 className="text-2xl font-bold dark:text-white">Home Page</h2><p className="text-gray-500 mt-2">Welcome to the landing page.</p></div></Layout>} />
              <Route path="/add-student" element={<Layout><div className="p-8 text-center"><h2 className="text-2xl font-bold dark:text-white">Add Student</h2><p className="text-gray-500 mt-2">Add new student records here.</p></div></Layout>} />
              <Route path="/profile" element={<Layout><div className="p-8 text-center"><h2 className="text-2xl font-bold dark:text-white">User Profile</h2><p className="text-gray-500 mt-2">Manage your admin profile.</p></div></Layout>} />
              <Route path="/settings" element={<Layout><div className="p-8 text-center"><h2 className="text-2xl font-bold dark:text-white">Settings</h2><p className="text-gray-500 mt-2">System configurations.</p></div></Layout>} />
            </Route>

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
