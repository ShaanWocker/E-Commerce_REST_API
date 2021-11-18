const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true }, 
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { 
            type:boolean, 
            default: false, 
        },
    }, {timestamps: true}
);

export default UserSchema;