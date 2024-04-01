const express = require("express");
const router = express.Router();

router.delete(
  "/api/courses/:courseId/attachments/:attachmentId",
  async (req, res) => {
    try {
      const prisma = req.prisma;

      const { courseId, attachmentId } = req.params;

      const attachment = await prisma.attachment.findUnique({
        where: {
          id: attachmentId,
        },
      });

      if (!attachment) {
        return res.status(404).json({ error: "Attachment not found" });
      }

      if (attachment.courseId !== courseId) {
        return res.status(400).json({
          error: "Attachment does not belong to the specified course",
        });
      }

      await prisma.attachment.delete({
        where: {
          id: attachmentId,
        },
      });

      res.json({ message: "Attachment deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/api/courses/:courseId/attachments", async (req, res) => {
  try {
    const prisma = req.prisma;

    const { userId } = req.body;
    const { url } = req.body;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).send("Need to be logged in");
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return res.status(401).send("Unauthorized, not your course");
    }

    const attachment = await prisma.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: courseId,
      },
    });

    res.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    res.status(500).send("Internal Error");
  }
});

// get attachments for a course by courseId
router.get("/api/courses/:courseId/attachments", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId } = req.params;

    let attachments = await prisma.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    if (!attachments || attachments.length === 0) {
      attachments = [];
    }

    res.json(attachments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
