import { db, storage } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface EbookData {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  ebookFile?: File;
  imageFile?: File;
}

export const uploadFile = async (file: File | undefined, folder: string): Promise<string | null> => {
  if (!file) return null;

  const storageRef = ref(storage, `${folder}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
 
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },

      (error: unknown) => {
        if (error instanceof Error) {

          console.error("Error during upload:", error.message);
          reject(`Error uploading file: ${error.message}`);
        } else {

          console.error("Unknown error during upload");
          reject('An unknown error occurred during the upload.');
        }
      },

      async () => {
        try {

          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {

          if (error instanceof Error) {
            console.error("Error getting download URL:", error.message);
            reject(`Error getting download URL: ${error.message}`);
          } else {
            console.error("Unknown error while getting download URL");
            reject('An unknown error occurred while getting the download URL.');
          }
        }
      }
    );
  });
};


export const saveEbook = async ({
    title,
    authors,
    summaries,
    bookshelves,
    languages,
    ebookFile,
    imageFile,
  }: EbookData): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {

      const ebookUrl = await uploadFile(ebookFile, "ebooks");
      const imageUrl = await uploadFile(imageFile, "images");
      const docRef = await addDoc(collection(db, "ebooks"), {
        title,
        authors,
        summaries,
        bookshelves,
        languages,
        ebook_url: ebookUrl,
        image_url: imageUrl,
      });
  
      return { success: true, id: docRef.id };
    } catch (error: unknown) {
      if (error instanceof Error) {  
        console.error("Error saving ebook: ", error.message);
        return { success: false, error: error.message };
      }
      console.error("Unknown error occurred");
      return { success: false, error: "Unknown error occurred" };
    }
  };
  