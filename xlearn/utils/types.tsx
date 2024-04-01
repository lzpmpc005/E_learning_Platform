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
  purchases: any[];
};

export type CategoryType = {
  id: string;
  name: string;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Purchase = {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface MuxData {
  id: string;
  assetId: string;
  playbackId?: string | null;
  chapterId: string;
}
