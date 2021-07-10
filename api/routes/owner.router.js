const express = require("express");
const List = require("../models/List");
const ListItem = require("../models/ListItemSchema");
const ListOwner = require("../models/ListOwner");

const ownerRouter = new express.Router();

ownerRouter.post("/lists", async (req, res) => {
  try {
    const list = new List(req.body);
    await list.save();
    res.status(201).send(list);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = ownerRouter;
