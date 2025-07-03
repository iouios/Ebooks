import { db } from "../../admin/firebase/firebaseConfig";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { NextResponse } from "next/server";

type Ebook = {
  id: string;
  title: string;
  summaries: string;
  authors: string;
  languages: string[];
  bookshelves: string[];
  ebook_url: string;
  image_url: string;
};

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "ebooks"));

    const allBooks = snapshot.docs.map(
      (doc: QueryDocumentSnapshot) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Ebook & { id: string })
    );

    const shuffled = allBooks.sort(() => 0.5 - Math.random());
    const randomTen = shuffled.slice(0, 10);

    return NextResponse.json(randomTen);
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
