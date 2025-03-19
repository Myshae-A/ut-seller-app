import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Initializing Firebase Admin SDK with credentials and database URL
admin.initializeApp({
  credential: admin.credential.cert(creds),
});

const db = admin.firestore();

export { admin, db };