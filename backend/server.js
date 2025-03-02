import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// import db from './config/firebase-admin.js';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json()); // must keep this...

app.use(cors({
    origin: 'https://ut-seller-app.vercel.app'
}));

// const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body

// // Using Postman to test without having a frontend!
// app.use("/api/users", productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
}) 

// GET: Endpoint to retrieve all tasks
app.get("/api/users/:userId/listings", async (req, res) => {
    try {
      const { userId } = req.params; // don't forget this part when trying to get userId
      console.log("Fetching listings for user:", userId); 

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // connectDB();
    console.log('Server started at https://ut-seller-app.vercel.app:' + PORT);
});
