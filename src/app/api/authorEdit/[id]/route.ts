import { db } from "../../../admin/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();

    const docRef = doc(db, "authors", id);
    await updateDoc(docRef, {
      name: body.name,           
      birth_year: body.birth_year,
    });

    return NextResponse.json({ message: "Author updated successfully" });
  } catch (error) {
    console.error("🔥 Error in PUT:", error);
    return NextResponse.json({ message: "Failed to update author" }, { status: 500 });
  }
}
