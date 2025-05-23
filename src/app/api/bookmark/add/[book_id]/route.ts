import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../app/admin/firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST(
  req: NextRequest,
  { params }: { params: { book_id: string } }
) {
  try {
    const rawBookId = params.book_id;
    const body = await req.json();
    const { userId } = body;

    if (!userId || !rawBookId) {
      return NextResponse.json({ message: "Missing userId or bookId" }, { status: 400 });
    }

    // ✅ แปลง book_id เป็น number ถ้าเป็นตัวเลขล้วน มิฉะนั้นคงไว้เป็น string
    const book_id = /^\d+$/.test(rawBookId) ? Number(rawBookId) : rawBookId;

    const bookmarkRef = doc(db, 'bookmarks', userId);
    const userBookmarkDoc = await getDoc(bookmarkRef);

    if (!userBookmarkDoc.exists()) {
      await setDoc(bookmarkRef, { book_ids: [book_id] });
    } else {
      const currentBookIds = userBookmarkDoc.data()?.book_ids || [];
      if (!currentBookIds.includes(book_id)) {
        currentBookIds.push(book_id);
        await setDoc(bookmarkRef, { book_ids: currentBookIds });
      }
    }

    return NextResponse.json({ message: "Bookmark added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
