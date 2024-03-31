"use client";

import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const router = useRouter();
    setUserId(userIdFromStorage);

    if (userIdFromStorage) {
      axios
        .get(`/api/courses/${params.courseId}/user/${userIdFromStorage}`)
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
  }, [params.courseId]);

  return null;
};

export default CourseIdPage;
