import express from "express";
import { Request, Response, NextFunction } from "express";
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
const connectToPg = async () => {
  await pgClient.connect()
}

const getCurrentUser = async (session: any) => {
  // Find the user in Users using only session.user_id
  // Using a prepared statement!
  const query = {
    name: 'fetch-current-user',
    text: 'SELECT * FROM "User" WHERE id = $1',
    values: [session.user_id],
  }
  const res = await pgClient.query(query)
  const current_user = res.rows[0];

  console.log(`Current user: ${current_user.id} - ${current_user.username}`);
  return current_user;
}

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
  res.send("hi :)");
});

// USER ENDPOINTS
app.post("/create-user", async (req, res) => {
  const user_id = crypto.randomUUID();
  // const joined_at = new Date().toLocaleString(); // I'll refine this later. Nope, our Postgre DB can handle this one!
  const raw_password = req.body.password;
  const hashed_password = await bcrypt.hash(raw_password, 10); // I know from earlier Python that 10 is a reasonable standard for Salt Rounds. No AI needed! :))
  // Will take username and raw_password from body

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
  // Fetch the user that matches the login request body
  // const query = {
  //   name: 'fetch-login-match',
  //   text: 'SELECT * FROM user INNER JOIN auth ON user.auth_id = auth.id WHERE user.username = $1 AND auth.hashed_password = $2',
  //   values: [req.body.username, ],
  // }
  // const resp = await pgClient.query(query)
  // We can't do it like this! Cuz we can't compare like that, we need to compare with `bcrypt.compare(req.body.password, user.encrypted_pw)`
  // So the first fetch is a simple fetch from the User table on username only! And from that either single match or several matches we compare the hashed pw. Right
  // The db question here is... does our User table allow duplicate usernames? Right now I believe we do? 
  // We do. That needs to change. That should be rejected and frontend should display "Username already taken". The db should definitely have username be Unique
  const query1 = {
    name: 'fetch-username-match', // So match, not matches
    text: 'SELECT * FROM "User" WHERE username = $1', // This needs to be "User", not `user`
    values: [req.body.username],
  }
  const resp1 = await pgClient.query(query1);
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

  const resp2 = await pgClient.query(query2);
  const hashed_pw = resp2.rows[0].hashed_password;
  console.log(`Hashed password: ${hashed_pw}`);

  if (await bcrypt.compare(req.body.password, hashed_pw)) {
    (req.session as any).user_id = user.id; // Initiate the session
    // Here we also need to set their online status to Online! Meaning a third db query haha!
    const resp3 = await pgClient.query('UPDATE "User" SET online_status_id = $1 WHERE id = $2', [1, user.id]);
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
  const current_user = await getCurrentUser(req.session);

  res.json({
    "data": {
      "user_id": current_user.id,
      "username": current_user.username,
      "bio": current_user.bio
    }
  });
});

app.patch("/login-status", requireAuth, async (req, res) => {
  const current_user = await getCurrentUser(req.session); // 

  // To be implemented
});

app.patch("/bio", requireAuth, async (req, res) => {
  const current_user = await getCurrentUser(req.session);

  // Here's where we would change the bio for the user in db. Let's return to it and implement it
  // console.log(req.body.bio, current_user.id);
  const query = {
    name: 'update-user-bio',
    text: 'UPDATE "User" SET bio = $1 WHERE id = $2',
    values: [req.body.bio, current_user.id],
  }
  const resp = await pgClient.query(query);
  console.log(`Bio update results: ${resp.rows[0]}`); // This gives undefined!!! Even when there is a succesful update! Really good to know

  // So we can't wrap our response like this
  // if (!resp) {
  //   res.json({
  //     "success": "ok",
  //     "data": {
  //       "user_id": current_user.id,
  //       "username": current_user.username,
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