const mongoose = require("mongoose");

const ListItemSchema = require("./ListItemSchema");
const ListOwner = require("./ListOwner");

const ListSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ListOwner",
  },
  listName: {
    type: String,
    required: true,
  },
  listItems: [ListItemSchema],
});

ListSchema.pre("save", async function (next) {
  const list = this;
  try {
    if (list.isNew) {
      const owner = await ListOwner.findById(list.owner);
      if (!owner) throw "no owner";
      owner.lists.push(list._id);
      await owner.save();
    }
    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});

ListSchema.methods.addItem = async function (item) {
  try {
    const list = this;
    list.listItems.push(item);
    await list.save();
    return list;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

ListSchema.methods.deleteItem = async function (itemId) {
  try {
    const list = this;
    list.listItems = list.listItems.filter((item) => {
      return item._id != itemId;
    });
    await list.save();
    return list;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

ListSchema.methods.takeItem = async function (itemId, userId) {
  try {
    const list = this;
    const item = list.listItems.id(itemId);
    if (!item) throw "No such item";
    item.taker = userId || null;
    await list.save();
    return item;
  } catch (error) {
    console.dir(error);
    throw error;
  }
};

ListSchema.methods.untakeItem = async function (itemId, userId) {
  try {
    const list = this;
    const item = list.listItems.id(itemId);
    if (!item) throw "No such item";
    item.taker = null;
    await list.save();
    return item;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const List = mongoose.model("List", ListSchema);

module.exports = List;
