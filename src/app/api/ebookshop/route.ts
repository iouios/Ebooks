import { db } from "../../admin/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

const PAGE_SIZE = 20;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const snapshot = await getDocs(collection(db, "ebooks"));
    const allBooks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const count = allBooks.length;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const paginatedBooks = allBooks.slice(start, end);

    const next =
      end < count ? `/api/ebookshop?page=${page + 1}` : null;
    const previous =
      page > 1 ? `/api/ebookshop?page=${page - 1}` : null;

    return NextResponse.json({
      count,
      next,
      previous,
      results: paginatedBooks,
    });
  } catch (error) {
    console.error("Firestore error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
