const mongoose = require("mongoose");

const ListItemSchema = new mongoose.Schema({
  link: {
    type: String,
    trim: true,
    required: true,
  },
  imageLink: {
    type: String,
    trim: true,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  taker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ListOwner",
    default: null,
  },
});

module.exports = ListItemSchema;
