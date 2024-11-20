
import { Toast } from "@/components/shared/Toast";
import { GetQueryProps, LoginProps, UserProps } from "@/lib/types";
import axios from "axios";
const URL = "http://127.0.0.1:8080/api/";

interface UserData {
  user: UserProps; // Specify the actual type of user data if known, e.g., User type.
  // Ideas: StartupProps[] | null; // Specify the actual type of Ideas if known, e.g., Idea type.
}

export const RegisterUser = async (data: UserProps) => {
  console.log(process.env.URL);
  try {
    await axios
      .post(`${URL}register`, data)
      .then((res) => {
        Toast(res.data?.message);
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

export const LoginUser = async (data: LoginProps) => {
  await axios
    .post(`${URL}login`, data)
    .then((res) => {
      var token = res.data?.token;
      localStorage.setItem("token", token);
      Toast("Login Successfull");
      window.location.href = "/home";
    })
    .catch((err) => {
      console.log(err);
    });
};

export const VerifyUser = async (): Promise<UserData | void> => {
  const TOKEN = localStorage.getItem("token");
  if (TOKEN) {
    try {
      const res = await axios.get(`${URL}verify`, {
        headers: {
          Authorization: TOKEN,
        },
      });
      return {
        user: res.data?.Data,
      };
    } catch (err) {
      console.log(err);
      return;
    }
  } else {
    Toast("Token is not present");
  }
};

export const GetLogoutUser = async () => {
  await axios
    .get(`${URL}logout`)
    .then((res) => {
      console.log(res.data?.message);
      localStorage.removeItem("token");
      Toast(res.data?.message);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const UpdateUser = async (
  data: UserProps
): Promise<{ message: string } | void> => {
  try {
    const TOKEN = localStorage.getItem("token");
    const res = await axios.put(`${URL}auth/update`, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    window.location.href = "/profile";
    return { message: res.data?.message };
  } catch (error) {
    console.log(error);
  }
};

export const GetUsers = async (): Promise<UserData[] | void> => {
  try {
    const response = await axios.get(`${URL}users`);
    return response.data?.data as UserData[];
  } catch (error) {
    console.log(error);
  }
};

export const GetUser = async (id: number): Promise<GetQueryProps | void> => {
  try {
    const response = await axios.get(`${URL}users/${id}`);
    return response.data?.data as GetQueryProps;
  } catch (error) {
    console.log(error);
  }
};
