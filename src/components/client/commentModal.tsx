"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StarRating from "./starRating";

interface Comment {
  id: string;
  uid: string;
  displayName: string;
  text: string;
  rating: number;
  email?: string;
  createdAt?: { seconds?: number; _seconds?: number };
}

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  bookId: string;
  uid?: string;
  email?: string;
  displayName?: string;
  commentToEdit?: Comment | null; 
  onCommentSaved?: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  bookId,
  uid,
  email,
  displayName,
  commentToEdit,
}) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (commentToEdit) {
      setText(commentToEdit.text);
      setRating(commentToEdit.rating);
    } else {
      setText("");
      setRating(0);
    }
  }, [commentToEdit]);

  if (!open) return null;

const handleSubmit = async () => {
  setLoading(true);

  try {
    if (commentToEdit) {
      const res = await fetch(`/api/commentEdit/${commentToEdit.id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, text, rating }),
      });

      if (!res.ok) throw new Error("แก้ไขคอมเมนต์ไม่สำเร็จ");
    } else {
      const res = await fetch(`/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email, bookId, displayName, text, rating }),
      });
      if (!res.ok) throw new Error("สร้างคอมเมนต์ไม่สำเร็จ");
    }
    
    setText("");
    setRating(0);
    onClose(); 
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Overlay>
      <ModalBox>
        <h2>{commentToEdit ? "แก้ไขคอมเมนต์" : "เขียนคอมเมนต์ใหม่"}</h2>
        <StarRating value={rating} onChange={setRating} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์คอมเมนต์..."
        />
        <ButtonRow>
          <button onClick={onClose} disabled={loading}>
             ปิด
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {loading ? "กำลังบันทึก..." : " ส่งคอมเมนต์"}
          </button>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
};

export default CommentModal;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: vertical;
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  button:first-child { background: #ccc; }
  button:last-child { background: var(--FONT_YELLOW) }
`;
