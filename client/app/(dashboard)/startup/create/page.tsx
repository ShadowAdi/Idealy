"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
import TipTapEditor from "@/components/shared/TipTapEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import CategoryModal from "@/components/shared/CategoryModal";
import { CategoryProps } from "@/lib/types";
import { GetAllCategory } from "@/actions/CategoryAction";
import { Toast } from "@/components/shared/Toast";
import { CreateStartup } from "@/actions/StartupActions";
import { useAuth } from "@/components/providers/context-provider";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  image_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean().optional().or(z.literal(false)),
  funding_stage: z.string().optional().or(z.literal("")),
  target_audience: z.string().optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, { message: "Platform name is required" }),
        url: z.string().url({ message: "Please enter a valid URL" }),
      })
    )
    .optional(),
});

const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};

const CreateStartupPage = () => {
  const [content, setContent] = useState<string>("");
  const [selectCategoryId, setSelectCategoryId] = useState<number | null>(0);
  const { user, loading } = useAuth();
  const isMounted = useIsMounted();
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image_url: "",
      is_active: false,
      funding_stage: "",
      target_audience: "",
      socialLinks: [{ platform: "", url: "" }],
    },
  });

  const fetchCategories = () => {
    GetAllCategory()
      .then((data) => {
        if (data) {
          setCategories(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (isMounted) {
      fetchCategories();
    }
  }, [isMounted]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectCategoryId || selectCategoryId === 0) {
      Toast("Choose a Category");
      return;
    }

    const startupData = {
      name: values.name,
      pitch: content,
      image_url: values.image_url || "",
      social_links: values.socialLinks || [],
      category_id: selectCategoryId,
      funding_stage: values.funding_stage || "",
      target_audience: values.target_audience || "",
      user_id: user?.id,
    };

    CreateStartup(startupData);
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const handleImageUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trackey");

    try {
      axios
        .post(
          `https://api.cloudinary.com/v1_1/shadowaditya/image/upload`,
          formData
        )
        .then((response) => {
          const imageUrl = response.data.secure_url;
          form.setValue("image_url", imageUrl);
          Toast("Image uploaded successfully!");
        })
        .catch((err) => {
          console.error("Image upload failed:", err);
          Toast("Image upload failed.");
        });
    } catch (error) {
      console.error("Image upload failed:", error);
      Toast("Image upload failed.");
    }
  };

  // Don't render anything on the server side
  if (!isMounted) {
    return null;
  }

  if (!user) {
    window.location.href = `/home`;
  }

  if (loading) {
    return (
      <div className="px-3 md:px-9 flex flex-col w-[90%] md:w-[60%] my-5  mx-auto rounded-md border-[#dadada] border-2 py-6">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    );
  }
  return (
    <div className="px-3 md:px-9 flex flex-col w-[90%] md:w-[60%] my-5  mx-auto rounded-md border-[#dadada] border-2 py-6">
      <h1 className="text-2xl font-bold text-black text-center">
        Create Startup
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 w-full">
              <FormLabel>Pitch</FormLabel>
              <TipTapEditor
                content={content}
                onChange={(newContent: string) =>
                  handleContentChange(newContent)
                }
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Image Startup</FormLabel>
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
                    Upload your Startup Image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="Teenage" {...field} />
                  </FormControl>
                  <FormDescription>
                    Audience you want to target.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="funding_stage"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Funding Stage</FormLabel>
                  <FormControl>
                    <Input placeholder="Seed" {...field} />
                  </FormControl>
                  <FormDescription>This is your Funding Stage.</FormDescription>
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
                    <div className="flex sm:flex-row flex-col gap-3 items-center w-full  justify-between">
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.platform`}
                        render={({ field }) => (
                          <FormControl className="flex-1 sm:flex-[0.4] px-3 py-2">
                            <Input placeholder="Platform Name" {...field} />
                          </FormControl>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.url`}
                        render={({ field }) => (
                          <FormControl className="flex-1 sm:flex-[0.4] px-3 py-2">
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
                        className="text-red-500 w-full flex-1 sm:flex-[0.2] px-3 py-2"
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
            <div className="flex flex-col gap-4 w-full">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category, i) => {
                      return (
                        <SelectItem
                          onClick={() => {
                            if (category?.ID) {
                              console.log(category.ID);
                              setSelectCategoryId(category?.ID);
                            }
                          }}
                          value={category.ID ? category.ID.toString() : "1"}
                          key={i}
                        >
                          {category.Name}
                        </SelectItem>
                      );
                    })}
                  <CategoryModal setCategory={setCategories} />
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full  justify-between px-4 items-center">
              <Button
                className="sm:w-[30%] rounded-full px-4 py-4 bg-[#e4572eff]
                 hover:bg-[#e66b46] font-medium duration-500  text-white"
                type="submit" // Change to "button" instead of "submit"
              >
                <span className="text-xl font-bold">Submit</span>
              </Button>
              <Link href={"/profile"}>
                <Button
                  className="  px-6 py-4 bg-[#f5f5f5] border-2 shadow-md
                   shadow-[#e4572eff] border-[#e4572eff]    font-medium duration-500
                     text-black"
                  variant={"link"}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateStartupPage;
