import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
let app = express();

app.use('/static', express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(":)");
});

// USER ENDPOINTS
app.post("/create-user", async (req, res) => {
  const user_id = crypto.randomUUID();
  const joined_at = new Date().toLocaleString(); // I'll refine this later
  const raw_password = req.body.password;
  const encryped_password = await bcrypt.hash(raw_password, 10); // I know from earlier Python that 10 is a reasonable standard for Salt Rounds. No AI needed! :D
  // Will take username and raw_password from body
  // TODO: If successful, add User to db

  res.status(201).json({
    "success": "ok",
    "data": {
      "id": user_id,
      "username": req.body.username,
      "encryped_pw": encryped_password,
      "joined_at": joined_at,
      // Might add more
    }
  });
});

// AUTH ENDPOINTS
app.post("/login", (req, res) => {

})


// START WEB SERVER
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Web server started and listening at port ${port}`);
});