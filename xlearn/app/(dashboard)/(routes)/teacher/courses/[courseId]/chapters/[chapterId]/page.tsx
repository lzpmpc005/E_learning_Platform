"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { IconBadge } from "@/components/common/icon-badge";
import { Banner } from "@/components/common/banner";
import axios from "@/utils/axios";

import { ChapterTitleForm } from "./_components/chapter-title-form";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";

export interface Chapter {
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

const ChapterIdPage = ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [completionText, setCompletionText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    const userId = window.localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`/courses/${params.courseId}/chapters/${params.chapterId}`)
        .then((res) => {
          setChapter(res.data);
          handleChapterUpdate(res.data);
        })
        .catch((err) => {
          console.error(err);
          redirect("/");
        });
    } else {
      redirect("/");
    }
  }, []);

  const handleChapterUpdate = (updatedChapter: Chapter) => {
    setChapter(updatedChapter);

    const requiredFields = updatedChapter
      ? [
          updatedChapter.title,
          updatedChapter.description,
          updatedChapter.videoUrl,
        ]
      : [];
    const completedFields = requiredFields.filter(Boolean).length;

    const totalFields = requiredFields.length;
    const newCompletionText = `(${completedFields}/${totalFields})`;
    const newIsComplete = requiredFields.every(Boolean);

    setCompletionText(newCompletionText);
    setIsComplete(newIsComplete);
  };

  return (
    <>
      {chapter && !chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              {chapter && (
                <ChapterActions
                  disabled={!isComplete}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                  isPublished={chapter.isPublished}
                  onChapterUpdate={handleChapterUpdate}
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              {chapter && (
                <ChapterTitleForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              )}
              {chapter &&
                (chapter.description || chapter.description === null) && (
                  <ChapterDescriptionForm
                    initialData={chapter}
                    courseId={params.courseId}
                    chapterId={params.chapterId}
                    onChapterUpdate={handleChapterUpdate}
                  />
                )}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              {chapter && (
                <ChapterAccessForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            {chapter && (
              <ChapterVideoForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
                onChapterUpdate={handleChapterUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
