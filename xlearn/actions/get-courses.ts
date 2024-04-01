import { CategoryType, CourseType } from "@/utils/types";

import { getProgress } from "./get-progress";
import axios from "@/utils/axios";

export type CourseWithProgressWithCategory = CourseType & {
  category: CategoryType | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const res = await axios.get("/search-courses", {
      params: {
        userId,
        title,
        categoryId,
      },
    });
    const courses = res.data;

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course: CourseType) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
