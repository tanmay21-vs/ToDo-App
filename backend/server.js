import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { TaskBio } from "./TaskBio.js";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    dbName: "TODO-App",
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.json({ message: "This is Home Route" });
// });

// Google Login
app.post("/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const name = payload.name;
        const email = payload.email;

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.create({
                googleId,
                name,
                email,
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.json({
            message: "Google login successful",
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Google authentication failed",
        });
    }
});

//Get all tasks
app.get("/",authMiddleware, async (req, res) => {
  try {
    let task = await TaskBio.find({ userId: req.user.userId }).sort({ createdTime: -1 });
    res.json({ message: "All Tasks", tasks: task });
  } catch (error) {
    res.json({ message: "Error fetching tasks", error: error.message });
  }
});

//Add Task
app.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  try {
    let task = await TaskBio.findOne({ name });
    if (task) {
      return res.json({ message: "Task already exists" });
    }
    task = await TaskBio.create({ name, description, userId: req.user.userId });
    res.json({ message: "Task added successfully", task });
  } catch (error) {
    res.json({ message: "Error adding task", error: error.message });
  }
});

//Delete Task

app.delete("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    let task = await TaskBio.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!task) {
      return res.json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.json({ message: "Error deleting task", error: error.message });
  }
});

//Edit Task
app.put("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;
  try {
    let task = await TaskBio.findOne({ _id: id, userId: req.user.userId });
    if (!task) {
        return res.json({ message: "Task not found" });
    }
    let task1 = await TaskBio.findOne({ name: updatedTask.name });
    if (task1 && task1._id.toString() !== id) {
      return res.json({ message: "Task with this name already exists" });
    }
    let data = await TaskBio.findOneAndUpdate(
        {
            _id: id,
            userId: req.user.userId
        },
        updatedTask,
        { new: true }
    );
    res.json({
      message: "Your task has been updated successfully",
      task: data,
    });
  } catch (error) {
    res.json({ message: "Error updating task", error: error.message });
  }
});

app.listen(2000, () => console.log("Server is running on port 2000"));

export default app;
