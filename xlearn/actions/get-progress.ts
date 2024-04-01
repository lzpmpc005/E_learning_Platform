import axios from "@/utils/axios";
import { Chapter } from "@/utils/types";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await axios.get(
      `/courses/${courseId}/published-chapters`
    );

    const publishedChapterIds = publishedChapters.data.map(
      (chapter: Chapter) => chapter.id
    );

    const validCompletedChapters = await axios.get(
      `/users/${userId}/completed-chapters`,
      {
        params: {
          publishedChapterIds: publishedChapterIds,
        },
      }
    );
    const progressPercentage =
      (validCompletedChapters.data.validCompletedChapters /
        publishedChapterIds.length) *
      100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
