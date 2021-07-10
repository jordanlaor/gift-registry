const express = require("express");
const List = require("../models/List");
const ListItem = require("../models/ListItemSchema");
const ListOwner = require("../models/ListOwner");

const callbackRouter = new express.Router();

callbackRouter.post("/", async (req, res) => {
  try {
    const url = req.query.redirect.replace(/\/$/, "") + `?token=${req.body.connection_token}&page=${req.query.page}`;
    res.cookie("user_token", req.body.connection_token, { maxAge: 60000 * 60 * 24 });
    res.redirect(url);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = callbackRouter;
