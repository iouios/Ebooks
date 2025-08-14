import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>; // ต้องเป็น Promise ตาม type ของ Next.js
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params; // await ต้องตรงนี้

  if (!id) {
    return NextResponse.json({ message: "ID not provided" }, { status: 400 });
  }

  try {
    const userDoc = await db.collection("users").doc(id).get();

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
