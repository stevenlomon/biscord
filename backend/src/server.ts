import express from "express";
import dotenv from "dotenv";

dotenv.config();
let app = express();

app.get("/", (req, res) => {
  res.send(":)");
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Web server started and listening at port ${port}`);
});