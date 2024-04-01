"use client";

import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    setUserId(userIdFromStorage);

    if (userIdFromStorage) {
      axios
        .get(`/courses/${params.courseId}/user/${userIdFromStorage}`)
        .then((response) => {
          const course = response.data;
          if (!course) {
            toast.error("Course not found");
            router.push("/");
            return;
          } else {
            router.push(
              `/courses/${course.id}/chapters/${course.chapters[0].id}`
            );
            return;
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred while fetching the course");
        });
    }
  }, [params.courseId, router]);

  return null;
};

export default CourseIdPage;
