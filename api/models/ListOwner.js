const mongoose = require("mongoose");
const validator = require("validator");

const ListOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw `${value} is not a valid email`;
    },
  },
  image: {
    type: String,
    default:
      "https://s3.getstickerpack.com/storage/uploads/sticker-pack/cut-the-rope-christmas-edition/sticker_3.png?c102632f5bbb0a9c00834ff38e7acbb1",
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

const ListOwner = mongoose.model("ListOwner", ListOwnerSchema);

module.exports = ListOwner;
