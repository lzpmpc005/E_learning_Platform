const Mux = require("@mux/mux-node");

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

const mux = new Mux({
  tokenId: process.env["MUX_TOKEN_ID"],
  tokenSecret: process.env["MUX_TOKEN_SECRET"],
});

// app.use(cors());

app.use(express.json());

//cors
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  req.prisma = prisma;
  req.mux = mux;
  next();
});

const courseRoutes = require("./routes/courseRoutes");
const courseActions = require("./routes/courseActions");
const chapterRoutes = require("./routes/chapterRoutes");
const chapterActions = require("./routes/chapterActions");
const attachmentRoutes = require("./routes/attachmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const muxDataRoutes = require("./routes/muxDataRoutes");
const progressRoutes = require("./routes/progressRoutes");

app.use(
  courseRoutes,
  courseActions,
  chapterRoutes,
  chapterActions,
  attachmentRoutes,
  categoryRoutes,
  userRoutes,
  purchaseRoutes,
  muxDataRoutes,
  progressRoutes
);

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
