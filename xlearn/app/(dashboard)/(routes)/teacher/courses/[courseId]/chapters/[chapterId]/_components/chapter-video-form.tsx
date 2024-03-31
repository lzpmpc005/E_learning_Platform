import * as z from "zod";
import axios from "@/utils/axios";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { FileUpload } from "@/components/common/file-upload";

import { Button } from "@/components/ui/button";

interface MuxData {
  id: string;
  assetId: string;
  playbackId?: string | null;
  chapterId: string;
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
  onChapterUpdate: (chapter: Chapter) => void;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
  onChapterUpdate,
}: ChapterVideoFormProps) => {
  const [muxData, setMuxData] = useState(initialData.muxData);
  const [chapter, setChapter] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const res = await axios.patch(
        `/courses/${courseId}/chapters/${chapterId}`,
        {
          ...values,
          userId,
        }
      );

      setChapter(res.data.chapter);
      onChapterUpdate(res.data.chapter);
      setMuxData(res.data.muxData);
      setTimeout(() => {
        setLoading(false);
      }, 3000);

      toast.success("Chapter updated");
      toggleEdit();
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

  return (
    <div className="mt-6 mb-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !chapter?.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Upload chapter video
            </>
          )}
          {!isEditing && chapter?.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Update video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        !loading &&
        (!chapter?.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {chapter?.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Please be patient. Refresh
          if video does not appear for a long time
        </div>
      )}
    </div>
  );
};
