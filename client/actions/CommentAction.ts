import { Toast } from "@/components/shared/Toast";
import { CommentProps } from "@/lib/types";
import axios, { AxiosError } from "axios";

const URL = "http://127.0.0.1:8080/api/";

interface DeleteCommentResponse {
  message: string;
}

export const GetAllComments = async (
  id: number
): Promise<CommentProps[] | void> => {
  try {
    const response = await axios.get(`${URL}comment/GetAllComent/${id}`);
    return response.data?.data as CommentProps[];
  } catch (error) {
    console.log(error);
  }
};

export const PostComment = async (data: CommentProps, startupId: number) => {
  try {
    const TOKEN = localStorage.getItem("token");
    data.StartupId = startupId;
    const response = await axios.post(
      `${URL}comment/auth/createComment/${startupId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    Toast(response.data?.message);
  } catch (error) {
    console.log(error);
  }
};

export const DeleteCommentById = async (
  id: number
): Promise<DeleteCommentResponse | void> => {
  if (typeof window === "undefined") {
    throw new Error(
      "This function can only be executed in browser environment"
    );
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  var textId = id.toString();
  const url = `${URL}comment/auth/deleteComment/${textId}`;
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // Set timeout to 5 seconds (adjust as necessary)
    });
    Toast("Comment Deleted");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        throw new Error(
          error.response.data?.message || "Failed to delete comment"
        );
      } else if (error.request) {
        // No response received
        throw new Error("No response received from server");
      }
    }
    throw new Error("Failed to delete comment");
  }
};

export const PutComment = async (
  id: number,
  data: CommentProps
): Promise<{ message: string } | void> => {
  const TOKEN = localStorage.getItem("token");
  const response = await axios.put(`${URL}comment/updateComment/${id}`, data, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return { message: response.data?.message as string };
};
