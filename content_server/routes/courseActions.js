const express = require("express");
const router = express.Router();

// publish course
router.patch("/api/courses/:courseId/unpublish", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.body;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return res.status(404).send("Not found");
    }

    const unpublishedCourse = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    res.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    res.status(500).send("Internal Error");
  }
});

// publish course
router.patch("/api/courses/:courseId/publish", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.body;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).send("Not found");
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter ||
      !course.price
    ) {
      return res.status(400).send("Missing required fields");
    }

    const publishedCourse = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    res.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    res.status(500).send("Internal Error");
  }
});

// delete course
router.delete("/api/courses/:courseId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { courseId } = req.params;
    const prisma = req.prisma;
    const mux = req.mux;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return res.status(404).send("Not Found");
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        try {
          await mux.video.assets.delete(chapter.muxData.assetId);
        } catch (error) {
          if (error.status === 404) {
            console.log(`Asset with ID ${chapter.muxData.assetId} not found.`);
          } else {
            throw error;
          }
        }
        await prisma.muxData.delete({
          where: {
            id: chapter.muxData.id,
          },
        });
      }
    }

    const deletedCourse = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    console.log("Deleted course", deletedCourse);

    res.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    res.status(500).send("Internal Error");
  }
});

module.exports = router;
