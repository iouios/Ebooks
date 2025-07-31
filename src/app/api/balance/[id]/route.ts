import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id: userId } = context.params;

  if (!userId) {
    return NextResponse.json({ message: "ID not provided" }, { status: 400 });
  }

  try {
    // อ่าน document ผู้ใช้
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const data = userDoc.data();

    if (data?.token === undefined) {
      return NextResponse.json({ message: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: data.token });
  } catch (error) {
    console.error("❌ Error fetching balance:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
