const dotenv = require("dotenv");
dotenv.config();

const { getAllEmails } = require("./utils/googleSheetReader");

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on PORT " + PORT);

  getAllEmails();
});
