import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    professionalAffiliation: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: Number, required: true, unique: true },
    password: { type: String, required: true }
});

const appointmentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    rollNum: { type: String, required: true },
    date: { type: String, required: true },
    detail: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    professionalAffiliation: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true }
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    date: { type: String, required: true },
    content: { type: String, required: true },
    views: { type: Number, required: true },
    fileRef: { type: String },
    comments: [commentSchema]
});

export const Appointment = new mongoose.model("cc_appointments", appointmentSchema);
export const Post = new mongoose.model("cc_posts", postSchema);
export const User = new mongoose.model("cc_users", userSchema);
