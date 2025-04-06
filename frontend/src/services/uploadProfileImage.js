import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase-client";

/**
 * Uploads a profile image to Firebase Storage and returns the download URL.
 * @param {File} file - The image file to upload.
 * @param {string} userId - The ID of the user uploading the image.
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export const uploadProfileImage = async (file, userId) => {
  try {
    const storageRef = ref(storage, `profile-images/${userId}/${file.name}`);

    // Upload the image
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};