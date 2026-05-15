import { useState, useEffect } from 'react';
import { studentService } from '../services/api';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card p-6 flex items-center space-x-4"
  >
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    totalStudents: 0,
    departmentStats: [],
    recentStudents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await studentService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome to your student management system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          color="bg-blue-500"
          delay={0.1}
        />
        <StatCard 
          title="Departments" 
          value={stats.departmentStats.length} 
          icon={GraduationCap} 
          color="bg-purple-500"
          delay={0.2}
        />
        <StatCard 
          title="Avg. CGPA" 
          value="8.4" 
          icon={TrendingUp} 
          color="bg-emerald-500"
          delay={0.3}
        />
        <StatCard 
          title="Recent Additions" 
          value={stats.recentStudents.length} 
          icon={Clock} 
          color="bg-amber-500"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-bold mb-6 dark:text-white">Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: darkMode ? '#fff' : '#000',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: darkMode ? '#fff' : '#000' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold dark:text-white">Recently Added Students</h3>
            <Link to="/students" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentStudents.map((student, i) => (
              <div key={student._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold dark:text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.department}</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {student.year} Year
                </span>
              </div>
            ))}
            {stats.recentStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No students added yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Link 
          to="/students" 
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus size={20} />
          <span>Manage Students</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
