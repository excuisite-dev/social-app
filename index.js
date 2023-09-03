const express   = require("express");
const mongoose  = require("mongoose");
const helmet    = require("helmet");
const dotenv    = require("dotenv");
const morgan    = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const app       = express();

// DOTENV //
  dotenv.config();
  mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true,useUnifiedTopology: true});

// middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));

  app.get("/", (req, res) => {
      res.send("welcome to homepage");
  });

  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/posts", postRoute);

  app.listen(1111, () => {
      console.log("Server is running");
  });