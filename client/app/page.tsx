'use client'
import { useAuth } from "@/components/providers/context-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  if (user) {
    window.location.href="/home"
  }
  if (loading) {
    return (
      <div className="flex w-full py-4  min-h-[88vh]">
        <Skeleton className="w-full h-2/3" />
        <Skeleton className="w-full h-1/3" />
      </div>
    );
  }
  return (
    <div className="flex flex-col py-4 px-6 items-center justify-center min-h-[88vh] w-full  ">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl sm:text-5xl text-center font-bold text-[#e4572eff]">
          Idealy: Share Your Vision, Spark Innovation.
        </h1>
        <p className="text-black text-xs sm:text-base w-full sm:w-[60%] mx-auto text-center ">
          At Idealy, we empower aspiring entrepreneurs by providing a space to
          showcase, explore, and collaborate on startup ideas.
        </p>
        <div className="mt-3 flex gap-6 items-center justify-center">
          {user?.email ? (
            <Link href={"/home"}>
              <Button
                variant={"default"}
                className="bg-[#e4572eff] hover:bg-[#f36e45] shadow-2xl 
              text-xl sm:text-3xl font-bold px-9 py-8 rounded-full  text-white cursor-pointer duration-500  hover:text-[#f8f4f9ff] "
              >
                Share your Ideas
              </Button>
            </Link>
          ) : (
            <Link href={"/"}>
              <Button
                variant={"default"}
                className="bg-[#e4572eff] hover:bg-[#f36e45] shadow-2xl 
            text-xl sm:text-3xl font-bold px-9 py-8 rounded-full  text-white cursor-pointer duration-500  hover:text-[#f8f4f9ff] "
              >
                Share your Ideas
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
