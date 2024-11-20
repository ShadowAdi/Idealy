"use client";
import SarchBar from "@/components/shared/SarchBar";
import React, { useEffect, useState } from "react";
import BoxCard from "@/components/shared/BoxCard";
import { StartupProps } from "@/lib/types";
import { useAuth } from "@/components/providers/context-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GetAllStartups } from "@/actions/StartupActions";
import { Skeleton } from "@/components/ui/skeleton";

const HomeDashboard = () => {
  const [startups, setStartups] = useState<StartupProps[]>([]); // Initialize as an empty array
  const { user, loading } = useAuth();

  const fetchStartups = () => {
    try {
      GetAllStartups({ categoryName: "", startupName: "" })
        .then((data) => {
          if (Array.isArray(data)) {
            setStartups(data);
          } else {
            setStartups([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching startups:", error);
          setStartups([]); // Set empty array in case of error
        });
    } catch (error) {
      console.error("Error fetching startups:", error);
      setStartups([]); // Set empty array in case of error
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full gap-8 items-center justify-center">
        <Skeleton className="w-full h-10" />
        <div
          className="mt-3 w-full gap-4 mx-auto grid lg:grid-cols-3 
        sm:grid-cols-2 grid-cols-1 items-center px-4 py-8"
        >
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-8 items-center justify-center">
      {user && <SarchBar setStartups={setStartups} />}
      <div
        className="mt-3 w-full gap-4 mx-auto grid lg:grid-cols-3 
        sm:grid-cols-2 grid-cols-1 items-center px-4 py-8"
      >
        {Array.isArray(startups) && startups.length > 0
          ? startups.map((startup, i) => <BoxCard startup={startup} key={i} />)
          : null}
      </div>
      {startups.length === 0 && user ? (
        <div className="flex h-2/3 flex-col gap-6 my-auto items-center justify-center py-6 px-4 w-2/3">
          <h2 className="text-3xl font-bold">Create Ideas</h2>
          <Link href={"/startup/create"}>
            <Button
              className="text-[#e4572eff] border-2 text-xl border-[#e4572eff] 
              rounded-full px-8 py-5 bg-[#f8f4f9ff]"
              variant={"link"}
            >
              Create
            </Button>
          </Link>
        </div>
      ) : null}
      {!user && startups.length === 0 ? (
        <div className="flex h-2/3 flex-col items-center justify-center gap-6 my-auto py-6 px-4 w-2/3">
          <h2 className="text-3xl font-bold">Login to your Account</h2>
          <Link href={"/login"}>
            <Button
              className="text-[#e4572eff] rounded-full px-8 py-5 text-xl bg-[#f8f4f9ff] 
              border-2 border-[#e4572eff]"
              variant={"link"}
            >
              Login
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default HomeDashboard;
