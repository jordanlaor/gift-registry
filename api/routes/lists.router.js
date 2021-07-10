const express = require("express");
const List = require("../models/List");
const ListOwner = require("../models/ListOwner");

const listsRouter = new express.Router();

listsRouter.get("/", async (req, res) => {
  try {
    const owner = req.header("Authorization").replace("Bearer ", "");
    const lists = await List.find({ owner });
    res.status(200).send(lists);
  } catch (error) {
    res.status(500).send(error);
  }
});

listsRouter.get("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send("List not found");
    await list.populate({ path: "owner", select: "name image" }).execPopulate();
    await list.populate({ path: "listItems", populate: { path: "taker" } }).execPopulate();
    res.status(200).send(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

listsRouter.delete("/:listId/:itemId", async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) res.status(404).send("List not found");
    const filtered = await list.deleteItem(req.params.itemId);
    res.status(200).send(filtered);
  } catch (error) {
    res.status(500).send(error);
  }
});

listsRouter.delete("/:id", async (req, res) => {
  try {
    const lists = await List.deleteOne({ _id: req.params.id }, { new: true });
    res.status(200).send(lists);
  } catch (error) {
    res.status(500).send(error);
  }
});

listsRouter.put("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) res.status(404).send("List not found");
    const listItems = await list.addItem(req.body);
    res.status(201).send(listItems);
  } catch (error) {
    res.status(500).send(error);
  }
});

listsRouter.patch("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) res.status(404).send("List not found");
    const listItem = await list.takeItem(req.body.itemId, req.body.userId);
    res.status(201).send(listItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = listsRouter;
