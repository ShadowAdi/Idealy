"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useAuth } from "@/components/providers/context-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateUser } from "@/actions/AuthActions";
import { Toast } from "@/components/shared/Toast";
import axios from "axios";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Email is required" }),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  profile: z.string().optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, { message: "Platform name is required" }),
        url: z.string().url({ message: "Please enter a valid URL" }),
      })
    )
    .optional(),
});
const ProfileUpdate = () => {
  const { user, loading, setUser } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      location: "",
      profile: "",
      socialLinks: [{ platform: "", url: "" }],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        profile: user.profile,
        socialLinks: user.social_links || [{ platform: "", url: "" }],
      });
    }
  }, [user, form]);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted");
    console.log(values);
    const response = await UpdateUser(values);
    if (response?.message) {
      Toast(response.message); // Pass the message to your toast function
    } else {
      Toast("An error occurred while updating the user."); // Display error message
    }
    setUser(null);
    window.location.href = "/profile";
  }

  if (!user) {
    window.location.href = `/profile`;
  }



  const handleImageUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trackey"); // Replace with your Cloudinary upload preset

    try {
      axios
        .post(
          `https://api.cloudinary.com/v1_1/shadowaditya/image/upload`,
          formData
        )
        .then((response) => {
          const imageUrl = response.data.secure_url;
          form.setValue("profile", imageUrl);
          Toast("Image uploaded successfully!");
        })
        .catch((error) => {
          console.error("Image upload failed:", error);
          Toast("Image upload failed.");
        });
    } catch (error) {
      console.error("Image upload failed:", error);
      Toast("Image upload failed.");
    }
  };
  if (!loading && user) {
    return (
      <div className="px-3 md:px-9 flex flex-col w-[95%] md:w-[60%] my-5  mx-auto rounded-md border-[#dadada] border-2 py-6">
        <h1 className="text-lg sm:text-2xl font-bold text-black text-center">
          Update
        </h1>

        <div className="flex flex-col gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              method="post"
              className="space-y-8 flex flex-col items-center justify-center"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder={"shadcn"} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="a@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public Email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-black">
                      Upload your Profile Photo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public Location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="bio" {...field} />
                    </FormControl>
                    <FormDescription>This is your Bio.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-5  w-full">
                <div className="flex flex-col gap-1">
                  <FormLabel>Social Links</FormLabel>
                  <FormDescription>
                    Add your social links with the platform name and URL.
                  </FormDescription>
                </div>
                <div className="flex gap-2 flex-col my-3 items-start w-full  ">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex  flex-1 flex-col gap-3 w-full  items-center"
                    >
                      <div className="flex gap-3 sm:flex-row flex-col  items-center w-full  justify-between">
                        <FormField
                          control={form.control}
                          name={`socialLinks.${index}.platform`}
                          render={({ field }) => (
                            <FormControl className="flex-[0.4] px-3 py-2">
                              <Input placeholder="Platform Name" {...field} />
                            </FormControl>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`socialLinks.${index}.url`}
                          render={({ field }) => (
                            <FormControl className="flex-[0.4] px-3 py-2">
                              <Input
                                placeholder="https://example.com"
                                {...field}
                              />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 w-full flex-[0.2] px-3 py-2"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add new social link button */}
                  <Button
                    type="button"
                    className="w-full mt-3"
                    onClick={() => append({ platform: "", url: "" })}
                  >
                    Add Social Link
                  </Button>
                </div>
              </div>

              <div className="flex w-full  justify-between px-1 sm:px-4 items-center">
                <Button
                  className="sm:w-[30%]  rounded-full px-4 py-4 bg-[#e4572eff]
                   hover:bg-[#e66b46] font-medium duration-500  text-white"
                  type="submit" // Change to "button" instead of "submit"
                >
                  <span className="text-base sm:text-xl font-bold">Submit</span>
                </Button>
                <Link href={"/profile"}>
                  <Button
                    className="px-5  bg-[#f5f5f5] border-2 shadow-md
                     shadow-[#e4572eff] border-[#e4572eff]  rounded-full  py-4
                       font-medium duration-500  text-black"
                    variant={"link"}
                  >
                    <span className="text-base sm:text-xl font-bold">
                      Cancel
                    </span>
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-9 flex flex-col h-full w-[90%] md:w-[60%] my-5  mx-auto rounded-md border-[#dadada] border-2 py-6">
      <h1 className="text-2xl font-bold text-black text-center">Update</h1>
      <Skeleton className="w-full mt-5 h-2/3 px-5 py-4 min-h-[300px]" />
    </div>
  );

  // Manage dynamic fields
};

export default ProfileUpdate;
