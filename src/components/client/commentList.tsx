"use client";
import React, { useEffect, useState } from "react";
import StarRating from "./starRating";
import styled from "styled-components";
import AverageRating from "../../components/client/averageRating";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Comment {
  id: string;
  uid: string;
  displayName: string;
  email?: string;
  text: string;
  rating: number;
  createdAt?: { seconds?: number; _seconds?: number };
}

interface CommentListProps {
  bookId: string;
  userId?: string;
  onEditComment?: (comment: Comment) => void;
  onDeleteComment?: (id: string) => void;
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({
  bookId,
  userId,
  onEditComment,
  onDeleteComment,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?bookId=${bookId}`);
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [bookId]);

  const formatTimestamp = (ts?: Comment["createdAt"]) => {
    if (!ts) return "";
    const seconds = ts.seconds ?? ts._seconds;
    if (!seconds) return "";
    return new Date(seconds * 1000).toLocaleString();
  };

  return (
    <div>
      <AverageRating comments={comments} />
      {comments
        .sort(
          (a, b) =>
            (b.createdAt?._seconds ?? b.createdAt?.seconds ?? 0) -
            (a.createdAt?._seconds ?? a.createdAt?.seconds ?? 0)
        )
        .map((comment) => (
          <div
            key={comment.id}
            style={{ borderBottom: "1px solid #ddd", marginBottom: 8 }}
          >
            <FlexComment>
              <strong>{comment.email}</strong>
              {comment.uid === userId && (
                <div>
                  {onEditComment && (
                    <Button onClick={() => onEditComment(comment)}>
                      <EditIcon fontSize="small" />
                    </Button>
                  )}
                  {onDeleteComment && (
                    <Button onClick={() => onDeleteComment(comment.id)}>
                      <DeleteIcon fontSize="small" /> 
                    </Button>
                  )}
                </div>
              )}
            </FlexComment>
            <Flex>
              <div>
                <StarRating value={comment.rating} readOnly />
              </div>
              <Time>
                <small>{formatTimestamp(comment.createdAt)}</small>
              </Time>
            </Flex>
            <p>{comment.text}</p>
          </div>
        ))}
    </div>
  );
};

const FlexComment = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  @media (min-width: 500px) {
    display: flex;
  }
`;

const Button = styled.button`
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  background: #fff;
  cursor: pointer;
  gap: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const Time = styled.div`
  margin-top: 4px;
  margin-left: 12px;
`;

export default CommentList;
