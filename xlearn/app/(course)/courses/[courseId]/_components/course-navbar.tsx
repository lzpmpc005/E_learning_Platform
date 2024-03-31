import { CourseType } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page";
import { Chapter } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/page";
import { NavbarRoutes } from "@/components/common/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

export interface UserProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseNavbarProps {
  course: CourseType & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
