"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { LoginUser } from "@/actions/AuthActions";

const formSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(3, { message: "Password is required" }),
});
const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    LoginUser(values);
  }

  return (
    <div className="px-5 md:px-9 flex flex-col w-[90%] md:w-[60%] my-5  mx-auto rounded-md border-[#dadada] border-2 py-6">
      <h1 className="text-2xl font-bold text-black text-center">Login</h1>
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center justify-center"
          >
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

            <Button
              className="w-[30%] min-w-[160px] rounded-full px-2 py-6 mx-auto bg-[#e4572eff] font-medium duration-500 hover:bg-white hover:text-[#e4572eff]"
              type="submit" // Change to "button" instead of "submit"
            >
              <span className="text-xl font-bold">Submit</span>
            </Button>
          </form>
        </Form>
      </div>
      <h1 className="text-base text-black text-center mt-4 mb-3">
        Don{"'"}t Have an Account?{" "}
        <Link className="underline text-[#e4572eff]" href={"/register"}>
          Register
        </Link>
        .
      </h1>
    </div>
  );
};

export default LoginPage;
