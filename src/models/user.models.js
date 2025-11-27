import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        username:{
            type: String,
            required: [true, "UserName is required"],
            trim: true,
            unique: true,
            lowecase: true,
            index: true,
        },
        email:{
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowecase: true,
        },
        fullName:{
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true
        },
        avatar:{
            type: String, // cloudinary uri
            required: [true, "Avatar is required"],
        },
        coverImage:{
            type: String, // cloudinary uri
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        password:{
            type: String,
            required: [true, "password is required"]
        },
        refreshToken:{
            type: String,
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswardCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
     return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET
        ,{
            expiresIn: REFRESH_TOKEN_EXPIRY,
        }
     )
}


export const User = mongoose.model("User",userSchema);