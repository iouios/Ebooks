"use client";
import React, { useEffect, useState } from "react";
import StarRating from "./starRating";
import styled from "styled-components";
import AverageRating from "../../components/client/averageRating";


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
        .map((comments) => (
          <div
            key={comments.id}
            style={{ borderBottom: "1px solid #ddd", marginBottom: 8 }}
          >
            <FlexComment>
              <strong>{comments.email}</strong>
              {comments.uid === userId && (
                <div>
                  {onEditComment && (
                    <Button onClick={() => onEditComment(comments)}>
                      Edit
                    </Button>
                  )}
                  {onDeleteComment && (
                    <Button onClick={() => onDeleteComment(comments.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </FlexComment>
            <Flex>
              <div>
                <StarRating value={comments.rating} readOnly />
              </div>
              <Time>
                <small>{formatTimestamp(comments.createdAt)}</small>
              </Time>
            </Flex>
            <p>{comments.text}</p>
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
`;

const Flex = styled.div`
  display: flex;
`;

const Time = styled.div`
  margin-top: 4px;
  margin-left: 12px;
`;

export default CommentList;
