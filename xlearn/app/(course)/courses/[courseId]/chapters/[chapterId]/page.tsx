"use client";

import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/common/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/common/preview";
import { useEffect, useState } from "react";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import {
  Chapter,
  CourseType,
  MuxData,
  Attachment,
  UserProgress,
  Purchase,
} from "@/utils/types";

import { useSelector } from "react-redux";

const ChapterIdPage = ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const [data, setData] = useState<{
    chapter: Chapter | null;
    course: CourseType | null;
    muxData: MuxData | null;
    attachments: Attachment[];
    nextChapter: Chapter | null;
    userProgress: UserProgress | null;
    purchase: Purchase | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId") || "";
  const trigger = useSelector((state: any) => state.chapter.currentChapterId);

  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }
    getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    }).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, [params.chapterId, params.courseId, userId, trigger]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.chapter || !data.course) {
    window.location.href = "/";
    return null;
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = data;
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId || ""}
            isLocked={isLocked}
            userId={userId}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
                userId={userId}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment: Attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
