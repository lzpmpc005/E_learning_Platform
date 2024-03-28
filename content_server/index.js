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
    const { title, description, imageUrl, userId } = req.body;

    let updateData = {};
    if (title !== undefined) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

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

    res.json({ message: "Course updated", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
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
