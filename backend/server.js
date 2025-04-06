import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { admin, db } from './config/firebase-admin.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();
const app = express();
app.use(bodyParser.json()); // must keep this...

app.use(cors({
    origin: ['https://ut-seller-app-miso.vercel.app', 'http://localhost:5173', 'http://localhost:4000']
}));

app.use(express.json()); // allows us to accept JSON data in the req.body

// two "sanity check" testing routes
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
        // dang, so this is the most clever thing I think co-pilot did
        // basicallly, it allows you to get the auto-generated ID of a
        // newly created empty document, then you add that id to the original data
        // then you save that updated data to the empty, newly created document
        const product = req.body;

        // Generate a new document reference with a unique ID
        const productRef = db.collection('products').doc();
        const productId = productRef.id; // Get the generated ID

        // Add the ID to the product data
        product.id = productId;

        // Save the product to the database
        await productRef.set(product);

        res.status(200).json({ success: true, product});
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/users/:userId/productsPosted', async (req, res) => {
    // const { userId } = req.params; // Extract userId from request parameters
    // const { formattedProduct } = req.body; // Extract formattedProduct from request body
    // const { userId } = req.params; // Extract userId from the URL
    // const product = req.body; // Extract the product from the request body


    // console.log("adding product to the user, test");
    try {
        const userId = req.params.userId;
        // console.log("userId: ", userId);
        const productData = req.body; // Use the whole request body
        // console.log("productData: ", productData);
        const userRef = db.collection('users').doc(userId);


        // console.log("made it before userRef")
        // const userId = req.params.userId;
        // const userRef = db.collection('users').doc(userId);
        // console.log("Made it here bruh"); // YES IT WORKS NOW!!!! T_T glory to God!
        await userRef.update({
            productsPosted: admin.firestore.FieldValue.arrayUnion(productData)
        });
        
        res.status(200).json({ success: true, message: 'Posted products pending updated successfully' });
    } catch (error) {
        console.error("Error updating posted products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST: Upload an image
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
        // const imageFile = req.file;
        // const imagePath = `products/${Date.now()}-${imageFile.originalname}`;
        // const imageRef = ref(storage, imagePath);
        // await uploadBytes(imageRef, imageFile.buffer);
        // const downloadUrl = await getDownloadURL(imageRef);
        // res.status(200).json({ success: true, url: downloadUrl });
        console.log("uploading image... blank for now");
        res.status(200).json({ success: true, message: 'Image uploaded successfully' });
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
      // await admin.auth().generateEmailVerificationLink(email).then(() => {
      //   console.log("success" + emailVerificationLink)
      // }).catch((error) => {
      //   console.error("Error sending email verification:", error);
      // });

        /* old way of handling products buy & sell:
            postedProductsPending: [],
            postedProductsConfirmed: [],
            requestedProductsPending: [],
            requestedProductsConfirmed: [],
        */

      // Create user document in Firestore -- works
      await db.collection('users').doc(user.uid).set({
          email: user.email,
          displayName: user.email, // Use email as display name
          createdAt: new Date(),
          productsBought: [],
          productsSold: [],
          productsPosted: [],
          productsRequested: [],
          emailVerified: false // Start as unverified (if logging in without google auth)
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
    // check if user already exists in firebase (using uid):
    // console.log("uid: ", uid)
    const userCredential = await admin.auth().getUser(uid);
    const user = userCredential;

    const userDoc = await db.collection('users').doc(uid).get("postedProductsPending");
    if (userDoc.exists) {
        // if user document already exists in Firestore, thus user already exists, so skip
        // console.log("User document already exists in Firestore");
    } else {
        // console.log("User document does not exist in Firestore");
        // Create user document in Firestore
        await db.collection('users').doc(uid).set({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date(),
            productsBought: [],
            productsSold: [],
            productsPosted: [],
            productsRequested: [],
            emailVerified: true // Google users are verified by default
        });
    }
    res.send({ success: true, message: 'Google user registered successfully' });
    } catch (error) {
        console.error("Error registering Google user:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to update the user's profile image
app.put("/api/users/:userId/profile-image", async (req, res) => {
    const { userId } = req.params;
    const { profileImage } = req.body;
  
    if (!profileImage) {
      return res.status(400).json({ success: false, message: "Profile image URL is required." });
    }
  
    try {
      const userRef = db.collection("users").doc(userId);
      await userRef.update({ profileImage });
  
      res.status(200).json({ success: true, message: "Profile image updated successfully." });
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).json({ success: false, message: "Failed to update profile image." });
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server started at https://ut-seller-app.vercel.app:' + PORT);
});
