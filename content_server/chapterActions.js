const express = require("express");
const router = express.Router();

// unpublish
router.patch(
  "/api/courses/:courseId/chapters/:chapterId/unpublish",
  async (req, res) => {
    try {
      const prisma = req.prisma;
      const { userId } = req.body;
      const { courseId, chapterId } = req.params;

      if (!userId) {
        return res.status(401).send("Unauthorized");
      }

      const ownCourse = await prisma.course.findUnique({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!ownCourse) {
        return res.status(401).send("Unauthorized");
      }

      const unpublishedChapter = await prisma.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          isPublished: false,
        },
      });

      const publishedChaptersInCourse = await prisma.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
      });

      if (!publishedChaptersInCourse.length) {
        await prisma.course.update({
          where: {
            id: courseId,
          },
          data: {
            isPublished: false,
          },
        });
      }

      res.json(unpublishedChapter);
    } catch (error) {
      console.log("[CHAPTER_UNPUBLISH]", error);
      res.status(500).send("Internal Error");
    }
  }
);

// publish
router.patch(
  "/api/courses/:courseId/chapters/:chapterId/publish",
  async (req, res) => {
    try {
      const prisma = req.prisma;

      const { userId } = req.body;
      console.log("userId", userId);
      const { courseId, chapterId } = req.params;

      if (!userId) {
        return res.status(401).send("Unauthorized");
      }

      const ownCourse = await prisma.course.findUnique({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!ownCourse) {
        return res.status(401).send("Unauthorized");
      }

      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterId,
          courseId: courseId,
        },
      });

      const muxData = await prisma.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      if (
        !chapter ||
        !muxData ||
        !chapter.title ||
        !chapter.description ||
        !chapter.videoUrl
      ) {
        return res.status(400).send("Missing required fields");
      }

      const publishedChapter = await prisma.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          isPublished: true,
        },
      });

      res.json(publishedChapter);
    } catch (error) {
      console.log("[CHAPTER_PUBLISH]", error);
      res.status(500).send("Internal Error");
    }
  }
);

// update
router.delete(
  "/api/courses/:courseId/chapters/:chapterId",
  async (req, res) => {
    try {
      const prisma = req.prisma;
      const mux = req.mux;
      const { userId } = req.body;
      const { courseId, chapterId } = req.params;

      if (!userId) {
        return res.status(401).send("Unauthorized");
      }

      const ownCourse = await prisma.course.findUnique({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!ownCourse) {
        return res.status(401).send("Unauthorized");
      }

      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterId,
          courseId: courseId,
        },
      });

      if (!chapter) {
        return res.status(404).send("Not Found");
      }

      if (chapter.videoUrl) {
        const existingMuxData = await prisma.muxData.findFirst({
          where: {
            chapterId: chapterId,
          },
        });

        if (existingMuxData) {
          await mux.video.assets.delete(existingMuxData.assetId);
          await prisma.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          });
        }
      }

      const deletedChapter = await prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      });

      const publishedChaptersInCourse = await prisma.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
      });

      if (!publishedChaptersInCourse.length) {
        await prisma.course.update({
          where: {
            id: courseId,
          },
          data: {
            isPublished: false,
          },
        });
      }

      res.json(deletedChapter);
    } catch (error) {
      console.log("[CHAPTER_ID_DELETE]", error);
      res.status(500).send("Internal Error");
    }
  }
);

module.exports = router;
