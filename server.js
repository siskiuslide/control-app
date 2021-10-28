const app = require("./app");
const dotenv = require("dotenv").config;
const mongoose = require("mongoose");
dotenv({ path: "./config.env" });

const DB = "mongodb+srv://jake:wRX7o8hn6vr0mneK@control.ezphf.mongodb.net/controlDatabase?retryWrites=true&w=majority";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("successfully connected with mongo DB");
  });

console.log(`Environment: ${process.env.NODE_ENV}`);

const port = 5500;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
