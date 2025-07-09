import { db } from "../../../admin/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const docRef = doc(db, "authors", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
