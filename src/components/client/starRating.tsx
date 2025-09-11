"use client";
import React from "react";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
};

const StarRating: React.FC<Props> = ({ value, onChange, readOnly }) => (
  <div style={{ display: "inline-flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <button
        key={i}
        type="button"
        onClick={() => !readOnly && onChange?.(i)}
        style={{
          background: "none",
          border: "none",
          cursor: readOnly ? "default" : "pointer",
          fontSize: 22,
        }}
      >
        {i <= value ? "★" : "☆"}
      </button>
    ))}
  </div>
);

export default StarRating;
