const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true, //cho phép trùng tên 
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role:{
            type: String,
            enum: ['admin', 'customer', 'manager', 'baker', 'shipper'],
            default: 'customer',
        },
      

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/], // Basic email validation 

        },
        phone: {
            type: String,
            trim: true,
            default: ""
        },
        address: {
            type: String,
            trim: true,
            default: ""
        },
        avatar: {
            type: String,
            default: ""
        },
        googleId: {
            type: String,
            default: ""
        }
    },
    {timestamps: true}, // Automatically manage createdAt and updatedAt fields
    
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// match User entered password to Hashed password 

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
 module.exports = mongoose.model('User', userSchema);