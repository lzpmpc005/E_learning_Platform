const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors()); // Use cors middleware

//json
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/api/courses/:courseId/chapters/:chapterId", async (req, res) => {
  try {
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

app.put("/api/courses/:courseId/chapters/reorder", async (req, res) => {
  try {
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

app.get("/api/courses/:courseId/chapters", async (req, res) => {
  try {
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

app.post("/api/courses/:courseId/chapters", async (req, res) => {
  try {
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

    res.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    res.status(500).send("Internal Error");
  }
});

app.delete(
  "/api/courses/:courseId/attachments/:attachmentId",
  async (req, res) => {
    try {
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

app.post("/api/courses/:courseId/attachments", async (req, res) => {
  try {
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

app.post("/api/create-categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.patch("/api/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      userId,
      title,
      description,
      imageUrl,
      price,
      isPublished,
      categoryId,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updateData = {
      userId,
      title,
      description,
      imageUrl,
      price,
      isPublished,
      categoryId,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: updateData,
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

app.get("/api/courses/:courseId", async (req, res) => {
  try {
    console.log("req.params", req.params);
    const { courseId } = req.params;
    console.log("courseId", courseId);
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

app.post("/api/courses", async (req, res) => {
  try {
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

//test api
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "API is working" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
