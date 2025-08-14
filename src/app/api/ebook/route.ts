import { NextRequest, NextResponse } from "next/server";
import { saveEbook, EbookData } from "../admins/ebooks";

export async function POST(req: NextRequest) {
  try {
    const body: EbookData = await req.json();
    const result = await saveEbook(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /ebook:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
