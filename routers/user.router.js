const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Job = require("../models/jobs.model");
const Study = require("../models/studies.model");
const User = require("../models/user.model");

const { isLoggedIn, isNotLoggedIn } = require("../helpers/middlewares");

/// JOBS ////
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
    jobId,
  } = req.body;

  Job.findByIdAndUpdate(
    jobId,
    {
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
    },
    { new: true }
  )
    .then((modifiedJob) => {
      res.status(201).json(modifiedJob);
    })
    .catch((err) => {
      console.log("err :>> ", err);
      next(createError(err));
    });
});

// STUDIES ///

router.get("/studies", (req, res, next) => {
  console.log("Getting user's Studies");

  const { userId } = req.body;

  User.findById(userId)
    .populate("studies")
    .then((foundUser) => {
      foundUser.studies.length
        ? res.status(200).json(foundUser.studies)
        : res.status(200).json([]);
    })
    .catch((err) => {
      next(createError(err));
    });
});

router.post("/studies", isLoggedIn, (req, res, next) => {
  console.log("Creating user's job");
  const {
    school,
    degree,
    fieldOfStudy,
    grade,
    startDateM,
    startDateY,
    userId,
  } = req.body;

  Study.create({
    school,
    degree,
    fieldOfStudy,
    grade,
    startDateM,
    startDateY,
    userId,
  })
    .then((newStudy) => {
      User.findById(userId)
        .then((user) => {
          const studies = user.studies;
          console.log("studies :>> ", studies);
          studies.push(newStudy._id);
          User.findByIdAndUpdate(userId, { studies }, { new: true })
            .then((userModified) => {
              res.status(201).json(newStudy);
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

router.delete("/studies", (req, res) => {
  const { studyId, userId } = req.body;
  console.log("Deleting user's study ", studyId, "UserId", userId);
  Study.findByIdAndDelete(studyId)
    .then((studyDeleted) => {
      User.findById(userId)
        .then((user) => {
          const studies = user.jobs.filter(
            (study) => String(study) !== String(studyDeleted._id)
          );
          console.log("studies :>> ", studies);
          User.findByIdAndUpdate(userId, { studies }, { new: true })
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

router.put("/studies", (req, res) => {
  const {
    school,
    degree,
    fieldOfStudy,
    grade,
    startDateM,
    startDateY,
    userId,
    studyId,
  } = req.body;
  console.log("Modifying use " + userId + " study " + studyId);

  Study.findByIdAndUpdate(
    studyId,
    {
      school,
      degree,
      fieldOfStudy,
      grade,
      startDateM,
      startDateY,
      userId,
    },
    { new: true }
  )
    .then((modifiedStudy) => {
      res.status(201).json(modifiedStudy);
    })
    .catch((err) => {
      console.log("err :>> ", err);
      next(createError(err));
    });
});

module.exports = router;
