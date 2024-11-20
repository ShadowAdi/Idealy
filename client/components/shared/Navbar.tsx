"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "../providers/context-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import "./boxShadow.css";
import { GetLogoutUser } from "@/actions/AuthActions";
import { FaSpinner } from "react-icons/fa";

const Navbar = () => {
  const { user, loading, setUser } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const LogoutUser = () => {
    setUser(null);
    GetLogoutUser();
    window.location.href = "/";
  };

  useEffect(() => {
    if (!loading) {
      setLocalLoading(false); // Update local loading based on useAuth loading
    }
  }, [loading]);

  return (
    <nav className="flex w-full justify-between items-center  px-1 sm:px-4 py-4 border-b-[#dadada] border-b-2 ">
      <Link href={user?"/home":"/"}>
        <span className="text-xl sm:text-4xl font-bold text-[#e4572eff] ">
          Idealy
        </span>
      </Link>
      <div className="flex gap-3 items-center">
        {localLoading ? (
          <Badge>
            <FaSpinner className="animate-spin" size={"20"} />
          </Badge>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge
                variant={"outline"}
                className="cursor-pointer hover:bg-[#ee964bff] bg-[#ee964bff] text-[#f8f4f9ff] text-lg px-9 py-2 rounded-full"
              >
                Profile
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Hi, {user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link  href={"/profile"}>
                <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              </Link>
              <Link  href={"/profile/startups"}>
                <DropdownMenuItem className="cursor-pointer">Your startups</DropdownMenuItem>
              </Link>
              <Link  href={"/profile/update"}>
                <DropdownMenuItem className="cursor-pointer">Update Profile</DropdownMenuItem>
              </Link>
              <Link  href={"/startup/create"}>
                <DropdownMenuItem className="cursor-pointer">Create Startup</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer" onClick={LogoutUser}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href={"/login"}>
              <Button
                variant={"default"}
                className="px-8 bg-[#e4572eff] font-medium hover:bg-white hover:text-[#e4572eff] text-[18px] duration-500 rounded-full py-5 text-white"
              >
                Login
              </Button>
            </Link>
            <Link href={"/register"}>
              <Button
                variant={"outline"}
                className="px-8 hover:bg-[#e4572eff] duration-500 hover:text-white font-medium bg-white text-[18px] rounded-full py-5"
              >
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
