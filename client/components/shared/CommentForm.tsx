"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { PostComment } from "@/actions/CommentAction";
import { fetchComments } from "@/actions/StartupHandlers";
import { CommentProps } from "@/lib/types";
const formSchema = z.object({
  Content: z
    .string()
    .min(2, { message: "Must be more than 2" })
    .max(500, { message: "Must be more than 500" }),
});
const CommentForm = ({
  userId,
  startupId,
  setComments,
}: {
  startupId: number;
  userId: number;
  setComments: (comments: CommentProps[] | null) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Content: "", // Set initial content
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const ans = {
      Content: values.Content,
      user_id: userId,
      startup_id: startupId,
    };

    
    PostComment(ans, startupId);
    fetchComments({ id: startupId, setComments });
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="Content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Comment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CommentForm;
