import fs from "fs";
import path from "path";
import axios from "axios";
import { NextResponse } from "next/server";

// Define the download directory inside public
const downloadDirectory = path.resolve(process.cwd(), "public", "ebooks");

// Ensure the directory exists
if (!fs.existsSync(downloadDirectory)) {
  fs.mkdirSync(downloadDirectory, { recursive: true });
}

// API route function for handling GET requests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing or invalid URL parameter" }, { status: 400 });
    }

    const targetUrl = decodeURIComponent(url);
    const originalFileName = path.basename(targetUrl);
    const newFileName = originalFileName.split(".")[0] + ".epub";
    const filePath = path.join(downloadDirectory, newFileName);

    // Check if file already exists
    if (!fs.existsSync(filePath)) {
      console.log("Downloading file from:", targetUrl);

      // Download the file
      const response = await axios.get(targetUrl, { responseType: "arraybuffer" });

      // Save the file
      fs.writeFileSync(filePath, response.data);
    } else {
      console.log("File already exists:", newFileName);
    }

    // Return the public URL of the saved file
    return NextResponse.json({ filePath: `/ebooks/${newFileName}` });
  } catch (error) {
    console.error("Failed to fetch and save file:", error);
    return NextResponse.json({ error: "Failed to fetch and save file" }, { status: 500 });
  }
}
