import { db } from "../../admin/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface EbookData {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  price: number; 
  ebook_url: string;
  image_url: string;

}

export const saveEbook = async ({
  title,
  authors,
  summaries,
  bookshelves,
  languages,
  price,
  ebook_url,
  image_url,
}: EbookData): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, "ebooks"), {
      title,
      authors,
      summaries,
      bookshelves,
      languages,
      price,
      ebook_url,
      image_url,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving ebook: ", error);
    return { success: false, };
  }
};
