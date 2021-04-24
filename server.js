const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();

//handle cors
app.use(cors());

//set body parser
app.use(express.json());

//setup mongo_db connections for local and production builds
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

//TODO setup mongodb cluster and add MONGO_URL .env

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mongoDB = mongoose.connection;

  mongoDB.on("open", () => {
    console.log("MongoDB is connected");
  });
  mongoDB.on("error", (error) => {
    console.log(error);
  });
}

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

// TODO 

//load routers



//get static html and load it

app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "client/build, ", "index.html"));
});

//error handling

const handleError = require("./utils/ErrorHandler");

app.use((req, res, next) => {
  const error = new Error("Nothing here!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

//listen to local or production port
app.listen(port, () => {
  console.log({ port });
});
