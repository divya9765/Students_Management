import { useState, useEffect } from 'react';
import { studentService } from '../services/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Download,
  MoreVertical,
  Mail,
  Phone,
  GraduationCap,
  X,
  User,
  Upload,
  Eye,
  MapPin,
  Calendar,
  Award,
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const StudentModal = ({ isOpen, onClose, student, fetchStudents }) => {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    year: '',
    email: '',
    phone: '',
    address: '',
    cgpa: '',
    attendance: '',
    skills: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        registerNumber: student.registerNumber || '',
        department: student.department || '',
        year: student.year || '',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        cgpa: student.cgpa || '',
        attendance: student.attendance || '',
        skills: student.skills ? student.skills.join(', ') : ''
      });
      setPreview(student.profileImage ? `http://localhost:5000/${student.profileImage}` : '');
    } else {
      setFormData({
        name: '', registerNumber: '', department: '', year: '', 
        email: '', phone: '', address: '', cgpa: '', attendance: '', skills: ''
      });
      setPreview('');
    }
  }, [student]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    if (image) data.append('profileImage', image);

    try {
      if (student) {
        await studentService.update(student._id, data);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(data);
        toast.success('Student added successfully');
      }
      fetchStudents();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold dark:text-white">
            {student ? 'Edit Student Details' : 'Add New Student'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                <Upload size={20} className="text-white" />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Upload Profile Image</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Full Name</label>
              <input 
                required className="input-field" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Register Number</label>
              <input 
                required className="input-field" 
                value={formData.registerNumber}
                onChange={(e) => setFormData({...formData, registerNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Department</label>
              <select 
                required className="input-field"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="">Select Dept</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Year</label>
              <select 
                required className="input-field"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Email Address</label>
              <input 
                type="email" required className="input-field" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Phone Number</label>
              <input 
                required className="input-field" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">CGPA</label>
              <input 
                type="number" step="0.01" required className="input-field" 
                value={formData.cgpa}
                onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Attendance (%)</label>
              <input 
                type="number" required className="input-field" 
                value={formData.attendance}
                onChange={(e) => setFormData({...formData, attendance: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Skills (Comma separated)</label>
              <input 
                className="input-field" placeholder="React, Node, Java..." 
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-300">Home Address</label>
            <textarea 
              required className="input-field min-h-[100px]" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-6">
              {loading ? 'Processing...' : student ? 'Update Student' : 'Save Student'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ViewStudentModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="relative h-32 bg-primary-600">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-700 p-1 shadow-xl">
              <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                {student.profileImage ? (
                  <img src={`http://localhost:5000/${student.profileImage}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold dark:text-white">{student.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{student.registerNumber}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-2 text-primary-600 mb-1">
                <GraduationCap size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Department</span>
              </div>
              <p className="text-sm font-semibold dark:text-white">{student.department}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-2 text-primary-600 mb-1">
                <Calendar size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Year</span>
              </div>
              <p className="text-sm font-semibold dark:text-white">{student.year} Year</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-2 text-emerald-600 mb-1">
                <Award size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">CGPA</span>
              </div>
              <p className="text-sm font-semibold dark:text-white">{student.cgpa} / 10.0</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <TrendingUp size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Attendance</span>
              </div>
              <p className="text-sm font-semibold dark:text-white">{student.attendance}%</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Mail size={16} />
              </div>
              <span className="text-sm">{student.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Phone size={16} />
              </div>
              <span className="text-sm">{student.phone}</span>
            </div>
            <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5">
                <MapPin size={16} />
              </div>
              <span className="text-sm flex-1">{student.address}</span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {student.skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium border border-primary-100 dark:border-primary-900/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: '', year: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, filters]);

  const fetchStudents = async () => {
    try {
      const { data } = await studentService.getAll({ 
        search: searchTerm, 
        ...filters 
      });
      setStudents(data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        toast.success('Student deleted');
        fetchStudents();
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Reg No", "Dept", "Year", "CGPA", "Attendance"];
    const tableRows = [];

    students.forEach(student => {
      const studentData = [
        student.name,
        student.registerNumber,
        student.department,
        student.year,
        student.cgpa,
        `${student.attendance}%`
      ];
      tableRows.push(studentData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [14, 165, 233], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    doc.text("Student Directory Report", 14, 15);
    doc.save(`students-report.pdf`);
    toast.success('PDF exported successfully');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students.map(s => ({
      Name: s.name,
      'Register Number': s.registerNumber,
      Department: s.department,
      Year: s.year,
      Email: s.email,
      Phone: s.phone,
      CGPA: s.cgpa,
      'Attendance (%)': s.attendance
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Student_Directory_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Excel exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Student Directory</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track all student records</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportPDF}
            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 rounded-lg transition-colors flex items-center space-x-2"
            title="Export to PDF"
          >
            <Download size={20} />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button 
            onClick={exportExcel}
            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 rounded-lg transition-colors flex items-center space-x-2"
            title="Export to Excel"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button 
            onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, ID or email..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="input-field"
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="">All Departments</option>
              <option value="Computer Science">CS</option>
              <option value="Information Technology">IT</option>
              <option value="Electronics">ECE</option>
              <option value="Mechanical">Mech</option>
            </select>
            <select 
              className="input-field"
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
            >
              <option value="">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Register No</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Dept & Year</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Performance</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <AnimatePresence>
                {students.map((student) => (
                  <motion.tr 
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          {student.profileImage ? (
                            <img src={`http://localhost:5000/${student.profileImage}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary-600 font-bold">{student.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold dark:text-white">{student.name}</p>
                          <div className="flex gap-1 flex-wrap">
                            {student.skills.slice(0, 2).map(skill => (
                              <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {student.registerNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium dark:text-gray-300">{student.department}</span>
                        <span className="text-xs text-gray-500">{student.year} Year</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-gray-500 uppercase">CGPA</span>
                            <span className="font-bold dark:text-white">{student.cgpa}</span>
                          </div>
                          <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${student.cgpa >= 8 ? 'bg-green-500' : student.cgpa >= 6 ? 'bg-blue-500' : 'bg-red-500'}`}
                              style={{ width: `${(student.cgpa / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-gray-500 uppercase">Attnd.</span>
                            <span className="font-bold dark:text-white">{student.attendance}%</span>
                          </div>
                          <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${student.attendance >= 75 ? 'bg-green-500' : student.attendance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 text-gray-400">
                        <Mail size={16} className="hover:text-primary-600 cursor-pointer" />
                        <Phone size={16} className="hover:text-primary-600 cursor-pointer" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); }}
                          className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => { setSelectedStudent(student); setIsModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {students.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Users className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">No students found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        student={selectedStudent}
        fetchStudents={fetchStudents}
      />

      <ViewStudentModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default Students;
