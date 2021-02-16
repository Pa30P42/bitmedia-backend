const express = require("express");
const catchAsync = require("../helpers/catchAsync");
const { getUsers, getUserById } = require("./users.controllers");
const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  res.end("[]");
});
usersRouter.get("/users", catchAsync(getUsers));
usersRouter.get("/users/user/:user_id", catchAsync(getUserById));

module.exports = usersRouter;
