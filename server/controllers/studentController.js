const Student = require('../models/studentModel');
const getStudents = async (req, res) => {
    const { department, year, search } = req.query;
    let query = { user: req.user.id };

    if (department) query.department = department;
    if (year) query.year = year;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { registerNumber: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.status(200).json(students);
};
const setStudent = async (req, res) => {
    const { name, registerNumber, department, year, email, phone, address, cgpa, attendance, skills } = req.body;

    if (!name || !registerNumber || !department || !year || !email || !phone || !address || !cgpa) {
        res.status(400);
        throw new Error('Please add all required fields');
    }
    const studentExists = await Student.findOne({ registerNumber });
    if (studentExists) {
        res.status(400);
        throw new Error('Student with this register number already exists');
    }

    const student = await Student.create({
        user: req.user.id,
        name,
        registerNumber,
        department,
        year,
        email,
        phone,
        address,
        cgpa,
        attendance: attendance || 0,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
        profileImage: req.file ? req.file.path.replace(/\\/g, '/') : ''
    });

    res.status(201).json(student);
};
const updateStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(400);
        throw new Error('Student not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    
    if (student.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedData = { ...req.body };
    if (req.body.skills && typeof req.body.skills === 'string') {
        updatedData.skills = req.body.skills.split(',').map(skill => skill.trim());
    }
    if (req.file) {
        updatedData.profileImage = req.file.path.replace(/\\/g, '/');
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
    });

    res.status(200).json(updatedStudent);
};
const deleteStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(400);
        throw new Error('Student not found');
    }
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    if (student.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await student.deleteOne();

    res.status(200).json({ id: req.params.id });
};
const getStats = async (req, res) => {
    const totalStudents = await Student.countDocuments({ user: req.user.id });
    
    const departmentStats = await Student.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const recentStudents = await Student.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        totalStudents,
        departmentStats,
        recentStudents
    });
};

module.exports = {
    getStudents,
    setStudent,
    updateStudent,
    deleteStudent,
    getStats
};
