"use client";
import React from "react";

interface Comment {
  id: string;
  uid: string;
  text: string;
  rating: number;
}

interface AverageRatingProps {
  comments: Comment[];
}

const AverageRating: React.FC<AverageRatingProps> = ({ comments }) => {
  if (!comments || comments.length === 0) return <p>No ratings yet</p>;

  const average =
    comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;

  const averageRounded = Math.round(average * 10) / 10;

  return (
    <div style={{ margin: "10px 0", fontWeight: "bold" }}>
      ⭐ Average Rating: {averageRounded} ({comments.length} reviews)
    </div>
  );
};

export default AverageRating;
