import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../admin/firebase/firebaseAdmin";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const uid = request.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ message: "Missing uid" }, { status: 400 });
  }

  try {
    const docRef = db.collection("comments").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    if (docSnap.data()?.uid !== uid) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
