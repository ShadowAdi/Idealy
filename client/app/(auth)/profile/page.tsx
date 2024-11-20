"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./Update.css";
import { FaAngleLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/context-provider";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="px-5 md:px-7 h-full flex  py-4  flex-col w-[90%] md:w-[80%] my-3  mx-auto rounded-md border-[#dadada] border-2  ">
        <section className="flex justify-between items-center h-full  w-full px-3 py-4 gap-4">
          <Skeleton className=" w-1/2 h-full    min-h-[300px] rounded-lg" />
          <Skeleton className=" w-1/2 h-full flex-1    min-h-[300px] rounded-lg" />
        </section>
      </div>
    );
  }
  return (
    <div className="px-2 lg:px-7 h-full flex py-2  flex-col w-[95%] lg:w-[80%] my-3  mx-auto rounded-md border-[#dadada] border-2  ">
      <section className="flex  justify-between lg:flex-row flex-col items-center h-full  w-full  py-1 ">
        <div className="flex   w-full px-0 lg:px-2 lg:w-1/2 flex-1 flex-col justify-start h-full items-start gap-12 ">
          <Link href={"/home"} className="flex gap-1 items-center">
            <FaAngleLeft className="text-base font-normal" size={"18"} />
            <span className="text-[#1d1e18ff]   cursor-pointer text-base md:text-lg font-bold">
              Back
            </span>
          </Link>
          <div className="flex flex-col gap-2 lg:gap-5 justify-start   items-center w-full">
            <div className="flex w-full flex-col  gap-2">
              <h1 className="text-2xl md:text-4xl capitalize font-bold text-center text-[#1d1e18ff] ">
                {user?.username}
              </h1>
              <h2 className="text-base md:text-xl font-semibold  text-center text-[#1b1b1b]">
                {user?.email}
              </h2>
            </div>
            {user?.bio && (
              <div className="w-full py-0 lg:py-4">
                <p className="text-left text-[#2c2c2c]">{user?.bio}</p>
              </div>
            )}
            {user?.social_links && user?.social_links?.length > 0
              ? user?.social_links.map((val, i) => {
                  return (
                    <div
                      key={i}
                      className="w-full xl:flex-row flex-col  flex-wrap py-2 flex gap-x-3   justify-center  items-center"
                    >
                      <div className=" justify-center flex-1 lg:justify-start flex gap-1 items-center cursor-pointer lg:flex-1 ">
                        <Link
                          href={val.url}
                          target="_blank"
                          className="text-base hover:underline md:text-lg text-[#e4572eff]"
                        >
                          {val.platform}
                        </Link>
                      </div>
                    </div>
                  );
                })
              : null}

            {user?.location && (
              <div className="w-full flex gap-3">
                <span className="text-xl font-bold">Location:</span>
                <span className="text-xl">{user?.location}</span>
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <Link href={"/profile/startups"}>
                <Button
                  className="lg:px-9 lg:py-5 px5 py-3 rounded-full text-white
                hover:text-[#e4572eff] bg-[#e4572eff] hover:bg-white duration-500"
                >
                  <span className="text-base lg:text-xl font-semibold">
                    Startups
                  </span>
                </Button>
              </Link>
              <Link href={"/profile/update"}>
                <Button
                  className="lg:px-9 lg:py-5 px5 py-3 rounded-full bg-[#1d1e18ff] text-white
                 duration-500"
                >
                  <span className="text-base lg:text-xl font-semibold">
                    Update
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 mt-6   w-full  xl:w-1/2 gap-6 lg:gap-12 flex flex-col h-full items-center  lg:items-center justify-center">
          <div
            className={`boxSmall lg:boxShadow  w-[95%] xl:w-[70%]   rounded-2xl relative`}
          >
            <Image
              src={user?.profile || "/ImageProfile.jpg"}
              width={600}
              height={800}
              alt="No Image"
              className="object-cover w-full h-full max-h-[300px] cursor-pointer rounded-2xl"
            />
          </div>
          <div className="flex w-full md:w-[80%] mx-auto py-3 justify-between items-center px-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold  text-[#e4572eff]">
                {user?.followers ? user?.followers.length : 0}
              </span>
              <span className="text-base font-bold  text-[#ee964bff]">
                Followers
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-[#e4572eff]">
                {user?.following ? user?.following.length : 0}
              </span>
              <span className="text-base font-bold text-[#ee964bff]">
                Followers
              </span>
            </div>{" "}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
