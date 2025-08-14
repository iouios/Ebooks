import { db } from "../../../admin/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>
}


export async function PUT(
  request: Request,
  context: RouteContext
)  {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    const docRef = doc(db, "authors", id);
    await updateDoc(docRef, {
      name: body.name,
      birth_year: body.birth_year,
    });

    return NextResponse.json({ message: "Author updated successfully" });
  } catch (error) {
    console.error("🔥 Error in PUT:", error);
    return NextResponse.json(
      { message: "Failed to update author" },
      { status: 500 }
    );
  }
}
