import { db } from "../../../admin/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: "Missing ebook ID" }, { status: 400 });
    }

    const docRef = doc(db, "ebooks", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: "Ebook not found" }, { status: 404 });
    }

    const data = docSnap.data();

    return NextResponse.json({
      id: docSnap.id,
      title: data.title,
      authors: data.authors,
      summaries: data.summaries,
      bookshelves: data.bookshelves,
      languages: data.languages,
      price: data.price,
      ebook_url: data.ebook_url,
      image_url: data.image_url,
    });
  } catch (error) {
    console.error("🔥 Error in API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();

    const docRef = doc(db, "ebooks", id);
    await updateDoc(docRef, {
      title: body.title,
      authors: body.authors,
      summaries: body.summaries,
      bookshelves: body.bookshelves,
      languages: body.languages,
      price: body.price,
      ebook_url: body.ebook_url,
      image_url: body.image_url,
    });

    return NextResponse.json({ message: "Ebook updated successfully" });
  } catch (error) {
    console.error("🔥 Error in PUT:", error);
    return NextResponse.json({ message: "Failed to update ebook" }, { status: 500 });
  }
}
