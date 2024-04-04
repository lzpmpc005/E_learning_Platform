const express = require("express");
const router = express.Router();

router.patch("/api/courses/:courseId", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId } = req.params;
    const { userId, ...values } = req.body;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: values,
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/courses/:courseId", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.json({ course, categories });
  } catch (error) {
    console.log("[COURSES]", error);
    res.status(500).send("Internal Error");
  }
});

router.post("/api/courses", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.body;
    const { title } = req.body;
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }
    const course = await prisma.course.create({
      data: {
        userId,
        title,
      },
    });
    return res.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return res.status(500).send("Internal Error");
  }
});

// retrieve all courses
router.get("/api/all-courses", async (req, res) => {
  try {
    const prisma = req.prisma;

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
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

// search courses
router.get("/api/search-courses", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId, title, categoryId } = req.query;

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
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

module.exports = router;
