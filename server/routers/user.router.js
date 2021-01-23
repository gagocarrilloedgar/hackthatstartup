const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Job = require("../models/jobs.model");
const User = require("../models/user.model");

const { isLoggedIn, isNotLoggedIn } = require("../helpers/middlewares");

router.get("/", (req, res) => {
  console.log("Server is up and running");
  res.send("Server is up and running");
});

router.get("/jobs", (req, res, next) => {
  console.log("Getting user's Jobs");

  const { userId } = req.body;

  User.findById(userId)
    .populate("jobs")
    .then((foundUser) => {
      res.status(200).json(foundUser.jobs);
    })
    .catch((err) => {
      next(createError(err));
    });
});

router.post("/jobs", isLoggedIn, (req, res, next) => {
  console.log("Creating user's job");
  const {
    title,
    type,
    company,
    location,
    current,
    headline,
    description,
    startDateM,
    startDateY,
    userId,
  } = req.body;

  Job.create({
    title,
    type,
    company,
    location,
    current,
    headline,
    description,
    startDateM,
    startDateY,
    userId,
  })
    .then((newJob) => {
      User.findById(userId)
        .then((user) => {
          const jobs = user.jobs;
          console.log("jobs :>> ", jobs);
          jobs.push(newJob._id);
          User.findByIdAndUpdate(userId, { jobs }, { new: true })
            .then((userModified) => {
              res.status(201).json(newJob);
            })
            .catch((err) => {
              console.log("err :>> ", err);
              next(createError(err));
            });
        })
        .catch((err) => {
          console.log("err :>> ", err);
          next(createError(err));
        });
    })
    .catch((err) => {
      console.log("err :>> ", err);
      next(createError(err));
    });
});

router.delete("/jobs", (req, res) => {
  const { jobId, userId } = req.body;
  console.log("Deleting user's job ", jobId, "UserId", userId);
  Job.findByIdAndDelete(jobId)
    .then((jobDeleted) => {
      User.findById(userId)
        .then((user) => {
          console.log("jobDeleted._id", jobDeleted._id);
          const jobs = user.jobs.filter(
            (job) => String(job) !== String(jobDeleted._id)
          );
          console.log("jobs :>> ", jobs);
          User.findByIdAndUpdate(userId, { jobs }, { new: true })
            .then((updatedUser) => {
              res.status(201).json(updatedUser);
            })
            .catch((err) => {
              console.log("err :>> ", err);
              next(createError(err));
            });
        })
        .catch((err) => {
          console.log("err :>> ", err);
          next(createError(err));
        });
    })
    .catch((err) => {
      console.log("err :>> ", err);
      next(createError(err));
    });
});

router.put("/jobs", (req, res) => {
  console.log("Modifying user's job");
});

module.exports = router;
