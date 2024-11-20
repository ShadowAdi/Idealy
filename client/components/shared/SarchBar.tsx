"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { FaSearch } from "react-icons/fa";
import "./boxShadow.css";
import { CategoryProps, StartupProps } from "@/lib/types";
import { GetAllStartups } from "@/actions/StartupActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetAllCategory } from "@/actions/CategoryAction";

// Define the form schema without Zod for simplicity
interface FormValues {
  searchText: string;
  categoryName: string;
}

type SearchBarProps = {
  setStartups: React.Dispatch<React.SetStateAction<StartupProps[]>>;
};

const SearchBar: React.FC<SearchBarProps> = ({ setStartups }) => {
  const [categories, setCategories] = useState<CategoryProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      searchText: "",
      categoryName: "all", // Default to "All" which corresponds to an empty string
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (values.searchText.trim()) {
        params.append("startupName", values.searchText.trim());
      }

      // Only append categoryName if it's not "all"
      if (values.categoryName && values.categoryName !== "all") {
        params.append("categoryName", values.categoryName);
      }

      const data = await GetAllStartups({
        startupName: values.searchText.trim(),
        categoryName: values.categoryName === "all" ? "" : values.categoryName,
      });

      if (data) {
        setStartups(data);
      } else {
        setStartups([]); // Set empty array if no results
        console.log("No startups found matching the criteria");
      }
    } catch (error) {
      console.error("Error fetching startups:", error);
      setStartups([]); // Reset on error
    } finally {
      setIsLoading(false);
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await GetAllCategory();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div
      className="flex px-4 py-3 w-[96%] sm:w-[80%] sm:boxShadow
     mx-auto rounded-sm sm:rounded-full border-[#e4572eff] border-2"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex-col sm:flex-row  flex gap-4 items-center justify-between"
        >
          <FormField
            control={form.control}
            name="searchText"
            render={({ field }) => (
              <FormItem className="w-full flex-1 sm:flex-[0.4]">
                <FormControl>
                  <input
                    className="outline-none w-full py-1 rounded-md px-3 bg-[#f8f4f9ff] border-b-2 border-[#dadada]"
                    placeholder="Type Name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryName"
            render={({ field }) => (
              <FormItem className="flex-1 w-full sm:flex-[0.4]">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={form.getValues("categoryName") || ""} // Ensures "All" is the default
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories?.map((category, i) => (
                      <SelectItem value={category.Name} key={i}>
                        {category.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="rounded-full shadow-md w-10 h-10 bg-[#e4572eff] duration-500 
            hover:bg-[#e4572eff] hover:text-[#e4572eff]"
            type="submit"
            disabled={isLoading}
          >
            <FaSearch className="text-white" size={24} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchBar;
