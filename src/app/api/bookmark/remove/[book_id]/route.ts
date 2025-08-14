import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../app/admin/firebase/firebaseConfig';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';

interface RouteContext {
  params: Promise<{ book_id: string }>;
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { book_id: rawBookId } = await context.params;
    const body = await req.json();
    const { userId } = body;

    // แปลง book_id เป็น number ถ้าเป็นตัวเลขล้วน
    const book_id = /^\d+$/.test(rawBookId) ? Number(rawBookId) : rawBookId;

    console.log(`Received DELETE request to remove bookmark for user: ${userId}, book_id: ${book_id}`);

    if (!userId || !book_id) {
      console.error("Missing userId or bookId");
      return NextResponse.json({ message: "Missing userId or bookId" }, { status: 400 });
    }

    const bookmarkRef = doc(db, 'bookmarks', userId);
    const bookmarkDoc = await getDoc(bookmarkRef);

    if (!bookmarkDoc.exists()) {
      console.error("Bookmark data not found for user:", userId);
      return NextResponse.json({ message: "Bookmark data not found for user" }, { status: 404 });
    }

    console.log("Found bookmark data, removing book_id from array");

    await updateDoc(bookmarkRef, {
      book_ids: arrayRemove(book_id)
    });

    console.log(`Bookmark removed for user ${userId}, book_id: ${book_id}`);

    return NextResponse.json({ message: "Bookmark removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
