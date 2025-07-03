import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../admin/firebase/firebaseConfig";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const bookRef = doc(db, "ebooks", id);
    const docSnap = await getDoc(bookRef);

    if (!docSnap.exists()) {
      await setDoc(bookRef, { downloads: 1 });
    } else {
      const currentDownloads = docSnap.data()?.downloads || 0;
      await updateDoc(bookRef, { downloads: currentDownloads + 1 });
    }

    return NextResponse.json({ message: "Download count updated" });
  } catch (error) {
    console.error("Error updating download count:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
