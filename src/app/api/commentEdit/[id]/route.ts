import { NextResponse } from "next/server";
import { db, FieldValue } from "../../../admin/firebase/firebaseAdmin";

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: Request,
  context: RouteContext
)  {
  const params = await context.params;
  const { id } = params;
  const { uid, text, rating } = await request.json();

  if (!uid || !text) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const docRef = db.collection("comments").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

    if (docSnap.data()?.uid !== uid) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await docRef.update({
      text,
      rating,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Comment updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
