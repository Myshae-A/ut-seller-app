import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase-client";

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * @param {File} file - The image file to upload.
 * @param {string} userId - The ID of the user uploading the image.
 * @param {string} folder - The folder in Firebase Storage where the file will be stored.
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export const uploadImage = async (file, userId, folder = "products") => {
  try {
    // Create a unique path for the image
    const storagePath = `${folder}/${userId}/${file.name}`;
    const storageRef = ref(storage, storagePath);

    // Upload the image
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};