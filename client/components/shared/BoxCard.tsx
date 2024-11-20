import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { StartupProps } from "@/lib/types";
import { Badge } from "../ui/badge";
const BoxCard = ({ startup }: { startup: StartupProps }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex w-full justify-between items-center ">
          <span className="text-xl font-semibold">{startup?.name}</span>
          <Badge className="px-4 py-2 text-sm cursor-pointer hover:bg-[#e4572eff] rounded-full bg-[#e4572eff]">
            {startup.category?.Name}
          </Badge>
        </CardTitle>
        {startup?.user?.username && (
          <CardDescription className="text-base">
            {startup.user.username}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {/* Render HTML content safely */}
        <div
          className="truncate"
          dangerouslySetInnerHTML={{ __html: startup.pitch || "" }}
        />
      </CardContent>
      <CardFooter className="flex gap-2 flex-col w-full">
        <Link href={`/startup/${startup?.ID}`} className="w-[80%] mx-auto">
          <Button
            className=" hover:text-[#f8f4f9ff] bg-[#e4572eff]
           hover:bg-[#dd603a] w-full py-5  text-lg  font-semibold rounded-full  text-white "
          >
            Detail
          </Button>
        </Link>
        <div className="flex justify-between w-full mt-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-base font-semibold text-[#e4572eff]">
              {startup.likes?.length}
            </span>
            <span className="text-base font-semibold ">Likes</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-base font-semibold text-[#e4572eff]">
              {startup.views}
            </span>
            <span className="text-base font-semibold ">Views</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BoxCard;
