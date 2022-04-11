const express = require("express");
const router = express.Router();
//const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../middlewares/jwtverify");

const User = require("../models/userSchema");
router.get("/", (req, res) => {
  res.send("this is hi from auth route");
});
//setting up the sign up functin
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    res.send("fill all the details");
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        res.send("the user is alreadu exists");
      } else {
        //const salt = bcrypt.genSalt()

        const user = new User({
          name: name,
          email: email,
          password: password,
        });
        user
          .save()
          .then((msg) => {
            res.status(202).send("user added succesfuly");
          })
          .catch((err) => {
            res.send(err);
          });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(420).send("fill all the details");
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).send("the user does not exists");
    }

    if (password == savedUser.password) {
      // res.status(200).send("user login sucessfully")
      //insteade of sending the loginn msg we are generating the jwt token
      const { name, _id, email } = savedUser;
      const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_KEY);
      res.json({ token, user: { name, _id, email } });
    }
  });
});

module.exports = router;
