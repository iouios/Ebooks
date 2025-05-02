import { db } from "../../admin/firebase/firebaseAdmin"; // Firebase Admin SDK
import { NextResponse } from "next/server";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";  // ใช้ QueryDocumentSnapshot สำหรับการจับข้อมูล

export async function GET() {
  try {

    const querySnapshot = await db.collection("ebooks").get();

    if (querySnapshot.empty) {
      console.error("🔥 No documents found in ebooks collection");
      return NextResponse.json({ message: "No documents found" }, { status: 404 });
    }

    const ebooks = querySnapshot.docs.map((doc: QueryDocumentSnapshot, index: number) => {
      const data = doc.data();
      console.log(`Document ${index}:`, data);
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
    return NextResponse.json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
