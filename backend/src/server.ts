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
const connectToPg = async() => {
  await pgClient.connect()
}

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
  // const joined_at = new Date().toLocaleString(); // I'll refine this later. Nope, our Postgre DB can handle this one!
  const raw_password = req.body.password;
  const hashed_password = await bcrypt.hash(raw_password, 10); // I know from earlier Python that 10 is a reasonable standard for Salt Rounds. No AI needed! :))
  // Will take username and raw_password from body
  
  // TODO: If successful, add User to db
  // First we need to add the hashed password to the Auth table
  const result1 = await pgClient.query('INSERT INTO "Auth"(hashed_password) VALUES($1) RETURNING *', [hashed_password]); // Using parameterized queries. And "Auth" needs to be in double quotes!
  console.log(result1.rows[0])

  // Grab the id of the newly created Auth row
  const AuthId = result1.rows[0].id;

  // Second query for the actual User row
  // We handle id, username and authId server-side, our Postgre DB handles created_at and sets bio, online_status_id and profile_pic_url as a default NULL!
  const result2 = await pgClient.query('INSERT INTO "User"(id, username, auth_id) VALUES($1, $2, $3) RETURNING *', [user_id, req.body.username, AuthId]);
  console.log(result2.rows[0])

  res.status(201).json({
    "success": "ok",
    "data": {
      "id": user_id,
      "username": req.body.username,
      "hashed_pw": hashed_password,
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
let port = process.env.WEB_SERVER_PORT || 3000;

app.listen(port, () => {
  connectToPg();

  console.log(`Connected to PG Client`)
  console.log(`Web server started and listening at port ${port}`);
});