"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
import { RegisterUser } from "@/actions/AuthActions";
import axios from "axios";
import { Toast } from "@/components/shared/Toast";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(3, { message: "Password is required" }),
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

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      bio: "",
      location: "",
      socialLinks: [{ platform: "", url: "" }], // start with one empty field
      profile: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    RegisterUser(values);
  }

  // Manage dynamic fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

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

  return (
    <div className="px-3 md:px-9 flex flex-col w-[95%] md:w-[60%] 
    my-5  mx-auto rounded-md border-[#dadada] border-2 py-6">
      <h1 className="text-2xl font-bold text-black text-center">Register</h1>

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
                    <Input placeholder="shadcn" {...field} />
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
                  <FormDescription>This is your public Email.</FormDescription>
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
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="****" {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    This is your public Password.
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
                    <div className="flex gap-3 sm:flex-row flex-col  items-center w-full justify-between">
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

            <Button
              className="w-[50%] md:w-[30%] md:min-w-[160px] rounded-full px-2 py-6 mx-auto bg-[#e4572eff] font-medium duration-500 hover:bg-white hover:text-[#e4572eff]"
              type="submit" // Change to "button" instead of "submit"
            >
              <span className="text-xl font-bold">Submit</span>
            </Button>
          </form>
        </Form>
        <h1 className="text-base text-black text-center mt-4 mb-3">
          Already Have an Account?{" "}
          <Link className="underline text-[#e4572eff]" href={"/login"}>
            Login
          </Link>
          .
        </h1>
      </div>
    </div>
  );
};

export default RegisterPage;
