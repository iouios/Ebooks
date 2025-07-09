import { db } from "../../admin/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, birth_year } = body;

    if (!name || !birth_year) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await addDoc(collection(db, "authors"), {
      name,
      birth_year,
    });

    return NextResponse.json({ message: "Author added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding author:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
