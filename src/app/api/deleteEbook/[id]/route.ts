import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "ID not provided" }, { status: 400 });
  }

  try {
    const docRef = db.collection("ebooks").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ message: "Ebook not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "Ebook deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting ebook:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
