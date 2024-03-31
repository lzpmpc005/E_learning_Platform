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

app.use(cors());

app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  req.prisma = prisma;
  req.mux = mux;
  next();
});

const courseRoutes = require("./courseRoutes");
const courseActions = require("./courseActions");
const chapterRoutes = require("./chapterRoutes");
const chapterActions = require("./chapterActions");
const attachmentRoutes = require("./attachmentRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");

app.use(
  courseRoutes,
  courseActions,
  chapterRoutes,
  chapterActions,
  attachmentRoutes,
  categoryRoutes,
  userRoutes
);

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
