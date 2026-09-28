const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength : [50, 'Name cannot exceed more than 50 characters'],
    },
    email:{
        type : String,
        required: true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
        trim : true,
        minlength : [6, 'Password must be at least 6 characters'],
        select : false,
    },
    role : {
        type : String,
        enum : ['JOB_SEEKER', 'EMPLOYER', 'HR_MANAGER', 'ADMIN'],
        default : 'JOB_SEEKER',
    },
    isActive : {
        type : Boolean,
        default : true,
    },
    lastLogin : {
        type : Date ,
    },
},
{
    timestamps : true
});

UserSchema.index({email : 1});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bycrypt.genSalt(10);

    this.password = await bycrypt.hash(this.password,salt);

    next();
});

UserSchema.method.comparePassword = async function (candidatePassword){
    return await bycrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);