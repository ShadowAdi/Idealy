import { GetStartup } from "@/actions/StartupActions";
import {
  GetQueryProps,
  RefreshStartupDataParams,
  StartupProps,
} from "@/lib/types";
import React from "react";
import { FaThumbsUp, FaThumbsDown, FaEye } from "react-icons/fa";

type LikeDislikeButtonsProps = {
  startupData: StartupProps | null;
  id: number;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  LikeStartup: (id: number) => Promise<void>;
  DisLikeStartup: (id: number) => Promise<void>;
  setStartupData: (startupData: StartupProps | null) => void;
  setStartupUser: (startupUser: GetQueryProps | null) => void;
};

const LikeDislikeButtons: React.FC<LikeDislikeButtonsProps> = ({
  startupData,
  id,
  isUpdating,
  setIsUpdating,
  LikeStartup,
  DisLikeStartup,
  setStartupData,
  setStartupUser,
}) => {
  const handleLikeDislike = async (
    action: "like" | "dislike",
    isUpdating: boolean,
    id: number
  ) => {
    if (!id || isUpdating) return;
    setIsUpdating(true);
    try {
      if (action === "like") {
        LikeStartup(Number(id));
        const startupData = await GetStartup(id);
        if (startupData) {
          setStartupData(startupData);
        }
      } else {
        DisLikeStartup(Number(id));
        const startupData = await GetStartup(id);
        if (startupData) {
          setStartupData(startupData);
        }

      }
    } catch (error) {
      console.error(`Error ${action}ing startup:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex justify-start gap-3 flex-1 items-center">
      <div
        onClick={() => handleLikeDislike("like", isUpdating, Number(id))}
        className={`flex items-end bg-[#e4572eff] hover:bg-[#be5b3d] px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white sm:gap-3 justify-end cursor-pointer ${
          isUpdating ? "opacity-50" : ""
        }`}
      >
        <FaThumbsUp size={"20"} className="sm:block hidden" />
        <span className="text-xs sm:text-sm">
          {startupData?.likes?.length} Likes
        </span>
      </div>
      <div
        onClick={() => handleLikeDislike("dislike", isUpdating, Number(id))}
        className={`flex items-end bg-[#ee964bff] hover:bg-[#e4934d] px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white sm:gap-3 justify-end cursor-pointer ${
          isUpdating ? "opacity-50" : ""
        }`}
      >
        <FaThumbsDown size={"20"} className="sm:block hidden" />
        <span className="text-xs sm:text-sm">
          {startupData?.dislikes?.length} Dislikes
        </span>
      </div>
      <div className="flex items-end bg-[#e6c035] hover:bg-[#e9c546] px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white sm:gap-3 justify-end">
        <FaEye size={"20"} className="sm:block hidden" />
        <span className="text-xs sm:text-sm">{startupData?.views} Views</span>
      </div>
    </div>
  );
};

export default LikeDislikeButtons;
