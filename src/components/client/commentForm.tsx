"use client";
import React, { useState } from "react";
import { db } from "../../app/admin/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import StarRating from "./starRating";

interface Props {
  bookId: string;
  uid?: string;
  displayName?: string;
  onPosted?: () => void;
}

const CommentForm: React.FC<Props> = ({ bookId, uid, displayName, onPosted }) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "comments"), {
      bookId,
      text: text.trim(),
      rating,
      uid: uid || null,
      displayName: displayName || "Anonymous",
      createdAt: serverTimestamp(),
    });

    setText("");
    setRating(5);
    onPosted?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="เขียนคอมเมนต์..."
        style={{ width: "100%", padding: 8 }}
      />
      <StarRating value={rating} onChange={setRating} />
      <button type="submit">โพสต์</button>
    </form>
  );
};

export default CommentForm;
