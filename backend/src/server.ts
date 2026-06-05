import express from "express";
import dotenv from "dotenv";

dotenv.config();
let app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(":)");
});

app.post("/create-user", (req, res) => {
  const joined_at = new Date().toLocaleString(); // I'll refine this later
  // Will take username and raw_password from body
  // TODO: If successful, add User to db
  res.status(201).json({
    "success": "ok",
    "data": {
      "username": req.body.username,
      "joined_at": joined_at,
      // Might add more
    }
  });
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Web server started and listening at port ${port}`);
});