import React, { useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Toast } from "./Toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { DeleteStartup } from "@/actions/StartupActions";

const DeleteStartupButton = ({ id }: { id: number }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Toast("Authentication Error");
        return;
      }

      DeleteStartup(id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          Toast("Network Error");
        } else if (error.response?.status === 401) {
          Toast("Auth Error");
          router.push("/login");
        } else if (error.response?.status === 403) {
          Toast("You dont have permission");
        } else {
          Toast("An Error occured while deleting");
        }
      }
      console.error("Error deleting startup:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Badge
          className="bg-red-600 hover:bg-red-700 text-white sm:w-11 w-8 h-8 
          sm:h-11 cursor-pointer p-1 
                    flex items-center justify-center rounded-full"
        >
          <FaTrash size={20} className="text-lg" />
        </Badge>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#f8f4f9ff]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            startup and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStartupButton;
