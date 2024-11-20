"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentProps, GetQueryProps } from "@/lib/types";
import { GetUser } from "@/actions/AuthActions";
import { DateTimeSince } from "@/lib/DateTime";

interface CommentListProps {
  comments: CommentProps[] | null;
  deleteCommentById: (id: number) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  deleteCommentById,
}) => {
  const [commentUsers, setCommentUsers] = useState<{
    [key: number]: GetQueryProps;
  }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      if (comments) {
        const userMap: { [key: number]: GetQueryProps } = {};

        for (const comment of comments) {
          if (comment.UserId) {
            const user = await GetUser(comment.UserId);
            if (user) {
              userMap[comment.UserId] = user;
            }
          }
        }

        setCommentUsers(userMap);
      }
    };

    fetchUsers();
  }, [comments]);

  if (!comments || comments.length === 0) {
    return <p>No comments yet</p>;
  }

  return (
    <section className="flex flex-col gap-9 w-full items-start">
      {comments.map((comment) => {
        var timeSince = "";
        if (comment.CreatedAt) {
          timeSince = DateTimeSince(comment.CreatedAt);
        }

        const commentUser = comment.UserId
          ? commentUsers[comment.UserId]
          : null;

        return (
          <div
            key={comment.ID}
            className="flex w-full justify-between px-5 gap-6 items-center"
          >
            <div className="flex items-start gap-6 flex-1 pr-5">
              <Link href={`/users/${commentUser?.ID}`}>
                <div className="flex gap-2 items-start cursor-pointer">
                  <Avatar className="w-16 h-16 bg-slate-600">
                    <AvatarImage src={commentUser?.Profile} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </Link>
              <div className="flex flex-col gap-2 items-start">
                <div className="flex gap-2 items-end">
                  <Link href={`/users/${commentUser?.ID}`}>
                    <h1 className="text-xl text-black font-semibold">
                      {commentUser?.username}
                    </h1>
                  </Link>
                  <span className="text-base font-normal">{timeSince}</span>
                </div>
                <p className="text-base text-[#1d1e18ff]">{comment.Content}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="px-1 py-2 text-black">
                  <BsThreeDotsVertical size={"16"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    if (comment.ID) {
                      deleteCommentById(comment.ID);
                    }
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </section>
  );
};

export default CommentList;
