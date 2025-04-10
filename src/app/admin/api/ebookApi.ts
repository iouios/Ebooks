import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface EbookData {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];

}

export const saveEbook = async ({
  title,
  authors,
  summaries,
  bookshelves,
  languages,
}: EbookData): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, "ebooks"), {
      title,
      authors,
      summaries,
      bookshelves,
      languages,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving ebook: ", error);
    return { success: false, };
  }
};
