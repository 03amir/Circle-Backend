const express = require("express");
const app = express();
require("dotenv").config();
var cors = require("cors");
app.use(cors());

//requiring the jsn for getting data from the body this is have to be in the top level
app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect(process.env.URI, () => {
  console.log("connected to the database");
});

//requiring the auth route
const authRouter = require("./routes/aut");
app.use(authRouter);
const postRouter = require("./routes/post");
app.use(postRouter);

//requreing the  schema
const user = require("./models/userSchema");
const post = require("./models/postSchema");

//Normal Routes
app.get("/", (req, res) => {
  res.status(200).send("hello from the server");
});

//Running the server on the port
app.listen( 9000, () => {
  console.log("serveer is running on port 8000");
});
