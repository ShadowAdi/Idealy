"use client";
import { useEffect, useState } from "react";
import { CommentProps, GetQueryProps, StartupProps } from "@/lib/types";
import { useAuth } from "@/components/providers/context-provider";
import {
  LikeStartup,
  DisLikeStartup,
  ViewStartup,
} from "@/actions/StartupActions";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MdEdit } from "react-icons/md";
import DeleteStartupButton from "@/components/shared/DeleteStartupButton";
import LikeDislikeButtons from "@/components/shared/LikeDislikeButtons";
import Comment from "@/components/shared/Comment";
import "./StartupCss.css";
interface StartupPageClientProps {
  initialStartupData: StartupProps | null;
  initialStartupUser: GetQueryProps | null;
  initialComments: CommentProps[] | null;
  startupId: number;
}

export default function StartupPageClient({
  initialStartupData,
  initialStartupUser,
  initialComments,
  startupId,
}: StartupPageClientProps) {
  const { user, loading } = useAuth();
  const [startupData, setStartupData] = useState(initialStartupData);
  const [startupUser, setStartupUser] = useState(initialStartupUser);
  const [comments, setComments] = useState(initialComments);
  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    ViewStartup(startupId);
  }, [startupId]);

  return (
    <div className="flex flex-col gap-4 px-1 sm:px-4 py-3 pb-7 w-full">
      {/* User Profile Section */}
      <section className="flex border-[#1d1e18ff] border-b justify-between w-full items-center py-2 myb-3">
        <Link href={`/users/${startupUser?.ID}`}>
          <div className="flex gap-2 items-center cursor-pointer">
            <Avatar className="sm:w-16 sm:h-16 w-12 h-12 bg-slate-600">
              <AvatarImage src={startupUser?.Profile} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <h1 className="text-base sm:text-xl text-black font-semibold">
                {startupUser?.username}
              </h1>
              <h1 className="text-sm sm:text-base text-[#1b1b1b] font-semibold">
                {startupUser?.Email}
              </h1>
            </div>
          </div>
        </Link>

        {/* Edit/Delete Controls */}
        <div className="flex flex-[0.6] justify-end gap-5 items-center">
          {startupUser?.Email === user?.email && startupData?.ID && (
            <>
              <DeleteStartupButton id={startupData?.ID} />
              <Link href={`${startupData?.ID}/updateStartup`}>
                <Badge
                  className="bg-green-600 hover:bg-green-700 text-white
                 sm:w-12 sm:h-12 w-8 j-8 cursor-pointer p-1 flex items-center justify-center rounded-full"
                >
                  <MdEdit size={"22"} className="text-lg" />
                </Badge>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Startup Image */}
      {startupData?.image_url && (
        <section className="w-full flex flex-col gap-2 my-1 sm:my-3">
          <div className="relative w-[95%] mx-auto sm:w-[85%] h-[300px] sm:h-[500px]">
            <Image
              src={startupData?.image_url || "/default.jpg"}
              className="w-full rounded-xl object-cover"
              //   width={300}
              layout="fill"
              //   height={300}
              alt="Startup Image"
            />
          </div>
        </section>
      )}

      {/* Startup Details */}
      <section className="w-full mt-6 px-0 sm:px-4 flex-col flex justify-between items-center gap-2 sm:gap-4">
        <div className="flex sm:flex-row flex-col border-[#1d1e18ff] py-2 border-b justify-between w-full items-start gap-4 sm:gap-1 sm:items-center">
          <h1 className="text-base sm:text-2xl font-semibold">
            {startupData?.name}
          </h1>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Badge
              variant="outline"
              className="CategoryTab text-[#f8f4f9ff] px-3 sm:px-6 py-2 rounded-full"
            >
              <span className="text-sm sm:text-lg font-bold">
                {startupData?.category?.Name}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="IsActive text-[#f8f4f9ff] px-2 sm:px-6 py-2 rounded-full"
            >
              <span className="text-xs sm:text-lg font-bold">
                {startupData?.is_active ? "Is Active" : "Not Active"}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="Funding text-[#f8f4f9ff] px-3 sm:px-6 py-2 rounded-full"
            >
              <span className="text-sm sm:text-lg font-bold">
                {startupData?.funding_stage}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="AgeGroup text-[#f8f4f9ff] px-3 sm:px-6 py-2 rounded-full"
            >
              <span className="text-sm sm:text-lg font-bold">
                {startupData?.target_audience}
              </span>
            </Badge>
          </div>
        </div>

        {/* Pitch Section */}
        {startupData?.pitch && (
          <div className="flex flex-col w-full items-start gap-6 mt-5">
            <h1 className="text-4xl block font-bold">Pitch</h1>
            <div
              dangerouslySetInnerHTML={{ __html: startupData.pitch }}
              className="text-base flex-1 text-center text-[#1d1e18ff]"
            />
          </div>
        )}
      </section>

      <div className="w-full mt-10 border-t py-1 pt-6 px-4 border-[#dadada] flex justify-between gap-3 items-center">
        {startupData && startupData.ID && (
          <LikeDislikeButtons
            startupData={startupData}
            id={startupData.ID}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            LikeStartup={LikeStartup}
            DisLikeStartup={DisLikeStartup}
            setStartupData={setStartupData}
            setStartupUser={setStartupUser}
          />
        )}
      </div>

      <Comment startupId={Number(startupId)} initialComments={comments} />
    </div>
  );
}
