const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");

require("dotenv").config();

const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");

// MONGOOSE CONNECTION
mongoose
  .connect(process.env.MONGODB_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to database`))
  .catch((err) => console.error(err));

// EXPRESS SERVER INSTANCE
const app = express();

// CORS MIDDLEWARE SETUP
app.use(
  cors({
    credentials: true,
    origin: [],
  })
);

// SESSION MIDDLEWARE
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 30 * 24 * 60 * 60, // 30 days
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

// MIDDLEWARE
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTER
app.get("/", (req, res, next) => {
  console.log("Server is up and running");
  res.send("Server is up and running");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  console.log("No matching request :>> ");
  res.sendFile(__dirname + "/public/index.html");
});

// ERROR HANDLING
app.use((req, res, next) => {
  console.log("404");
  res.status(404).json({ code: "not found" }); // .send( JSON.stringify(  { code: 'not found' }  ) )
});

app.use((err, req, res, next) => {
  console.error("ERROR", req.method, req.path, err);

  if (!res.headersSent) {
    const statusError = err.status || "500";
    res.status(statusError).json(err);
  }
});

module.exports = app;
