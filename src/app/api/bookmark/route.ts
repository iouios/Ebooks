import {NextResponse } from 'next/server';
import { db } from '../../../app/admin/firebase/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore'; 

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { userSub } = body;
  
      if (!userSub) {
        return NextResponse.json({ error: 'Missing userSub' }, { status: 400 });
      }
  
      // ดึง document ของ user นี้
      const userRef = doc(db, 'bookmarks', userSub);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        return NextResponse.json({ error: 'User not found'}, { status: 404 });
      }
  
      const data = userSnap.data();
  
      return NextResponse.json({
        auth0_id: userSub,
        book_ids: data.book_ids || [],
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
  }