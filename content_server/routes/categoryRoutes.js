const express = require("express");
const router = express.Router();

router.post("/api/create-categories", async (req, res) => {
  try {
    const prisma = req.prisma;

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

router.get("/api/categories", async (req, res) => {
  try {
    const prisma = req.prisma;
    const categories = await prisma.category.findMany();

    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
