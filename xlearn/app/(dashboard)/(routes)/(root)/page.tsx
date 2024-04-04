"use client";

import type { Metadata } from "next";

export const medadata: Metadata = {
  title: "collegeX | Home",
  description: "collegeX Home Page",
};

import { useState, useEffect } from "react";

import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import {
  getDashboardCourses,
  CourseWithProgressWithCategory,
} from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/common/courses-list";

import { InfoCard } from "./_components/info-card";

export default function Dashboard() {
  const [completedCourses, setCompletedCourses] = useState<
    CourseWithProgressWithCategory[]
  >([]);
  const [coursesInProgress, setCoursesInProgress] = useState<
    CourseWithProgressWithCategory[]
  >([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      redirect("/auth/login");
    } else {
      getDashboardCourses(userId).then(
        ({
          completedCourses: completedCoursesData,
          coursesInProgress: coursesInProgressData,
        }) => {
          setCompletedCourses(completedCoursesData);
          setCoursesInProgress(coursesInProgressData);
        }
      );
    }
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
