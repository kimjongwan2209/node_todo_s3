const express = require("express");
const membersRouter = require("./members");
const postRouter = require("./post");
const profileRouter = require("./profile");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser());
router.use("/", [membersRouter]);
router.use("/", [postRouter]);
router.use("/", [profileRouter]);

module.exports = router;
