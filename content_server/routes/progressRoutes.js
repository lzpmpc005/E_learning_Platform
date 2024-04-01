const express = require("express");
const router = express.Router();

// retrieve userProgress
router.get(
  "/api/users/:userId/chapters/:chapterId/userProgress",
  async (req, res) => {
    try {
      const prisma = req.prisma;
      const { userId, chapterId } = req.params;

      let userProgress = await prisma.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: userId,
            chapterId: chapterId,
          },
        },
      });

      if (!userProgress) {
        userProgress = null;
      }

      res.json(userProgress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// update/create userProgress
router.put(
  "/api/courses/:courseId/chapters/:chapterId/progress",
  async (req, res) => {
    try {
      const { courseId, chapterId } = req.params;
      const { userId, isCompleted } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userProgress = await req.prisma.userProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId: chapterId,
          },
        },
        update: {
          isCompleted,
        },
        create: {
          userId,
          chapterId: chapterId,
          isCompleted,
        },
      });

      res.json(userProgress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
