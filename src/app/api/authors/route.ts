import { db } from "../../admin/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "authors"));

    const authors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(authors);
  } catch (error) {
    console.error("Firestore error:", error); 
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}