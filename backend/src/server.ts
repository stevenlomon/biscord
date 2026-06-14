import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import cors from "cors";
import pool from "./db";

dotenv.config();
let app = express();

// Custom Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any).userId) {
    return next();
  } else {
    res.send("Please log in!")
  }
};

// Helper functions
// const connectToPg = async () => {
//   await pgClient.connect()
// } Not needed if we use Pool!

const getCurrentUser = async (session: any) => {
  // Find the user in Users using only session.userId
  // Using a prepared statement!
  const query = {
    name: 'fetch-current-user',
    text: 'SELECT * FROM "User" WHERE id = $1',
    values: [session.userId],
  }
  const res = await pool.query(query)
  const currentUser = res.rows[0];

  console.log(`Current user: ${currentUser.id} - ${currentUser.username}`);
  return currentUser;
}

// MIDDLEWARE
app.use(express.json());
// app.use('/static', express.static('public'));
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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // Allows the session cookie to be sent back and forth
}));


app.get("/", (req, res) => {
  res.send("hi :)");
});

// USER ENDPOINTS
app.post("/create-user", async (req, res) => {
  const userId = crypto.randomUUID();
  // const joined_at = new Date().toLocaleString(); // I'll refine this later. Nope, our Postgre DB can handle this one!

  // Will take username and rawPassword from body
  const rawPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(rawPassword, 10); // I know from earlier Python that 10 is a reasonable standard for Salt Rounds. No AI needed! :))

  // Normalize: If displayName empty or missing, it's strictly null
  const displayName = req.body.displayName && req.body.displayName.trim() !== ""
    ? req.body.displayName
    : null;

  // First we need to add the hashed password to the Auth table
  const result1 = await pool.query('INSERT INTO "Auth"(hashed_password) VALUES($1) RETURNING *', [hashedPassword]); // Using parameterized queries. And "Auth" needs to be in double quotes!
  console.log(result1.rows[0])

  // Grab the id of the newly created Auth row
  const AuthId = result1.rows[0].id;

  // Second query for the actual User row
  // We handle id, username and authId server-side, our Postgre DB handles created_at and sets bio, online_status_id and profile_pic_url as a default NULL!

  // No more conditional db insert needed thanks to the normalization! We use displayName whether it's a valid value or null
  const result2 = await pool.query(
    'INSERT INTO "User"(id, username, auth_id, display_name, date_of_birth) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [userId, req.body.username, AuthId, displayName, req.body.dob]
  );
  console.log(result2.rows[0])

  res.status(201).json({
    "success": "ok",
    "data": {
      "id": userId,
      "username": req.body.username,
      "hashed_pw": hashedPassword,
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
  // Fetch the user that matches the login request body
  // const query = {
  //   name: 'fetch-login-match',
  //   text: 'SELECT * FROM user INNER JOIN auth ON user.auth_id = auth.id WHERE user.username = $1 AND auth.hashedPassword = $2',
  //   values: [req.body.username, ],
  // }
  // const resp = await pool.query(query)
  // We can't do it like this! Cuz we can't compare like that, we need to compare with `bcrypt.compare(req.body.password, user.encrypted_pw)`
  // So the first fetch is a simple fetch from the User table on username only! And from that either single match or several matches we compare the hashed pw. Right
  // The db question here is... does our User table allow duplicate usernames? Right now I believe we do? 
  // We do. That needs to change. That should be rejected and frontend should display "Username already taken". The db should definitely have username be Unique
  const query1 = {
    name: 'fetch-username-match', // So match, not matches
    text: 'SELECT * FROM "User" WHERE username = $1', // This needs to be "User", not `user`
    values: [req.body.username],
  }
  const resp1 = await pool.query(query1);
  const user = resp1.rows[0];

  console.log(`Login username match: ${user.id}`); // Right. So if no username match, this is undefined
  // Meaning that we can throw early here if there is no match!
  if (!user) { // This works 🎉
    return res.status(401).json({
      "success": "not ok"
    });
  }

  // NOW that we have a username match, we check if the password match
  // And I'm just now realizing this requries a second db fetch. We need to grab the hashed password from the Auth table. Right.

  const query2 = {
    name: 'fetch-hashed-password',
    text: 'SELECT hashed_password FROM "Auth" WHERE id = $1',
    values: [user.auth_id] // This works haha! And it should be auth_id, not id
  }

  const resp2 = await pool.query(query2);
  const hashedPassword = resp2.rows[0].hashed_password;
  console.log(`Hashed password: ${hashedPassword}`);

  if (await bcrypt.compare(req.body.password, hashedPassword)) {
    (req.session as any).userId = user.id; // Initiate the session
    // Here we also need to set their online status to Online! Meaning a third db query haha!
    const resp3 = await pool.query('UPDATE "User" SET online_status_id = $1 WHERE id = $2', [1, user.id]);
    console.log(`Set login status result: ${resp3.rows[0]}`);

    return res.json({
      "success": "ok"
    });
  } else {
    return res.status(401).json({
      "success": "not ok"
    });
  }

  // res.send(":)");
})

// LOGGED IN ENDPOINTS
app.get("/profile", requireAuth, async (req, res) => {
  const currentUser = await getCurrentUser(req.session);

  res.json({
    "data": {
      "userId": currentUser.id,
      "username": currentUser.username,
      "bio": currentUser.bio
    }
  });
});

app.patch("/login-status", requireAuth, async (req, res) => {
  const currentUser = await getCurrentUser(req.session); // 

  // console.log(Date.now());
  // console.log(req.body.for*60*1000);
  // console.log(Date.now() + req.body.for*60*1000);
  const query = req.body.status === 1 ? { // If the User sets their online status back to 1 (Online), there won't be a `for` key in the body payload
    name: 'update-login-status',
    text: 'UPDATE "User" SET online_status_id = $1 WHERE id = $2',
    values: [req.body.status, currentUser.id],
  } : {
    name: 'update-login-status',
    text: 'UPDATE "User" SET online_status_id = $1, online_status_until = $2 WHERE id = $3',
    values: [req.body.status, new Date(Date.now() + req.body.for * 60 * 1000), currentUser.id], // Sticking to Unix time for simplicity. We need to wrap our ms time delta math in new Date to signal it as a Unix offset
  };

  const resp = await pool.query(query);
  console.log(`Online status update results: ${resp.rows[0]}`);

  res.json({
    "success": "ok",
    "data": {
      "userId": currentUser.id,
      "username": currentUser.username,
      "online_status_id": req.body.status,
      "online_status_until": new Date(Date.now() + req.body.for * 60 * 1000)
    }
  });

  // res.send(":)");
});

app.patch("/bio", requireAuth, async (req, res) => {
  const currentUser = await getCurrentUser(req.session);

  // Here's where we would change the bio for the user in db. Let's return to it and implement it
  // console.log(req.body.bio, currentUser.id);
  const query = {
    name: 'update-user-bio',
    text: 'UPDATE "User" SET bio = $1 WHERE id = $2',
    values: [req.body.bio, currentUser.id],
  }
  const resp = await pool.query(query);
  console.log(`Bio update results: ${resp.rows[0]}`); // This gives undefined!!! Even when there is a succesful update! Really good to know

  // So we can't wrap our response like this
  // if (!resp) {
  //   res.json({
  //     "success": "ok",
  //     "data": {
  //       "userId": currentUser.id,
  //       "username": currentUser.username,
  //       "bio": req.body.bio
  //     }
  //   });
  // } else {
  //   res.status(500).json({
  //     "success": "not ok",
  //     "message": "database error"
  //   })
  // }

  res.json({
    "success": "ok",
    "data": {
      "userId": currentUser.id,
      "username": currentUser.username,
      "bio": req.body.bio
    }
  });
});

app.post("/logout", requireAuth, async (req, res) => {
  // "The only other thing we need to do here is to set Online Status to NULL in the db"
  // Order matters here haha! Update the logged in user, THEN end the session
  const currentUser = await getCurrentUser(req.session);
  const resp = await pool.query('UPDATE "User" SET online_status_id = $1 WHERE id = $2', [null, currentUser.id]);
  console.log(`Set login status result: ${resp.rows[0]}`);

  // Super simple logout in terms of session and cookies for now
  (req.session as any).userId = null; // End the session

  res.json({
    "success": "ok",
  });
});


// START WEB SERVER
let port = process.env.WEB_SERVER_PORT || 3000;

app.listen(port, () => {
  // connectToPg(); Not needed now since we use Pool!

  console.log(`Connected to PG Pool`)
  console.log(`Web server started and listening at port ${port}`);
});