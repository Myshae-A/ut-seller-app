import express from 'express';
import dotenv from 'dotenv';

// import db from './config/firebase-admin.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { admin, db } from './config/firebase-admin.js';
// import { sendEmailVerification } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });


dotenv.config();
const app = express();
app.use(bodyParser.json()); // must keep this...

app.use(cors({
    origin: ['https://ut-seller-app-miso.vercel.app', 'http://localhost:5173', 'http://localhost:4000']
}));

// const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body

// // Using Postman to test without having a frontend!
// app.use("/api/users", productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
})

app.get('/api', (req, res) => {
    res.json({ message: 'Hello World (from api)!' });
}) 
  

// GET: Fetch all products
app.get('/api/products', async (req, res) => {
    try {
        const productsCollection = db.collection('products');
        const productsSnapshot = await productsCollection.get();
        const productsList = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(productsList);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST: Add a new product
app.post('/api/products', async (req, res) => {
    try {
        const product = req.body;
        const productRef = await db.collection('products').add(product);
        res.status(201).json({ success: true, id: productRef.id });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST: Upload an image
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
        const imageFile = req.file;
        const imagePath = `products/${Date.now()}-${imageFile.originalname}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile.buffer);
        const downloadUrl = await getDownloadURL(imageRef);
        res.status(200).json({ success: true, url: downloadUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE: Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productRef = db.collection('products').doc(productId);
        await productRef.delete();
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT: Update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        const productRef = db.collection('products').doc(productId);
        await productRef.update(updatedProduct);
        res.status(200).json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST: Register a new user
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
      const userCredential = await admin.auth().createUser({
          email,
          password,
      });
      const user = userCredential;

      // Send email verification -- doesn't work
    //   await admin.auth().generateEmailVerificationLink(email).then(() => {

    //     console.log("success" + emailVerificationLink)
    //   }).catch((error) => {
    //     console.error("Error sending email verification:", error);
    //   });

      // Create user document in Firestore -- works
      await db.collection('users').doc(user.uid).set({
          email: user.email,
          createdAt: new Date(),
          postedProductsPending: [],
          postedProductsConfirmed: [],
          requestedProductsPending: [],
          requestedProductsConfirmed: [],
          emailVerified: false // Start as unverified
      });

      res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Register a new Google user
app.post('/api/register-google', async (req, res) => {
  const { uid } = req.body;
  try {
    // check if user already exists in firebase:
    // console.log("uid: ", uid)
    const userCredential = await admin.auth().getUser(uid);
    const user = userCredential;

    // console.log("postedProducts? "+user.postedProductsPending);
    const userDoc = await db.collection('users').doc(uid).get("postedProductsPending");
    if (userDoc.exists) { // if user document already exists in Firestore,
        // then user already exists, so skip
        // console.log("User document already exists in Firestore");
    } else {
        // console.log("User document does not exist in Firestore");
        // Create user document in Firestore
        await db.collection('users').doc(uid).set({
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date(),
            postedProductsPending: [],
            postedProductsConfirmed: [],
            requestedProductsPending: [],
            requestedProductsConfirmed: [],
            emailVerified: true // Google users are verified by default
        });
    }
    res.send({ success: true, message: 'Google user registered successfully' });
    } catch (error) {
        console.error("Error registering Google user:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // connectDB();
    console.log('Server started at https://ut-seller-app.vercel.app:' + PORT);
});
