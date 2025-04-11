import supabase from '../supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  
    .replace(/\s+/g, "_")             
    .replace(/[^\w.-]/gi, "");       
};

export async function uploadFiles(fileA: File, fileB: File) {
  try {
    const sanitizedA = sanitizeFileName(fileA.name);
    const pathA = `${uuidv4()}-${sanitizedA}`;
    const { error: errorA } = await supabase.storage.from('ebooks').upload(pathA, fileA);
    if (errorA) throw errorA;

    const { data: urlDataA } = supabase.storage.from('ebooks').getPublicUrl(pathA);

    const sanitizedB = sanitizeFileName(fileB.name);
    const pathB = `${uuidv4()}-${sanitizedB}`;
    const { error: errorB } = await supabase.storage.from('images').upload(pathB, fileB);
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
}
