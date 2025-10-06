import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param userId - The ID of the user uploading the file.
 * @param recordId - The ID of the health record this file is associated with.
 * @param file - The file to upload.
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (
  userId: string,
  recordId: string,
  file: File
): Promise<string> => {
  if (!userId || !recordId || !file) {
    throw new Error("Missing required parameters for file upload.");
  }

  // Create a storage reference
  const storageRef = ref(storage, `user_files/${userId}/${recordId}/${file.name}`);

  try {
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    // Depending on the error, you might want to handle it differently.
    // For instance, check for storage/unauthorized errors.
    throw new Error("Failed to upload file.");
  }
};
