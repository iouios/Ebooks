import { db } from "../firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export const getEbooksFromStart = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "ebooks"));
    const ebooksData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ebooksData;
  } catch (error) {
    console.error("Error fetching ebooks: ", error);
    return [];
  }
};
