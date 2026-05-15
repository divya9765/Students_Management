const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add the student name'],
        },
        registerNumber: {
            type: String,
            required: [true, 'Please add the register number'],
            unique: true,
        },
        department: {
            type: String,
            required: [true, 'Please add the department'],
        },
        year: {
            type: String,
            required: [true, 'Please add the year'],
        },
        email: {
            type: String,
            required: [true, 'Please add the email'],
        },
        phone: {
            type: String,
            required: [true, 'Please add the phone number'],
        },
        address: {
            type: String,
            required: [true, 'Please add the address'],
        },
        cgpa: {
            type: Number,
            required: [true, 'Please add the CGPA'],
        },
        attendance: {
            type: Number,
            default: 0,
        },
        skills: {
            type: [String],
            default: [],
        },
        profileImage: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Student', studentSchema);
