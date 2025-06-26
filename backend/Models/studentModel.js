const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
   
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    birthday: { type: Date,
        required: true,
    },
    japaneseLevel: {
        type: String,
        required: true,
        enum: ['N5', 'N4', 'N3', 'JLPT', 'NAT'],
    
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
    },
    photograph: {
        type: String,
        required: true,
    },
    visaType: {
        type: String,
        required: true,
        enum: ['student', 'ssw'],
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
    },
    { timestamps: true });

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;