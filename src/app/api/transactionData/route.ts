import { db } from "../../admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
     const logsSnapshot = await db.collectionGroup('logs').get();
     console.log(logsSnapshot);
        const allLogs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      path: doc.ref.path, 
      ...doc.data(),
    }));

    return NextResponse.json({ token_log: allLogs });
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
