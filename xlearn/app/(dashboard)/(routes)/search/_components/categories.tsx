"use client";

import { CategoryType } from "@/utils/types";

import {
  FcStatistics,
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcLightAtTheEndOfTunnel,
  FcHome,
} from "react-icons/fc";
import { IconType } from "react-icons";

import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: CategoryType[];
}

const iconMap: Record<CategoryType["name"], IconType> = {
  Cooking: FcHome,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
  History: FcOldTimeCamera,
  Music: FcMusic,
  Psychology: FcLightAtTheEndOfTunnel,
  "Data Science": FcStatistics,
  "Computer Science": FcMultipleDevices,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
