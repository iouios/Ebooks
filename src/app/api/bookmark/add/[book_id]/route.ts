import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../app/admin/firebase/firebaseConfig'; 
import { doc, setDoc, getDoc } from 'firebase/firestore'; 

export async function POST(
  req: NextRequest,
  { params }: { params: { book_id: string } }
) {
  try {
    const { book_id } = params;
    const body = await req.json();
    const { userId } = body;

    const bookIdNumber = Number(book_id);

    if (isNaN(bookIdNumber)) {
      return NextResponse.json({ message: "Invalid book_id" }, { status: 400 });
    }

    if (!userId || isNaN(bookIdNumber)) {
      return NextResponse.json({ message: "Missing userId or invalid bookId" }, { status: 400 });
    }

    const bookmarkRef = doc(db, 'bookmarks', userId); 
    const userBookmarkDoc = await getDoc(bookmarkRef);

    if (!userBookmarkDoc.exists()) {
      await setDoc(bookmarkRef, { book_ids: [bookIdNumber] }); 
    } else {

      const currentBookIds = userBookmarkDoc.data()?.book_ids || [];
      if (!currentBookIds.includes(bookIdNumber)) {
        currentBookIds.push(bookIdNumber);
        await setDoc(bookmarkRef, { book_ids: currentBookIds }); 
      }
    }

    return NextResponse.json({ message: "Bookmark added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
