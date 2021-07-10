const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const ownerRouter = require("./routes/owner.router");
const listsRouter = require("./routes/lists.router");
const callbackRouter = require("./routes/callback.router");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.router");

const app = express();
app.use(express.json());
app.use(cors());

const pubDir = path.join(__dirname, "./build");
app.use(express.static(pubDir));

require("./db/mongoose");

app.use("/api/owner", ownerRouter);
app.use("/api/lists", listsRouter);
app.use("/api/user", userRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/callback", callbackRouter);

app.use("/", (req, res) => {
  res.sendFile(path.join(pubDir, "index.html"));
});

// start listening
const port = process.env.PORT;
app.listen(port, () => console.log(`listening to port ${port}...`));
