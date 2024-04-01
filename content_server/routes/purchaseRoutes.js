const express = require("express");
const router = express.Router();

router.get("/api/courses/:courseId/price", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ error: "Course not found or not published" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// check purchase status
router.get("/api/purchases/user/:userId/course/:courseId", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userId, courseId } = req.params;

    let purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!purchase) {
      purchase = null;
    }

    res.json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
