const axios = require("axios");

const categories = [
  { name: "Computer Science" },
  { name: "Data Science" },
  { name: "Engineering" },
  { name: "Filming" },
  { name: "Music" },
  { name: "Cooking" },
  { name: "History" },
  { name: "Psychology" },
];

async function main() {
  try {
    categories.forEach(async (category) => {
      const response = await axios.post(
        "http://localhost:4000/api/create-categories",
        category
      );
      console.log(response.data);
    });
  } catch (error) {
    console.log("Error creating the categories", error);
  }
}

main();
