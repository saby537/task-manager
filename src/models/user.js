const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task=require('../models/tasks')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}
// Linking virtually to tasks table
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

// Create JSON Web Token for instance
userSchema.methods.generateAuthToken = async function(){
    const user=this
    const token= jwt.sign({_id:user._id.toString()},process.env.JWT_TOKEN)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON = function (){
    const user=this
    const userObect=user.toObject()
    delete userObect.password
    delete userObect.tokens
    delete userObect.avatar
    return userObect
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
// Deleting tasks of users if user is deleted

userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({'owner':this._id})
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User