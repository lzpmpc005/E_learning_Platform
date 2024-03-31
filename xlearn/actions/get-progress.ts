import axios from "@/utils/axios";
import { Chapter } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/page";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await axios.get(
      `/courses/${courseId}/published-chapters`
    );
    console.log("publishedChapters", publishedChapters.data);

    const publishedChapterIds = publishedChapters.data.map(
      (chapter: Chapter) => chapter.id
    );
    console.log("publishedChapterIds", publishedChapterIds);

    const validCompletedChapters = await axios.get(
      `/users/${userId}/completed-chapters`,
      {
        params: {
          publishedChapterIds: publishedChapterIds,
        },
      }
    );

    const progressPercentage =
      (validCompletedChapters.data / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
