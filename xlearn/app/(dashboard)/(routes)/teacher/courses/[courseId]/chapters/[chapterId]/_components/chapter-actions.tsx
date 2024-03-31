"use client";

import axios from "@/utils/axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Chapter } from "../page";
import { on } from "events";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  onChapterUpdate: (chapter: Chapter) => void;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
  onChapterUpdate,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishedState, setIsPublishedState] = useState(isPublished);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (isPublishedState) {
        const res = await axios.patch(
          `/courses/${courseId}/chapters/${chapterId}/unpublish`,
          { userId }
        );
        setIsPublishedState(res.data.isPublished);
        onChapterUpdate(res.data);
        toast.success("Chapter unpublished");
      } else {
        const res = await axios.patch(
          `/courses/${courseId}/chapters/${chapterId}/publish`,
          { userId }
        );
        setIsPublishedState(res.data.isPublished);
        onChapterUpdate(res.data);
        toast.success("Chapter published");
      }
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
        {isPublishedState ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
