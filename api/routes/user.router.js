const express = require("express");
const Oneall = require("oneall");
require("dotenv").config();

const ListOwner = require("../models/ListOwner");

const userRouter = new express.Router();

userRouter.get("/:token", async (req, res) => {
  try {
    const oneall = new Oneall({
      endpoint: "https://final-project-gift-registry.api.oneall.com",
      publickey: "e0fab417-8ea0-4d10-99ee-284dc2139dd6",
      privatekey: process.env.ONEALL_PRIVATE,
    });
    oneall.connection.get(req.params.token, async function (err, data, fullData) {
      if (err) {
        throw err;
      }
      let user = await ListOwner.findOne({ email: fullData.response.result.data.user.identity.emails[0].value });
      if (!user) {
        try {
          user = new ListOwner({
            name: fullData.response.result.data.user.identity.displayName,
            firstName: fullData.response.result.data.user.identity.name.givenName,
            email: fullData.response.result.data.user.identity.emails[0].value,
            image: fullData.response.result.data.user.identity.pictureUrl,
          });
          console.log(user);
          await user.save();
        } catch (error) {
          throw error;
        }
      }
      res.status(200).send(user);
    });
    // const { data } = await axios.get(`https://final-project-gift-registry.api.oneall.com/connections/${req.params.token}.json`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = userRouter;
