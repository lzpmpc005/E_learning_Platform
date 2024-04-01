const express = require("express");
const router = express.Router();

// update chapter
router.patch("/api/courses/:courseId/chapters/:chapterId", async (req, res) => {
  try {
    const prisma = req.prisma;
    const mux = req.mux;
    const { courseId, chapterId } = req.params;
    const { userId, ...values } = req.body;

    let newMuxData = null;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    if (values.videoUrl) {
      const existMuxData = await prisma.muxData.findFirst({
        where: { chapterId: chapterId },
      });
      if (existMuxData) {
        await mux.video.assets.delete(existMuxData.assetId);
        await prisma.muxData.delete({
          where: { id: existMuxData.id },
        });
      }
      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      newMuxData = await prisma.muxData.create({
        data: {
          chapterId: chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: values,
    });

    res.json({ chapter: updatedChapter, muxData: newMuxData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// get chapter
router.get("/api/courses/:courseId/chapters/:chapterId", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId, chapterId } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      include: {
        muxData: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// reorder chapter
router.put("/api/courses/:courseId/chapters/reorder", async (req, res) => {
  try {
    const prisma = req.prisma;

    const { courseId } = req.params;
    const { list, userId } = req.body;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    if (!courseId || !list || !Array.isArray(list)) {
      return res.status(400).send("Invalid request data");
    }

    const transaction = prisma.$transaction(
      list.map((item) =>
        prisma.chapter.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    await transaction;

    res.json({ message: "Chapters reordered" });
  } catch (error) {
    console.log("[REORDER CHAPTERS]", error);
    res.status(500).send("Something went wrong");
  }
});

// retrieve chapters
router.get("/api/courses/:courseId/chapters", async (req, res) => {
  try {
    const prisma = req.prisma;

    const { courseId } = req.params;
    const chapters = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "asc",
      },
    });
    res.json(chapters);
  } catch (error) {
    console.log("[GET CHAPTERS]", error);
    res.status(500).send("Something went wrong");
  }
});

// create chapter
router.post("/api/courses/:courseId/chapters", async (req, res) => {
  try {
    const prisma = req.prisma;

    const { userId } = req.body;
    const { title } = req.body;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: { chapters: true },
    });

    if (!courseOwner) {
      return res.status(401).send("Unauthorized");
    }

    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await prisma.chapter.create({
      data: {
        title,
        courseId: courseId,
        position: newPosition,
      },
    });

    res.json({ chapter, course: courseOwner });
  } catch (error) {
    console.log("[CHAPTERS]", error);
    res.status(500).send("Internal Error");
  }
});

// get published chapters for a course
router.get("/api/courses/:courseId/published-chapters", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).send("Course ID is required");
    }

    const publishedChapters = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    return res.json(publishedChapters);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// retrieve published chapter by ID
router.get("/api/chapters/:chapterId/published", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { chapterId } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Published chapter not found" });
    }

    res.json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// retrieve next chapter by ID
router.get("/api/courses/:courseId/nextChapter/:position", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { courseId, position } = req.params;

    let nextChapter = await prisma.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: Number(position),
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    if (!nextChapter) {
      nextChapter = null;
    }

    res.json(nextChapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
