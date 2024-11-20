"use client";
import React, { useState } from "react";
import { CommentProps, GetQueryProps } from "@/lib/types";
import { useAuth } from "@/components/providers/context-provider";
import { DeleteCommentById } from "@/actions/CommentAction";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentComponentProps {
  initialComments: CommentProps[] | null;
  startupId:number;
}

const Comment: React.FC<CommentComponentProps> = ({ initialComments ,startupId}) => {
  const [comments, setComments] = useState<CommentProps[] | null>(
    initialComments
  );
  const { user, loading } = useAuth();


  const deleteCommentById = async (id: number) => {
    await DeleteCommentById(id);
    // Refresh comments after deletion
    if (comments) {
      const updatedComments = comments.filter((comment) => comment.ID !== id);
      setComments(updatedComments);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="w-full mt-10 py-4 flex flex-col justify-between gap-3 items-center">
      <div className="flex justify-between flex-1 w-full items-center">
        <h1 className="text-2xl font-bold">Comments</h1>
        <span className="text-base font-semibold">
          {comments?.length || 0} Comments
        </span>
      </div>
      <div className="flex flex-col gap-6 w-full px-3 py-5">
        <CommentList
          comments={comments}
          deleteCommentById={deleteCommentById}
        />
        {user && user.id && (
          <CommentForm
            startupId={startupId}
            userId={user.id}
            setComments={setComments}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
