import { CategoryType, Chapter, CourseType, Purchase } from "@/utils/types";

import { getProgress } from "@/actions/get-progress";
import { toast } from "react-toastify";
import axios from "@/utils/axios";

export type CourseWithProgressWithCategory = CourseType & {
  category: CategoryType;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

// mind this
type PurchaseType = {
  course: CourseWithProgressWithCategory;
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    if (!userId) {
      toast.error("You need to be logged in.");
      return {
        completedCourses: [],
        coursesInProgress: [],
      };
    }

    const res = await axios.get(`/users/${userId}/purchased-courses`);
    const purchasedCourses = res.data;
    const courses = purchasedCourses.map(
      (purchase: PurchaseType) => purchase.course
    ) as CourseWithProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    console.log("completedCourses", completedCourses);

    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
