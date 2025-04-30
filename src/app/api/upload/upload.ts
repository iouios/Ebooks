import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import supabase from '../../../app/admin/supabase/supabaseClient';  // นำเข้า Supabase client
import { v4 as uuidv4 } from 'uuid';

// ปิดการใช้งาน bodyParser ของ Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// ฟังก์ชันสำหรับการ sanitize ชื่อไฟล์
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  
    .replace(/\s+/g, "_")             
    .replace(/[^\w.-]/gi, "");       
};

import fs from 'fs/promises'; // ด้านบนสุดของไฟล์

const uploadFiles = async (fileA: formidable.File, fileB: formidable.File) => {
  try {
    const bufferA = await fs.readFile(fileA.filepath);
    const sanitizedA = sanitizeFileName(fileA.originalFilename || '');
    const pathA = `${uuidv4()}-${sanitizedA}`;
    const { error: errorA } = await supabase.storage.from('ebooks').upload(pathA, bufferA);
    if (errorA) throw errorA;

    const { data: urlDataA } = supabase.storage.from('ebooks').getPublicUrl(pathA);

    const bufferB = await fs.readFile(fileB.filepath);
    const sanitizedB = sanitizeFileName(fileB.originalFilename || '');
    const pathB = `${uuidv4()}-${sanitizedB}`;
    const { error: errorB } = await supabase.storage.from('images').upload(pathB, bufferB);
    if (errorB) throw errorB;

    const { data: urlDataB } = supabase.storage.from('images').getPublicUrl(pathB);

    return {
      urlA: urlDataA.publicUrl,
      urlB: urlDataB.publicUrl,
    };
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
};


// ตัวจัดการการอัพโหลด
const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form', error: err });
    }

    // ตรวจสอบไฟล์ที่แนบมาทั้งสองไฟล์
    const fileA = files.attachmentA ? files.attachmentA[0] : null;
    const fileB = files.attachmentB ? files.attachmentB[0] : null;

    if (!fileA || !fileB) {
      return res.status(400).json({ message: 'Both files must be provided' });
    }

    try {
      // เรียกใช้ฟังก์ชัน uploadFiles เพื่ออัพโหลดไฟล์ไปยัง Supabase
      const { urlA, urlB } = await uploadFiles(fileA, fileB);
      return res.status(200).json({ message: 'Files uploaded successfully', urlA, urlB });
    } catch (err) {
      return res.status(500).json({ message: 'Error uploading files', error: err });
    }
  });
};

export default uploadHandler;
