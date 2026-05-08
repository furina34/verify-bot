const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is online!");
});

app.listen(3000, () => {
  console.log("Web server is running!");
});