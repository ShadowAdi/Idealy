"use client";
import { GetUser } from "@/actions/AuthActions";
import { GetStartupBasedUserId } from "@/actions/StartupActions";
import { useAuth } from "@/components/providers/context-provider";
import BoxCard from "@/components/shared/BoxCard";
import SarchBar from "@/components/shared/SarchBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GetQueryProps, StartupProps } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UsersStartup = () => {
  const [startups, setStartups] = useState<StartupProps[] | null>(null);
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [fetchUser, setFetchUser] = useState<GetQueryProps | null>(null);
  const fetchStartups = async () => {
    GetStartupBasedUserId(Number(id))
      .then((data) => {
        if (data) {
          setStartups(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const FetchQueryUser =  (profileId: number) => {
    try {
      // Ensure profileId is valid
      if (isNaN(profileId)) {
        console.error("Invalid profile ID");
        return;
      }

      GetUser(profileId)
        .then((response) => {
          if (response) {
            setFetchUser(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    fetchStartups();
    FetchQueryUser(Number(id));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col w-full items-start justify-normal py-7 h-[86vh] ">
        <Skeleton className="w-[400px] h-[150px] mx-auto" />

        <div className="mt-3 w-full gap-4 mx-auto grid lg:grid-cols-3 sm:grid-cols-2  grid-cols-1 items-center     px-4 py-8">
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
          <Skeleton className="w-[400px] h-[150px] mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-start justify-normal py-7 h-[86vh] ">
      <div className="flex flex-col gap-4 items-center justify-center w-[80%] mx-auto">
        <h1 className="block text-4xl mx-auto font-bold capitalize">
          {fetchUser?.username} Startups
        </h1>
      </div>

      <div className="mt-3 w-full gap-4 mx-auto grid lg:grid-cols-3 sm:grid-cols-2  grid-cols-1 items-center     px-4 py-8">
        {startups && startups?.length > 0
          ? startups.map((startup, i) => {
              return <BoxCard startup={startup} key={i} />;
            })
          : null}
      </div>
      {startups && startups.length === 0 && user ? (
        <div
          className="flex h-2/3 flex-col mx-auto  gap-6 my-auto items-center 
        justify-center py-6 px-4 w-2/3"
        >
          <h2 className="text-lg text-center sm:text-3xl font-bold capitalize ">
            {fetchUser?.username} Dont created any startups
          </h2>
          <Link href={"/startup/create"}>
            <Button
              className="text-[#e4572eff] border-2 text-xl border-[#e4572eff] rounded-full px-8 py-5 
               bg-[#f8f4f9ff]"
              variant={"link"}
            >
              Create
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className="flex h-2/3 flex-col items-center justify-center 
         gap-6 my-auto  py-6 px-4 w-full"
        >
          <h2 className="text-3xl font-bold ">Login to your Account</h2>
          <Link href={"/login"}>
            <Button
              className="text-[#e4572eff] rounded-full px-8 py-5  text-xl bg-[#f8f4f9ff]  border-2 border-[#e4572eff]"
              variant={"link"}
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UsersStartup;
