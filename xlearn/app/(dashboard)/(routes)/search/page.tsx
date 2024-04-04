"use client";

import axios from "@/utils/axios";
import { useEffect, useState } from "react";

import { SearchInput } from "@/components/common/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/common/courses-list";
import { Categories } from "./_components/categories";

import { CourseWithProgressWithCategory } from "@/actions/get-courses";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState<CourseWithProgressWithCategory[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log("Search Page No user id");
        window.location.href = "/";
        return;
      }

      const categoriesData = await axios.get("/categories");
      setCategories(categoriesData.data);

      const courses = await getCourses({
        userId,
        ...searchParams,
      });
      setCourses(courses);
    };

    fetchData();
  }, [searchParams]);

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
