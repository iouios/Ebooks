import { db } from "../../admin/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "ebooks"));
    const ebooks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        authors: data.authors,
        summaries: data.summaries,
        bookshelves: data.bookshelves,
        languages: data.languages,
        ebook_url: data.ebook_url,
        image_url: data.image_url,
      };
    });

    return NextResponse.json(ebooks);
  } catch (error) {
    console.error("🔥 Error fetching ebooks:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
