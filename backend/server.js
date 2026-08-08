import express from "express";
import mongoose from "mongoose";
import { TaskBio } from "./TaskBio.js";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

console.log(process.env.MONGO_URI);
mongoose
  .connect(
    process.env.MONGO_URI,
    {
      dbName: "TODO-App",
    },
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.json({ message: "This is Home Route" });
// });

//Get all tasks
app.get("/", async(req, res) => {
    try {
        let task = await TaskBio.find().sort({ createdTime:-1 });
        res.json({ message: "All Tasks", tasks: task });
    }
    catch(error) {
        res.json({ message: "Error fetching tasks", error: error.message })
    }
})

//Add Task
app.post("/", async (req, res) => {
    const { name, description } = req.body;
    
    try {
        let task = await TaskBio.findOne({ name });
        if (task) {
            return res.json({ message: "Task already exists" });
        }
        task = await TaskBio.create({ name, description });
        res.json({ message: "Task added successfully", task });
    }
    catch (error) {
        res.json({ message: "Error adding task", error: error.message });
   }
});

//Delete Task

    app.delete("/:id", async (req, res) => {
        const id = req.params.id;
        try {
            let task = await TaskBio.findByIdAndDelete(id);
            if (!task) {
                return res.json({ message: "Task not found" });
            }
            res.json({ message: "Task deleted successfully", task });
        }
        catch(error) {
            res.json({ message: "Error deleting task", error: error.message });
        }
        });

//Edit Task
    app.put("/:id", async (req, res) => {
        const id = req.params.id;
        const updatedTask = req.body;
        try {
            let task = await TaskBio.findById(id);
            if (!task) {
                return res.json({ message: "Task not found" });
            }
            let task1 = await TaskBio.findOne({ name: updatedTask.name });
            if (task1 && task1._id.toString() !== id) {
                return res.json({ message: "Task with this name already exists" });
            }
            let data = await TaskBio.findByIdAndUpdate(id, updatedTask, { new: true });
            res.json({ message: "Your task has been updated successfully", task: data });
        }
        catch(error) {
            res.json({ message: "Error updating task", error: error.message });
        }
    });

app.listen(2000, () => console.log("Server is running on port 2000"));


export default app;