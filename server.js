const app = require("./app");
const dotenv = require("dotenv").config;
const mongoose = require("mongoose");
dotenv({ path: "./config.env" });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Successfully connected with mongo DB");
  });

console.log(`Environment: ${process.env.NODE_ENV}`);

const port = 5500;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
