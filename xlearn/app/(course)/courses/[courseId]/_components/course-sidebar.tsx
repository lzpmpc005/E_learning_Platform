import { CourseType, Chapter, UserProgress } from "@/utils/types";
import { useRouter } from "next/navigation";
import { CourseProgress } from "@/components/common/course-progress";
import { CourseSidebarItem } from "./course-sidebar-item";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { set } from "zod";

interface CourseSidebarProps {
  course: CourseType & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setUserId(userIdFromStorage);

    if (userIdFromStorage) {
      axios
        .get(`/purchases/user/${userIdFromStorage}/course/${course.id}`)
        .then((response) => {
          setPurchase(response.data);
        })
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred while fetching the purchase data");
        });
    } else {
      toast.error("You need to login to access this page");
      router.push("/");
      return;
    }
  }, [course.id]);

  if (!userId) {
    return null;
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
