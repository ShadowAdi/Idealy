"use client";

import { z } from "zod";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import { CreateCategory, GetAllCategory } from "@/actions/CategoryAction";
import { Toast } from "./Toast";
import { CategoryProps } from "@/lib/types";

const formSchema = z.object({
  Name: z
    .string()
    .min(2, { message: "Not less than 2" })
    .max(50, { message: "Not more than 50" }),
  Description: z
    .string()
    .min(2, { message: "Not less than 2" })
    .max(500, { message: "Not more than 500" }),
});

const CategoryModal = ({
  setCategory,
}: {
  setCategory: (categories: CategoryProps[] | []) => void;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Description: "",
      Name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await CreateCategory(values);
    if (data) {
      Toast(data?.message);
      setOpen(false);
      GetAllCategory()
        .then((data) => {
          if (data) {
            setCategory(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Choose A Category</DialogTrigger>
      <DialogContent className="bg-[#f8f4f9ff]">
        <DialogHeader className="flex gap-4 flex-col items-start w-full">
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Category Cannot be deleted and updated so you sure you want to
            create One.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>This is your name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public Description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
