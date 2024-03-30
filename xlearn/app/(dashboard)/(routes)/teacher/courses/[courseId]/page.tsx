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
import { Title } from "@radix-ui/react-dialog";

export type CourseType = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  chapters: any[];
  attachments: any[];
};

type CategoryType = {
  id: string;
  name: string;
};

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const [course, setCourse] = useState<CourseType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      setCategories(categories);
      setLoading(false);
    })();
  }, [params.courseId]);

  const requiredFields = course
    ? [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
      ]
    : [];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

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
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course ? course.isPublished : false}
          />
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
                />
                <ImageForm
                  initialData={{
                    ...course,
                    imageUrl: course.imageUrl || "",
                  }}
                  courseId={course.id}
                />
                {categories.length > 0 && (
                  <CategoryForm
                    initialData={{ categoryId: course.categoryId || "" }}
                    courseId={course.id}
                    options={categories.map((category: CategoryType) => ({
                      label: category.name,
                      value: category.id,
                    }))}
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
                <ChaptersForm initialData={course} courseId={course.id} />
              ) : null}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your knowledge</h2>
              </div>
              {course && (
                <PriceForm initialData={course} courseId={course.id} />
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
