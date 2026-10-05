const mongoose = require('mongoose');
const User = require('./User');

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true, },
    company: { type: String, required: true, },
    location: { type: String, required: true, },
    description: { type: String, required: true, },
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrrentJob: { type: Boolean, default: false },
    _id: false
});

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true, },
    fieldOfStudy: { type: String },
    graduationYear: { type: Number, required: true, },
    grade: { type: String },
    _id: false
});

const preferencesSchema = new mongoose.Schema({
    desiredJobTitles: [String],
    desiredLocation: [String],
    jobTypes: [{
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    }],
    workMode: [{
        type: String,
        enum: ['onsite', 'remote', 'hybrid']
    }],
    desiredIndustries: [{
        type: String,
    }],
    minSalary: Number,
    maxSalary: Number,
    _id: false,
});

const jobSeekerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true,
        unique: true,
    },
    headline: { type: String, maxlength: 100 },
    bio: { type: String, maxlength: 200 },
    phone: {
        type: Number,
        match: [/^\+?[\d\s-]{10,15}$/, 'Please provide a valid phone number']
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', "Prefer not to say"]
    },
    yearOfBirth: {
        type: Number,
        min: [1950, 'Year must be after 1950'],
        max: [2010, 'Year must be before 2010']
    },
    currentLocation: String,
    permanentLocation: String,
    willingToRelocate: { type: Boolean, default: false },

    currentSalary: Number,
    expectedSalary: Number,
    salaryCurrency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
        default: 'INR'
    },
    noticePeriod: Number,
    availableFrom: Date,

    // ===== PROFESSIONAL INFO =====
    totalExperience: { type: Number }, // In years (e.g., 5.5 for 5.5 years)
    skills: [{ type: String }], // e.g., ["Node.js", "MongoDB", "AWS"]
    languages: [{ type: String }], // e.g., ["English", "Spanish", "Hindi"]

    // ===== LINKS =====
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    resumeUrl: { type: String },

    // ===== ARRAYS =====
    experience: [experienceSchema],
    education: [educationSchema],
    preferences: preferencesSchema,
},
    { timestamps: true 
});


jobSeekerProfileSchema.index({ skills: 1 });
jobSeekerProfileSchema.index({ 'preferences.desiredLocations': 1 });

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);