import mongoose from "mongoose";

const taskBioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
            type: String,
            required: true,
    },
    createdTime: {
        type: Date,
        default: Date.now
    }
});

export const TaskBio = mongoose.model("TaskBio", taskBioSchema);