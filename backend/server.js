import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import path from 'path';

import db from './config/firebase-admin.js';
import bodyParser from 'body-parser';
import cors from 'cors';

import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();


app.use(cors({
    origin: 'https://ut-seller-app.vercel.app'
}));

// const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body

// // Using Postman to test without having a frontend!
// app.use("/api/users", productRoutes);

// GET: Endpoint to retrieve all tasks
app.get("/api/users/:userId/listings", async (req, res) => {
    try {
      const { userId } = req.params; // don't forget this part when trying to get userId
  
      // Fetching all documents from the "tasks" collection in Firestore
      const snapshot = await db.collection("users").doc(userId).collection("listings").get();
      
      let tasks = [];
      
      // Looping through each document and collecting data
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,  // Document ID from Firestore
          ...doc.data(),  // Document data
        });
      });
      
      // Sending a successful response with the tasks data
      res.status(200).send(tasks);
    } catch (error) {
      // Sending an error response in case of an exception
      res.status(500).send(error.message+" number 2");
    }
  });
  
  // CREATE
  // POST: Endpoint to add a new task
//   app.post("/users/:userId/tasks", async (req, res) => {
//     const newTask = req.body;
//     try {
//       const { userId } = req.params;
//       // Adding the new task to the "tasks" collection in Firestore
//       const docRef = await db.collection("users").doc(userId).collection("tasks").add(newTask);
//       const taskData = { id: docRef.id, ...newTask }; // Ensure task data includes the name
//       res.status(201).send(taskData);  // Send the complete task back
//     } catch (error) {
//       // Sending an error response in case of an exception
//       res.status(500).send(error.message);
//     }
//   });
  
//   // DELETE: Endpoint to remove a task
//   app.delete('/users/:userId/tasks/:taskId', async (req, res) => {
//     const taskId = req.params.taskId;
//     const { userId } = req.params;
//     if(taskId === undefined) {
//       res.status(404).send('Task not found');
//       return;
//     }
//     const taskRef = db.collection("users").doc(userId).collection("tasks").doc(taskId);
//     // Delete the document with the given taskId
//     await taskRef.delete();
//     res.status(200).send(taskRef);
//     // res.status(200).send(`taskId: ${taskId} is deleted!!!`);
//   });

// // Using Postman to test without having a frontend!
// app.use("/api/products", productRoutes);

// // this is for production deployment (hosting? im not too sure)
// if (process.env.NODE_ENV === 'production') {
//     // dist folder created from running npm run build in frontend
//     app.use(express.static(path.join(__dirname, '/frontend/dist')));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT);
});
