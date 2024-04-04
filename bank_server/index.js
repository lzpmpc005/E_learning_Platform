const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// app.use(cors());

app.use(express.json());

//cors
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  req.prisma = prisma;
  next();
});

app.post("/bankx/courses/:courseId/", async (req, res) => {
  const params = req.body;
  const { courseId } = req.params;
  console.log(params);
  console.log("courseId", courseId);

  if (!params.userId) {
    return res.status(401).send("Unauthorized");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
  });

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: params.userId,
        courseId: courseId,
      },
    },
  });

  if (purchase) {
    return res.status(400).send("Already purchased");
  }

  if (!course) {
    return res.status(404).send("Course Not Found");
  }

  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      card_number: params.cardNumber,
      card_holder: params.cardName,
      cvv: params.cvv,
      expire_year: parseInt(params.expireYear, 10),
      expire_month: parseInt(params.expireMonth, 10),
    },
  });

  if (!bankAccount) {
    return res.status(400).send("Payment Failed! Invalid Bank Account!");
  }

  // if (bankAccount.balance < course.price) {
  //   return res.status(400).send("Payment Failed! Insufficient Balance!");
  const newPurchase = await prisma.purchase.create({
    data: {
      userId: params.userId,
      courseId: courseId,
    },
  });
  res.status(200).json(newPurchase);
});

app.post("/bankx/create-account", async (req, res) => {
  try {
    const {
      card_number,
      card_holder,
      cvv,
      balance,
      expire_year,
      expire_month,
    } = req.body;

    const account = await prisma.bankAccount.create({
      data: {
        card_number,
        card_holder,
        cvv,
        balance,
        expire_year,
        expire_month,
      },
    });

    console.log(`Created account ${account.card_number}`);
    res.json(account);
  } catch (error) {
    console.log("Error creating the bank accounts", error);
    res.status(500).send("Internal Error");
  }
});

//start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
