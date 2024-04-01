"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { ChaptersList } from "./chapters-list";
import { CourseType } from "@/utils/types";

interface Chapter {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChaptersFormProps {
  initialData: {
    chapters: Chapter[];
  };
  courseId: string;
  onCourseUpdate: (course: CourseType) => void;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({
  initialData,
  courseId,
  onCourseUpdate,
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [chapters, setChapters] = useState(initialData.chapters);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`/courses/${courseId}/chapters`, {
        ...values,
        userId,
      });
      setChapters((prevChapters) => {
        const newChapters = [...prevChapters, response.data.chapter];
        return newChapters;
      });
      onCourseUpdate(response.data.course);
      toast.success("Chapter created");
      toggleCreating();
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        if (axiosError.response) {
          toast.error(axiosError.response.data.error);
        } else if (axiosError.request) {
          toast.error("No response from server");
        } else {
          toast.error("Error setting up request");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      const userId = localStorage.getItem("userId");
      await axios.put(`/courses/${courseId}/chapters/reorder`, {
        list: updateData,
        userId: userId,
      });
      toast.success("Chapters reordered");
      fetchUpdatedData();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchUpdatedData = async () => {
    try {
      const response = await axios.get(`/courses/${courseId}/chapters`);
      setChapters(response.data);
    } catch (error) {
      toast.error("Failed to fetch updated data");
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !chapters.length && "text-slate-500 italic"
          )}
        >
          {!chapters.length && "No chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
