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
    // const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
    const page  = parseInt(req.query.page , 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip  = (page - 1) * limit;

    try {
        const productsCollection = db.collection('products');
        const productsSnapshot = await productsCollection
            .orderBy('createdAt', 'desc') // Optional: Order by a field
            .offset(skip)
            .limit(limit)
            .get();
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

app.get('/api/users/:userId/userProducts', async (req, res) => {
    const { userId } = req.params; // Extract the userId from the request parameters
    console.log("HEREE 4-12-25 products for userId:", userId);
    try {
        // const userRef = db.collection('users').doc(userId); // Reference the user document
        // const userDoc = await userRef.get(); // Fetch the document

        // if (!userDoc.exists) {
        //     return res.status(404).json({ success: false, message: 'User not found.' });
        // }

        // const userData = userDoc.data(); // Get the user data
        // const userProducts = userData.userProducts || []; // Get the `productsPosted` array

        // -----------------------------
            // const userId = req.params.userId;
            // console.log("userId: ", userId);
            // const productData = req.body; // Use the whole request body
            // console.log("productData: ", productData);
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get(); // Fetch the document
            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            // console.log("userRef: ", userRef);
            const userProducts = userDoc.data().userProducts || []; // Fetch the user document
            // const userProducts = await userRef.get("userProducts"); // Fetch the user document
            // console.log("userProducts: ", userProducts);
            console.log("userProducts: (usually would be long list here)")

            const rawProducts = userProducts.map((item) => item.product || item);
    
            console.log("RAWPRODUCTS: (usually would be long list here)")
            // console.log("RAWPRODUCTS: ", rawProducts);

            // console.log("made it before userRef")
            // const userId = req.params.userId;
            // const userRef = db.collection('users').doc(userId);
            // console.log("Made it here bruh"); // YES IT WORKS NOW!!!! T_T glory to God!
            // await userRef.update({
            //     userProducts: admin.firestore.FieldValue.arrayUnion(productData)
            // });

        res.status(200).json(rawProducts); // Return the products posted by the user
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user products.' });
    }
});


app.put('/api/updateUsersRequestedGlobally', async (req, res) => {
    const { userId, productId, userPostedId } = req.body; // Extract the userId from the request parameters
    console.log("Received updateUsersRequestedGlobally call:");
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("userPostedId:", userPostedId);
    try {
        
        // Update the product's `usersRequested` field in the `products` collection
        const productRef = db.collection('products').doc(productId);
        await productRef.update({
            usersRequested: admin.firestore.FieldValue.arrayUnion(userId),
        });


        const userPostedRef = db.collection('users').doc(userPostedId);
        const userPostedDoc = await userPostedRef.get();

        if (!userPostedDoc.exists) {
            return res.status(404).json({ success: false, message: 'User who posted the product not found.' });
        }

        const userPostedData = userPostedDoc.data().userProducts || [];

        // The big ??? below
        // SHOULD update the user who posted the product's product to update the users requested
        const updatedProductsPosted = userPostedData.map((product) => {
            if (product.id === productId) {
                return {
                    ...product,
                    usersRequested: Array.isArray(product.usersRequested)
                        ? [...new Set([...product.usersRequested, userId])] // Add userId and ensure no duplicates
                        : [userId], // Initialize the array if it doesn't exist
                };
            }
            return product;
        });

        console.log("updatedProductsPosted::: ", updatedProductsPosted);

        await userPostedRef.update({ // works! (as far as I can tell)
            userProducts: updatedProductsPosted,
        });


    } catch (error) {
        console.error('Error updateUsersRequestedGlobally:', error);
        res.status(500).json({ success: false, message: 'Failed to update user products.' });
    }

})

// GET: Fetch a product by ID
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params; // Extract the product ID from the request parameters

    try {
        const productRef = db.collection('products').doc(id); // Reference the product document
        const productDoc = await productRef.get(); // Fetch the document

        if (!productDoc.exists) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        const productData = productDoc.data(); // Get the product data
        res.status(200).json({ success: true, product: productData }); // Return the product data
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch product.' });
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

// post: request a product (updates a TON of stuff)
app.post("/api/products/:productId/request", async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.body; // The ID of the user making the request

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }
  
    try {

        const productRef = db.collection("products").doc(productId);
        const userRef = db.collection("users").doc(userId);
    
        // Fetch the product document
        const productDoc = await productRef.get();
        if (!productDoc.exists) {
          return res.status(404).json({ success: false, message: "Product not found." });
        }
    
        const productData = productDoc.data();
        const userPostedId = productData.userPosted; // The user who posted the product
        const userPostedRef = db.collection("users").doc(userPostedId);
    
        // Fetch the user who posted the product
        const userPostedDoc = await userPostedRef.get();
        if (!userPostedDoc.exists) {
          return res.status(404).json({ success: false, message: "User who posted the product not found." });
        }
    
        const userPostedData = userPostedDoc.data();
        const productsPosted = userPostedData.productsPosted || []; // Get the `productsPosted` array
    
        // Update the specific product in the `productsPosted` array
        const updatedProductsPosted = productsPosted.map((product) => {
          if (product.id === productId) {
            return {
              ...product,
              usersRequested: Array.isArray(product.usersRequested)
                ? [...new Set([...product.usersRequested, userId])] // Add userId and ensure no duplicates
                : [userId], // Initialize the array if it doesn't exist
            };
          }
          return product;
        });
    
        
        // Replace the `productsPosted` array in Firestore
        await userPostedRef.update({
          productsPosted: updatedProductsPosted,
        });
    
        // Update the product's `usersRequested` field in the `products` collection
        await productRef.update({
          usersRequested: admin.firestore.FieldValue.arrayUnion(userId),
        });
    
        // Add the product to the requesting user's `productsRequested` array
        await userRef.update({
          productsRequested: admin.firestore.FieldValue.arrayUnion(productId),
        });

        console.log("UPDATING BOOKS REQUESTED HOPEFULLY HERE")
        // AuthContext.updateAuthBooksRequested(productId); // causes error
 
        // uneeded?
        // Add the product to the requesting user's `booksRequested` array
        // await userRef.update({
        //     booksRequested: admin.firestore.FieldValue.arrayUnion(productId),
        // });

      res.status(200).json({ success: true, message: "Request added successfully." });
    } catch (error) {
      console.error("Error adding request:", error);
      res.status(500).json({ success: false, message: "Failed to add request." });
    }
});



// POST: Add a new product to the user's productsPosted array
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
            userProducts: admin.firestore.FieldValue.arrayUnion(productData)
        });
        
        res.status(200).json({ success: true, message: 'Posted products pending updated successfully' });
    } catch (error) {
        console.error("Error updating posted products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// // Update the user's productRequested field (single product? i think)
// app.put('/api/users/:userId/productRequested', async (req, res) => {
//     const { userId } = req.params;
//     const { requestedBooks } = req.body; // Array of requested book IDs

//     if (!requestedBooks || !Array.isArray(requestedBooks)) {
//         return res.status(400).json({ success: false, message: "Invalid requestedBooks data." });
//     }

//     try {
//         const userRef = db.collection('users').doc(userId);
//         await userRef.update({
//             productsRequested: requestedBooks, // Overwrite the productsRequested field
//         });

//         res.status(200).json({ success: true, message: "Products requested updated successfully." });
//     } catch (error) {
//         console.error("Error updating productsRequested:", error);
//         res.status(500).json({ success: false, message: "Failed to update productsRequested." });
//     }
// });


// GET: Fetch all products requested by a user // STOPPED HERE!!!!!! trying to make the user's requested products render even after closing the website and logging back in. by connecting the user's requested products to the database
app.get('/api/users/:userId/productsRequested', async (req, res) => {
    const { userId } = req.params;
    console.log("HERE 2!!!! [productsRequested api call server]");
    try {
        console.log("IN HERE PRODUCTSREQUESTED SERVER")
        // Fetch the user's document
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Get the list of product IDs from the user's `productsRequested` field
        const userData = userDoc.data();
        const productsRequested = userData.productsRequested || [];

        if (productsRequested.length === 0) {
            return res.status(200).json({ success: true, products: [] }); // Return an empty list if no products are requested
        }

        // Fetch the product details for each product ID
        const productPromises = productsRequested.map(async (productId) => {
            const productRef = db.collection('products').doc(productId);
            const productDoc = await productRef.get();

            if (productDoc.exists) {
                return { id: productDoc.id, ...productDoc.data() }; // Include the product ID and data
            } else {
                console.warn(`Product with ID ${productId} not found.`);
                return null; // Handle missing products gracefully
            }
        });

        // Resolve all promises and filter out any null values (missing products)
        const products = (await Promise.all(productPromises)).filter((product) => product !== null);

        res.status(200).json({ success: true, products }); // Return the list of products
    } catch (error) {
        console.error('Error fetching requested products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch requested products.' });
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
          id: user.uid,  
          email: user.email,
          displayName: user.email.split('@')[0], // Use email as display name
          createdAt: new Date(),
          userProducts: [], // a single array to keep track of products bought, sold, posted, & requested
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
            userProducts: [], // a single array to keep track of products bought, sold, posted, & requested
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


//gets the user's name from userID - getUserNameFromID
app.get('/api/users/:userId', async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    // console.log("HERE DOES IT WORK???")
    try {
        const userRef = db.collection('users').doc(userId); // Reference the user document
        const userDoc = await userRef.get(); // Fetch the document

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let userName = userDoc.data().displayName; // Get the user's display name
        // console.log("userName WORKS???: ", userName);
        if (!userName) {
            // get the user's email instead
            userName = userDoc.data().email.split('@')[0]; // Use email as display name
        }
        // console.log("userName: ", userName);
        res.status(200).json( { userName } ); // Return the user data
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
});



app.put('/api/updateBookSoldByToOther', async (req, res) => {
    const { userId, productId, soldToUserId } = req.body; // Extract the userId from the request parameters
    console.log("Received updateBookSoldByToOther call:");
    // console.log("userId:", userId);
    // console.log("productId:", productId);
    // console.log("userPostedId:", userPostedId);
    try {

        console.log("lane 1")
        // update product in global product
        const productRef = db.collection('products').doc(productId);
        await productRef.update({
            status: 'sold',
            soldTo: soldToUserId,
        });

        console.log("lane 2")
        // update the user who SOLD the product's product status
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get(); // Fetch the document
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const userData = userDoc.data().userProducts || []; // Get the user data
        const updatedProductsPosted = userData.map((product) => {
            if (product.id === productId) {
                return {
                    ...product,
                    status: 'sold',
                    soldTo: soldToUserId,
                };
            }
            return product;
        });

        await userRef.update({
            userProducts: updatedProductsPosted,
        });

        console.log("lane 3")
        // update the user who BOUGHT the product's product status
        const userRef2 = db.collection('users').doc(soldToUserId);
        const userDoc2 = await userRef2.get(); // Fetch the document
        const userData2 = userDoc2.data().userProducts || []; // Get the user data
        const updatedProductsPosted2 = userData2.map((product) => {
            if (product.id === productId) {
                return {
                    ...product,
                    status: 'bought',
                    soldTo: soldToUserId,
                };
            }
            return product;
        });

        await userRef2.update({
            userProducts: updatedProductsPosted2,
        });




        res.status(200).json({ success: true, message: 'Product sold successfully' });
    } catch (error) {
        console.error('Error updating book sold:', error);
        res.status(500).json({ success: false, message: 'Failed to update book sold.' });
    }
});


// PUT /api/users/:userId/favorite --- updateUserFavorite
app.put('/api/users/:userId/favorite', async (req, res) => {
    console.log("updateUserFavorite --- api works! if so, then wow!")
    const { userId } = req.params;
    const { productId, favorite } = req.body;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).send({ message: 'User not found' });

    // GREAT OLD CODE
    // // update that one product in their userProducts array
    // const updated = userDoc.data().userProducts.map(p =>
    //     p.id === productId ? { ...p, favorite } : p
    // );

    if (favorite) {
        await userRef.update({
            favorites: admin.firestore.FieldValue.arrayUnion(productId)
        });
        } else {
        await userRef.update({
            favorites: admin.firestore.FieldValue.arrayRemove(productId)
        });
    }

    // GREAT OLD CODE
    // await userRef.update({ userProducts: updated });
    res.send({ success: true });
});

// GET favorites list --- fetchUserFavorites
app.get('/api/users/:userId/favorites', async (req, res) => {
    console.log("fetchUserFavorites --- this updateUserFavorite api works! if so, then wow!")
    const snap = await db.collection('users').doc(req.params.userId).get();
    if (!snap.exists) return res.status(404).send({ message:'User not found' });
    
    // GREAT OLD CODE
    // const ups = snap.data().userProducts || [];
    // const favIds = ups.filter(p => p.favorite).map(p => p.id);
    
    // res.send(favIds);

    res.send(snap.data().favorites || []);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server started at https://ut-seller-app.vercel.app:' + PORT);
});
