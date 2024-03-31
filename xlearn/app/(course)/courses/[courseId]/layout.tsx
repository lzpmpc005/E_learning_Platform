"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { difference } from "next/dist/build/utils";

const CourseLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [progressCount, setProgressCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setUserId(userIdFromStorage);

    if (userIdFromStorage) {
      axios
        .get(`/api/courses/${params.courseId}/user/${userIdFromStorage}`)
        .then(async (response) => {
          const courseData = response.data;
          if (!courseData) {
            toast.error("Course not found");
            router.push("/");
            return;
          } else {
            setCourse(courseData);
            const progress = await getProgress(
              userIdFromStorage,
              courseData.id
            );
            setProgressCount(progress);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred while fetching the course");
        });
    } else {
      toast.error("You need to login to access this page");
      router.push("/");
      return;
    }
  }, [params.courseId]);

  if (!course) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
