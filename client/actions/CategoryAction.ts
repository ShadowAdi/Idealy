import { CategoryProps } from "@/lib/types";
import axios from "axios";
const URL = "http://127.0.0.1:8080/api/";
const TOKEN = localStorage.getItem("token");

export const GetAllCategory = async (): Promise<CategoryProps[] | void> => {
    try {
      const response = await axios.get(`${URL}category/GetAllCategory`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      console.log(response.data)
      return response.data?.data as CategoryProps[];
    } catch (error) {
      console.log(error);
    }
  };

export const CreateCategory = async (
  data: CategoryProps
): Promise<{ message: string } | void> => {
  try {
    const response = await axios.post(`${URL}category/createCategory`, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data?.message as { message: string };
  } catch (error) {
    console.log(error);
  }
};
