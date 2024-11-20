import { CommentProps, GetQueryProps, RefreshStartupDataParams, StartupProps } from "@/lib/types";
import {
  DisLikeStartup,
  GetStartup,
  LikeStartup,
  ViewStartup,
} from "./StartupActions";
import { GetUser } from "./AuthActions";
import { GetAllComments } from "./CommentAction";

// Utility function to fetch startup data with async/await
export const fetchStartupData = async (
  id: number,
  setStartupData: (data: StartupProps | null) => void,
  setStartupUser: (data: GetQueryProps | null) => void
) => {
  if (!id) return;

  try {
    const data = await GetStartup(Number(id));
    if (data?.user_id) {
      setStartupData(data);
      try {
        const userData = await GetUser(data.user_id);
        if (userData) {
          setStartupUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setStartupUser(null);
      }
    }
  } catch (error) {
    console.error("Error fetching startup data:", error);
    setStartupData(null);
    setStartupUser(null);
  }
};

// Handle startup view
export const handleStartupView = async (
  startupId: number,
  setStartupData: (data: StartupProps | null) => void,
  setStartupUser: (data: GetQueryProps | null) => void
) => {
  try {
    await ViewStartup(startupId);
    // After logging view, fetch updated data
    await fetchStartupData(startupId, setStartupData, setStartupUser);
  } catch (error) {
    console.error("Error logging startup view:", error);
  }
};

// Fetch comments
export const fetchComments = async ({
  id,
  setComments,
}: {
  id: number;
  setComments: (comments: CommentProps[] | null) => void;
}) => {
  try {
    const data = await GetAllComments(id);
    if (data) {
      setComments(data);
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
};

// Handle Like/Dislike with async/await
export const handleLikeDislike = async (
  action: "like" | "dislike",
  isUpdating: boolean,
  id: number,
  setIsUpdating: (isUpdating: boolean) => void,
  setStartupData: (startupData: StartupProps | null) => void,
  setStartupUser: (startupUser: GetQueryProps | null) => void
) => {
  if (!id || isUpdating) return;

  setIsUpdating(true);
  try {
    if (action === "like") {
      await LikeStartup(Number(id));
    } else {
      await DisLikeStartup(Number(id));
    }
    await refreshStartupData({ id, setStartupData, setStartupUser });
  } catch (error) {
    console.error(`Error ${action}ing startup:`, error);
  } finally {
    setIsUpdating(false);
  }
};

// Refresh startup data after like/dislike
export const refreshStartupData = async ({
  id,
  setStartupData,
  setStartupUser,
}: RefreshStartupDataParams) => {
  if (id) {
    await fetchStartupData(id, setStartupData, setStartupUser);
  }
};
