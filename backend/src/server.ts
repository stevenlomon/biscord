import express from "express";
import {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import pgClient from "./db";

dotenv.config();
let app = express();

// Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any).user_id) {
    return next();
  } else {
    res.send("Please log in!")
  }
};

// Helper functions
const getCurrentUser = async (session: any) => {
  // Find the user in Users using only req.session.user_id
  const response = await fetch(`http://localhost:${process.env.PORT}/static/users.json`);
  const users = await response.json();

  let current_user;
  for (let user of users) {
    if (user.id === session.user_id) {
      current_user = user;
    }
  }

  return current_user;
}

app.use(express.json());
app.use('/static', express.static('public'));
app.use(session({
  name: "biscord-cookie",
  secret: "super secret!",
  saveUninitialized: false,
  resave: true,
  cookie: {
    "httpOnly": true,
    "maxAge": 5 * 60 * 1000
  }
}));

// // This can surely be done in a more elegant way
// const fetchUsers = async () => {
//   const response = await fetch(`http://localhost:${process.env.PORT}/static/users.json`);
//   const data = await response.json();
//   return data;
// }
// const USERS = fetchUsers();
// console.log(USERS);
// That.. is not gonna work haha

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

app.get("/users", async (req, res) => {
  const response = await fetch(`http://localhost:${process.env.PORT}/static/users.json`);
  const data = await response.json();
  res.json(data);
})

// AUTH ENDPOINTS
app.post("/login", async (req, res) => {
  // This is ugly, I *know* haha
  const response = await fetch(`http://localhost:${process.env.PORT}/static/users.json`);
  const users = await response.json();
  
  for (let user of users) { // Intuition just whispered.. we can use `.in()` here?
    if (req.body.username === user.username && await bcrypt.compare(req.body.password, user.encrypted_pw)) {
      (req.session as any).user_id = user.id;
      return res.json({
        "success": "ok"
      });
    } else {
      return res.status(401).json({
        "success": "not ok"
      });
    }
  }

  // res.send(":)");
})

// LOGGED IN ENDPOINTS
app.get("/profile", requireAuth, async (req, res) => {
  const current_user = await getCurrentUser(req.session);

  res.json({
    "data": {
      "user_id": current_user.id,
      "username": current_user.username,
      "bio": current_user.bio
    }
  });
});

app.patch("/edit-bio", requireAuth, async (req, res) => {
  const current_user = await getCurrentUser(req.session);
  
  // Here's where we would change the bio for the user in db

  res.json({
    "success": "ok",
    "data": {
      "user_id": current_user.id,
      "username": current_user.username,
      "bio": req.body.bio
    }
  });
});


// START WEB SERVER
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Web server started and listening at port ${port}`);
});