const express = require("express");
const router = express.Router();

router.get("/api/chapters/:chapterId/muxData", async (req, res) => {
  try {
    const prisma = req.prisma;
    const { chapterId } = req.params;

    const muxData = await prisma.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });

    if (!muxData) {
      return res
        .status(404)
        .json({ error: "MuxData not found for this chapter" });
    }

    res.json(muxData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
