const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const passwordStrength = require("check-password-strength");

const saltRounds = 10;
const User = require("../models/user.model");

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLogin,
} = require("../helpers/middlewares");

router.get("/all", (req, res, next) => {
  console.log("Getting all users :>> ");
  User.find()
    .then((users) => {
      res
        .status(201) // Created
        .json(users); // res.send()
    })
    .catch((err) => {
      next(createError(err));
    });
});

router.post("/signup", isNotLoggedIn, (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;
  console.log("HERE :>> ");
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        return next(createError(400)); // Bad Request
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        if (passwordStrength(password).value === "Weak") {
          next(createError("Weak Password"));
        } else {
          const encryptedPassword = bcrypt.hashSync(password, salt);
          User.create({
            username,
            email,
            password: encryptedPassword,
            firstName,
            lastName,
            jobs: [],
            studies: [],
          })
            .then((createdUser) => {
              createdUser.password = "*";
              req.session.currentUser = createdUser;

              res
                .status(201) // Created
                .json(createdUser); // res.send the user created
            })
            .catch((err) => {
              next(createError(err));
            });
        }
      }
    })
    .catch((err) => {
      next(createError(err));
    });
});

router.post("/login", isNotLoggedIn, validationLogin, (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(createError(404)); // Not Found
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password); //  true/false

      if (passwordIsValid) {
        user.password = "*";
        req.session.currentUser = user;

        res.status(200).json(user);
      } else {
        next(createError(401)); // Unathorized
      }
    })
    .catch((err) => {
      next(createError(err));
    });
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }

    res
      .status(204) //  No Content
      .send();
  });
});

router.get("/me", isLoggedIn, (req, res, next) => {
  currentUserSessionData = req.session.currentUser;

  res.status(200).json(currentUserSessionData);
});

module.exports = router;
