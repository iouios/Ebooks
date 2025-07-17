import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const logsRef = db.collection("token_log").doc(id).collection("logs");
    const snapshot = await logsRef.get();

    const logs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?._seconds
          ? data.timestamp._seconds * 1000
          : null, 
      };
    });

    return NextResponse.json({ message: "Logs retrieved successfully", logs });
  } catch (error) {
    console.error("🔥 Error retrieving logs:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
