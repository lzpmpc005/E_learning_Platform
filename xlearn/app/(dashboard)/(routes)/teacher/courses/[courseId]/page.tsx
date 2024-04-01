"use client";

import { useRouter } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { IconBadge } from "@/components/common/icon-badge";
import { Banner } from "@/components/common/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { CourseType, CategoryType } from "@/utils/types";

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const [course, setCourse] = useState<CourseType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [completionText, setCompletionText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    (async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        router.push("/");
        return;
      }

      const response = await axios.get(`/courses/${params.courseId}`);
      const { course, categories } = response.data;

      if (!course) {
        router.push("/");
        return;
      }
      setCourse(course);
      handleCourseUpdate(course);
      setCategories(categories);
      setLoading(false);
    })();
  }, [params.courseId]);

  const handleCourseUpdate = (updatedCourse: CourseType) => {
    setCourse(updatedCourse);

    const requiredFields = updatedCourse
      ? [
          updatedCourse.title,
          updatedCourse.description,
          updatedCourse.imageUrl,
          updatedCourse.price,
          updatedCourse.categoryId,
          updatedCourse.chapters &&
            updatedCourse.chapters.some((chapter) => chapter.isPublished),
        ]
      : [];

    const completedFields = requiredFields.filter(Boolean).length;
    const totalFields = requiredFields.length;
    const newCompletionText = `(${completedFields}/${totalFields})`;
    const newIsComplete = requiredFields.every(Boolean);

    setCompletionText(newCompletionText);
    setIsComplete(newIsComplete);
  };

  return (
    <>
      {!course?.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          {course && (
            <Actions
              disabled={!isComplete}
              courseId={params.courseId}
              isPublished={course.isPublished}
              onCourseUpdate={handleCourseUpdate}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            {course ? (
              <>
                <TitleForm initialData={course} courseId={course.id} />
                <DescriptionForm
                  initialData={{
                    ...course,
                    description: course.description || "",
                  }}
                  courseId={course.id}
                  onCourseUpdate={handleCourseUpdate}
                />
                <ImageForm
                  initialData={{
                    ...course,
                    imageUrl: course.imageUrl || "",
                  }}
                  courseId={course.id}
                  onCourseUpdate={handleCourseUpdate}
                />
                {categories.length > 0 && (
                  <CategoryForm
                    initialData={{ categoryId: course.categoryId || "" }}
                    courseId={course.id}
                    options={categories.map((category: CategoryType) => ({
                      label: category.name,
                      value: category.id,
                    }))}
                    onCourseUpdate={handleCourseUpdate}
                  />
                )}
              </>
            ) : null}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              {course ? (
                <ChaptersForm
                  initialData={course}
                  courseId={course.id}
                  onCourseUpdate={handleCourseUpdate}
                />
              ) : null}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your knowledge</h2>
              </div>
              {course && (
                <PriceForm
                  initialData={course}
                  courseId={course.id}
                  onCourseUpdate={handleCourseUpdate}
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              {course && (
                <AttachmentForm initialData={course} courseId={course.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
