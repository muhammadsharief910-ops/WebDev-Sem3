const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const user = require("./db");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/databse").then(() => {
  console.log("mongoDB Connected!!");
});

//signUp
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await user.findOne({ email });

  if (userExists) {
    return res.send("user already exists");
  }

  let SecPassword = await bcryptjs.hash(password, 10);
  let UserInfo = new user({
    name,
    email,
    password: SecPassword,
    role: role || "user",
  });

  await UserInfo.save();
  res.send("Youre officially signed In!!");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let Finduser = await user.findOne({ email });

  if (!Finduser) {
    return res.send("User Not Found , SignUp instead");
  }

  let isPassValid = await bcryptjs.compare(password, Finduser.password);

  if (!isPassValid) {
    return res.send("invalid Password");
  }

  let token = jwt.sign(
    { userId: Finduser._id, email: Finduser.email, role: Finduser.role },
    "secretKey123",
  );
  console.log(token);

  res.json({ token: token, message: "Logged In!" });
});

//auth

let auth = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("token not found");
  }

  try {
    let decoded = jwt.verify(token, "secretKey123");
    let currentuser = await user.findById(decoded.userId);

    if (!currentuser) {
      return res.status(404).send("user not found");
    }

    req.user = currentuser;
    next();
  } catch (err) {
    return res.status(403).send("invalid or expired token");
  }
};
let isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied: Admin only");
  }
  next();
};

//admin dashboard
app.get("/dashboard", auth, isAdmin, (req, res) => {
  return res.send("Welcome Admin");
});

// My Profile API

app.get("/me", auth, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

app.put("/me", auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("name required");
    }

    const updateUser = await user
      .findByIdAndUpdate(req.user._id, { name }, { new: true })
      .select("-password");

    res.json(updateUser);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.patch("/users/:id/role", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user" , "admin"].includes(role)) {
      return res.send("incorrect Input");
    }
    const updatedRole = await user
      .findByIdAndUpdate(id, { role }, { new: true })
      .select("-password");
    res.json({
      messege: "role Updated",
      user: updatedRole,
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(3000, () => {
  console.log("server is running");
});
