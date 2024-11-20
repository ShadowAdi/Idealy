"use client";
import React, { useEffect, useState } from "react";
import "./Update.css";
import { FaAngleLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { GetQueryProps, UserProps } from "@/lib/types";
import { useParams } from "next/navigation";
import { GetUser } from "@/actions/AuthActions";
import { useAuth } from "@/components/providers/context-provider";
import { FollowUser, UnFollowUser } from "@/actions/StartupActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/shared/Toast";

const UserPage = () => {
  const [fetchUser, setFetchUser] = useState<GetQueryProps | null>(null);
  const { user, loading } = useAuth();
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersList, setFollowersList] = useState<GetQueryProps[] | null>(
    null
  );
  const [followingList, setFollowingList] = useState<GetQueryProps[] | null>(
    null
  );

  const FetchQueryUser = (
    profileId: number,
    currentUserId: number | undefined
  ) => {
    try {
      GetUser(profileId)
        .then((response) => {
          if (response) {
            setFetchUser(response);

            // Check if current user is following this profile
            if (currentUserId && response.Followers) {
              const isUserFollowing =
                response.Followers.includes(currentUserId);
              setIsFollowing(isUserFollowing);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const toggleFollow = () => {
    if (!fetchUser?.ID || !user?.id) {
      Toast("You are Not Logged In");
      return;
    }

    try {
      if (isFollowing) {
        UnFollowUser(fetchUser.ID);
        setIsFollowing(false);
      } else {
        FollowUser(fetchUser.ID);
        setIsFollowing(true);
      }
      // Refetch user data
      FetchQueryUser(fetchUser.ID, user.id);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const fetchFollowers = () => {
    if (fetchUser?.Followers && fetchUser.Followers.length > 0) {
      try {
        Promise.all(
          fetchUser.Followers.map((followerId) => GetUser(followerId))
        )
          .then((followerResponse) => {
            const validFollowers = followerResponse.filter(
              (response): response is GetQueryProps => response !== null
            );
            setFollowersList(validFollowers);
          })
          .catch((error) => {
            console.error("Error fetching followers:", error);
          });
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    }
  };
  const fetchFollowings = () => {
    if (fetchUser?.Following && fetchUser.Following.length > 0) {
      try {
        Promise.all(
          fetchUser.Following.map((followingId) => GetUser(followingId))
        )
          .then((followingResponse) => {
            const validFollowings = followingResponse.filter(
              Boolean
            ) as GetQueryProps[];
            setFollowingList(validFollowings);
          })
          .catch((error) => {
            console.error("Error fetching followings:", error);
          });
      } catch (error) {
        console.error("Error fetching followings:", error);
      }
    }
  };

  useEffect(() => {
    // Safely convert and pass IDs
    const profileId = Number(id);
    const currentUserId = user?.id ? Number(user.id) : undefined;

    if (!isNaN(profileId)) {
      FetchQueryUser(profileId, currentUserId);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (fetchUser) {
      fetchFollowers();
      fetchFollowings();
    }
  }, [fetchUser]);

  if (!loading && !user) {
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div
        className="px-5 md:px-7 h-full flex  py-4  flex-col w-[90%] md:w-[80%] my-3  
      mx-auto rounded-md border-[#dadada] border-2  "
      >
        <section className="flex justify-between items-center h-full  w-full px-3 py-4 gap-4">
          <Skeleton className=" w-1/2 h-full    min-h-[300px] rounded-lg" />
          <Skeleton className=" w-1/2 h-full flex-1    min-h-[300px] rounded-lg" />
        </section>
      </div>
    );
  }

  // Rest of the component remains the same
  return (
    <div
      className="px-2 lg:px-7 h-full flex py-2  flex-col w-[95%] lg:w-[80%] my-3 
     mx-auto rounded-md border-[#dadada] border-2  "
    >
      <section
        className="flex  justify-between lg:flex-row flex-col items-center h-full  
      w-full  py-1 "
      >
        <div
          className="flex   w-full px-0 lg:px-2 lg:w-1/2 flex-1 flex-col justify-start h-full
         items-start gap-12 "
        >
          <Link href={"/home"} className="flex gap-1 items-center">
            <FaAngleLeft className="text-base font-normal" size={"18"} />
            <span className="text-[#1d1e18ff]   cursor-pointer text-base md:text-lg font-bold">
              Back
            </span>
          </Link>
          <div className="flex flex-col gap-2 lg:gap-5 justify-start   items-center w-full">
            <div className="flex w-full flex-col  gap-2">
              <h1 className="text-2xl md:text-4xl capitalize font-bold text-center text-[#1d1e18ff] ">
                {fetchUser?.username}
              </h1>
              <h2 className="text-base md:text-xl font-semibold  text-center text-[#1b1b1b]">
                {fetchUser?.Email}
              </h2>
            </div>
            {fetchUser?.bio && (
              <div className="w-full py-0 lg:py-4">
                <p className="text-left text-[#2c2c2c]">{fetchUser?.bio}</p>
              </div>
            )}
            {fetchUser?.Location && (
              <div className="w-full flex gap-3">
                <span className="text-xl font-bold">Location:</span>
                <span className="text-xl">{fetchUser?.Location}</span>
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <Link href={`/users/${id}/startups`}>
                <Button
                  className="lg:px-9 lg:py-5 px5 py-3 rounded-full text-white
              hover:text-[#e4572eff] bg-[#e4572eff] hover:bg-white duration-500"
                >
                  <span className="text-base lg:text-xl font-semibold">
                    Startups
                  </span>
                </Button>
              </Link>
              {!loading && user?.email === fetchUser?.Email ? (
                <Link href={"/users/update"}>
                  <Button
                    className="lg:px-9 lg:py-5 px5 py-3 rounded-full bg-[#1d1e18ff] text-white
               duration-500"
                  >
                    <span className="text-base lg:text-xl font-semibold">
                      Update
                    </span>
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={toggleFollow}
                  className={`lg:px-9 lg:py-5 px5 py-3 rounded-full ${
                    isFollowing
                      ? "bg-[#e4572eff] hover:bg-red-500"
                      : "bg-[#1d1e18ff] hover:bg-green-500"
                  } text-white duration-500`}
                >
                  <span className="text-base lg:text-xl font-semibold">
                    {isFollowing ? "Unfollow" : "Follow"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div
          className="flex-1 mt-6   w-full  xl:w-1/2 gap-6 lg:gap-12 flex flex-col h-full 
        items-center  lg:items-center justify-center"
        >
          <div
            className={`boxSmall lg:boxShadow  w-[95%] xl:w-[70%]   rounded-2xl relative`}
          >
            <Image
              src="/ImageProfile.jpg"
              width={600}
              height={800}
              alt="No Image"
              className="object-cover w-full h-full max-h-[300px] cursor-pointer rounded-2xl"
            />
          </div>
          <div className="flex w-full md:w-[80%] mx-auto py-3 justify-between items-center px-5">
            <Dialog>
              <DialogTrigger>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl font-bold  text-[#e4572eff]">
                    {fetchUser?.Followers ? fetchUser?.Followers.length : 0}
                  </span>
                  <span className="text-base font-bold  text-[#ee964bff]">
                    Followers
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-[#f8f4f9ff]">
                <DialogHeader className="flex flex-col gap-3">
                  <DialogTitle>Followers List</DialogTitle>
                  <hr className="border-t mb-4 border-black w-full" />
                  {followersList && followersList.length > 0 ? (
                    followersList?.map((followerL, i) => {
                      return (
                        <div
                          key={i}
                          className="flex mt-8 gap-3 items-center w-full justify-between"
                        >
                          <Link href={`/users/${followerL.ID}`}>
                            <div className="flex gap-3 items-center flex-1">
                              <Avatar className="w-14 h-14   bg-slate-600">
                                <AvatarImage src={followerL?.Profile} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col items-start">
                                <span className="text-lg font-semibold ">
                                  {followerL.username}
                                </span>
                                <span className="text-xs font-normal">
                                  {followerL.Email}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500">
                      No followers yet
                    </p>
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl font-bold text-[#e4572eff]">
                    {fetchUser?.Following ? fetchUser?.Following.length : 0}
                  </span>
                  <span className="text-base font-bold text-[#ee964bff]">
                    Following
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-[#f8f4f9ff]">
                <DialogHeader className="flex flex-col gap-3">
                  <DialogTitle>Followings List</DialogTitle>
                  <hr className="border-t mb-4 border-black w-full" />
                  {followingList && followingList.length > 0 ? (
                    followingList?.map((followingL, i) => {
                      return (
                        <div
                          key={i}
                          className="flex mt-8 gap-3 items-center w-full justify-between"
                        >
                          <Link href={`/users/${followingL.ID}`}>
                            <div className="flex gap-3 items-center flex-1">
                              <Avatar className="w-14 h-14   bg-slate-600">
                                <AvatarImage src={followingL?.Profile} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col items-start">
                                <span className="text-lg font-semibold ">
                                  {followingL.username}
                                </span>
                                <span className="text-xs font-normal">
                                  {followingL.Email}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <p>No Following Found</p>
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>

          
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserPage;
