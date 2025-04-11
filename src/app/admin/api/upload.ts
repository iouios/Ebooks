import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { uploadFile } from '../supabase/upload';  // นำเข้าฟังก์ชัน uploadFile

// ปิดการใช้งาน bodyParser ของ Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form', error: err });
    }

    // ตรวจสอบว่า 'attachment' ใน files มีค่าหรือไม่
    const file = files.attachment ? files.attachment[0] : null;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // สร้าง FormData ใหม่
    const formData = new FormData();
    formData.append('attachment', file);  // เพิ่มไฟล์ไปใน FormData

    // ใช้ฟังก์ชัน uploadFile เพื่ออัพโหลดไฟล์ไปยัง Supabase
    const success = await uploadFile(formData);

    if (success) {
      return res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      return res.status(500).json({ message: 'Error uploading file' });
    }
  });
};

export default uploadHandler;
