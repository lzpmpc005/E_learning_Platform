"use client";

import axios from "@/utils/axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (isPublished) {
        await axios.patch(
          `/courses/${courseId}/chapters/${chapterId}/unpublish`,
          { userId }
        );
        router.push(`/teacher/courses/${courseId}`);
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(
          `/courses/${courseId}/chapters/${chapterId}/publish`,
          { userId }
        );
        router.push(`/teacher/courses/${courseId}`);
        toast.success("Chapter published");
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;

        toast.error(axiosError.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      await axios.delete(`/courses/${courseId}/chapters/${chapterId}`, {
        data: { userId },
      });

      toast.success("Chapter deleted");

      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;

        toast.error(axiosError.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
