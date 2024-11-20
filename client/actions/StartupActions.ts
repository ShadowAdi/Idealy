import { Toast } from "@/components/shared/Toast";
import { StartupProps } from "@/lib/types";
import axios from "axios";
const URL = "http://127.0.0.1:8080/api/";

export const GetAllStartups = async (filters?: {
  startupName?: string;
  categoryName?: string;
  sortBy?: string;
}): Promise<StartupProps[] | void> => {
  try {
    const res = await axios.get(`${URL}startup/GetAllStartup`, {
      params: {
        startupName: filters?.startupName,
        categoryName: filters?.categoryName,
        sortBy: filters?.sortBy,
      }, // Single field for search
    });
    return res.data?.data as StartupProps[];
  } catch (error) {
    console.log(error);
  }
};

export const GetStartup = async (id: number): Promise<StartupProps | void> => {
  try {
    const res = await axios.get(`${URL}startup/GetStartup/${id}`);
    return res.data?.data as StartupProps;
  } catch (error) {
    window.location.href = "/home";
    console.log(error);
  }
};

export const GetStartupBasedUserId = async (
  userId: number
): Promise<StartupProps[] | void> => {
  const response = await axios.get(`${URL}startup/GetStartupUser/${userId}`);
  return response.data?.data as StartupProps[];
};

export const CreateStartup = async (
  data: StartupProps
): Promise<StartupProps | void> => {
  try {
    if (typeof window !== "undefined") {
      const TOKEN = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.post(
        `${URL}startup/auth/createStartup`,
        data,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`, // Add token for authentication
          },
        }
      );
      Toast("Startup created successfully");
      window.location.href = "/home";
      return response.data?.data as StartupProps;
    }
  } catch (error) {
    console.error("Error creating startup:", error);
  }
};

export const UpdatedStartupById = async (data: StartupProps, id: number) => {
  try {
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) throw new Error("Authentication token missing");

    const response = await axios.put(
      `${URL}startup/auth/updateStartup/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    window.location.href = `/startup/${id}`;

    return response.data;
  } catch (error: any) {
    // Handle network errors or API errors
    const errorMessage = error.response?.data?.message || "An error occurred";
    console.error("Error updating startup:", errorMessage);
    throw error;
  }
};

export const LikeStartup = async (id: number): Promise<void> => {
  try {
    const TOKEN = localStorage.getItem("token"); // Get token from localStorage
    if (TOKEN) {
      await axios.put(`${URL}startup/auth/likeStartup/${id}`, null, {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // Add token for authentication
        },
      });
      Toast("Liked the Startup");
    } else {
      Toast("Token does not exist");
    }
  } catch (error) {
    Toast("Error in Liking the Startup");
    console.error("Error liking startup:", error);
  }
};

export const DisLikeStartup = async (id: number) => {
  try {
    const TOKEN = localStorage.getItem("token"); // Get token from localStorage
    if (TOKEN) {
      axios
        .put(`${URL}startup/auth/dislikeStartup/${id}`, null, {
          headers: {
            Authorization: `Bearer ${TOKEN}`, // Add token for authentication
          },
        })
        .then(() => {
          Toast("DisLiked the Startup");
        })
        .catch((err) => {
          Toast("Error disliking");
          console.error("Error disliking startup:", err);
        });
    } else {
      Toast("Token Not Found");
    }
  } catch (error) {
    Toast("Error disliking");
    console.error("Error disliking startup:", error);
  }
};

export const DeleteStartup = (id: number) => {
  try {
    const TOKEN = localStorage.getItem("token"); // Get token from localStorage
    if (TOKEN) {
      axios
        .delete(`${URL}startup/auth/deleteStartup/${id}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`, // Add token for authentication
          },
          timeout: 10000,
        })
        .then((response) => {
          if (response.status === 200) {
            Toast("Delete the Startup");
            window.location.href = "/home";
          }
        })
        .catch((err) => {
          Toast("Ereor in deleting the startup");
          console.error("Error deleting startup:", err);
        });
    } else {
      Toast("Ereor in getting the token");
    }
  } catch (error) {
    Toast("Error in deleting the startup");
    console.error("Error deleting startup:", error);
  }
};

export const FollowUser = (target_id: number) => {
  try {
    const TOKEN = localStorage.getItem("token"); // Get token from localStorage
    if (TOKEN) {
      axios
        .put(`${URL}auth/follow/${target_id}`, null, {
          headers: {
            Authorization: `Bearer ${TOKEN}`, // Add token for authentication
          },
          timeout: 10000,
        })
        .then(() => {
          Toast("Follow the user");
          window.location.href = `/users/${target_id}`;
        })
        .catch((err) => {
          Toast("Getting error in Following the user");
          console.log(err);
        });
    } else {
      Toast("Token Not Found");
      console.error("Token Not Found");
    }
  } catch (error) {
    Toast("Error following user");
    console.error("Error following user:", error);
  }
};

export const UnFollowUser = (target_id: number) => {
  try {
    const TOKEN = localStorage.getItem("token"); // Get token from localStorage
    if (TOKEN) {
      axios
        .put(`${URL}auth/unfollow/${target_id}`, null, {
          headers: {
            Authorization: `Bearer ${TOKEN}`, // Add token for authentication
          },
          timeout: 10000,
        })
        .then(() => {
          Toast("UnFollow the user");
          window.location.href = `/users/${target_id}`;
        })
        .catch((err) => {
          Toast("Error Unfollowing user");
          console.error("Error Unfollowing user:", err);
        });
    } else {
      Toast("Token Not Found");
      console.error("Token Not Found");
    }
  } catch (error) {
    console.error("Error Unfollowing user:", error);
  }
};

export const ViewStartup = (startup_id: number) => {
  try {
    const TOKEN = localStorage.getItem("token"); // Get token from localStorage
    if (TOKEN) {
      axios.get(`${URL}startup/auth/viewStartup/${startup_id}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // Add token for authentication
        },
        timeout: 10000,
      });
    }
  } catch (error) {
    console.error("Error following user:", error);
  }
};
