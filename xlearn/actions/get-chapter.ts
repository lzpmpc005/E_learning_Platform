import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { Attachment, Chapter } from "@/utils/types";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const { data: purchase } = await axios.get(
      `/purchases/user/${userId}/course/${courseId}`
    );
    const { data: course } = await axios.get(`/courses/${courseId}/price`);
    const { data: chapter } = await axios.get(
      `/chapters/${chapterId}/published`
    );
    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;
    let userProgress = null;

    if (purchase) {
      const attachmentsData = await axios.get(
        `/courses/${courseId}/attachments`
      );
      attachments = attachmentsData.data;
    }

    if (chapter.isFree || purchase) {
      const mux = await axios.get(`/chapters/${chapterId}/muxData`);
      muxData = mux.data;
      const nextChapterData = await axios.get(
        `/courses/${courseId}/nextChapter/${chapter.position}`
      );
      nextChapter = nextChapterData.data;
    }

    const userProgressData = await axios.get(
      `/users/${userId}/chapters/${chapterId}/userProgress`
    );
    userProgress = userProgressData.data;
    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
