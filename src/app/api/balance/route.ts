import { db } from "../../admin/firebase/firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");

    if (!parentId) {
      return NextResponse.json({ message: "Missing parentId query parameter" }, { status: 400 });
    }

    const logsRef = collection(db, "token_log", parentId, "logs");

    const q = query(logsRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: "No logs found" }, { status: 404 });
    }

    const latestLog = querySnapshot.docs[0].data();

    if (latestLog.balance === undefined) {
      return NextResponse.json({ message: "Balance not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: latestLog.balance, logId: querySnapshot.docs[0].id });
  } catch (error) {
    console.error("Error in GET /api/balance:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
