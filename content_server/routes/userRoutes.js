const express = require("express");
const router = express.Router();

//retrieve user specific course
router.get("/api/courses/:courseId/user/:userId", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId, userId } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: {
              where: {
                userId,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//retrieve user completed chapters
router.get("/api/users/:userId/completed-chapters", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.params;
    const { publishedChapterIds } = req.query;

    if (!userId) {
      return res.status(400).send("Unauthorized");
    }

    if (!publishedChapterIds || !Array.isArray(publishedChapterIds)) {
      return res
        .status(400)
        .send("Published chapter IDs are required and should be an array");
    }

    const validCompletedChapters = await prisma.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    return res.json({ validCompletedChapters });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// retrieve all courses for a user(teacher)
router.get("/api/courses", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send("Unauthorized");
    }

    const courses = await prisma.course.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// retrieve all purchased courses for a user
router.get("/api/users/:userId/purchased-courses", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send("Unauthorized");
    }

    const purchasedCourses = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    return res.json(purchasedCourses);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error in retrieving purchasedCourses" });
  }
});

module.exports = router;
