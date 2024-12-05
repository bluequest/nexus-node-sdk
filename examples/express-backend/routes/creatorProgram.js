const express = require("express");
const router = express.Router();
const creatorProgramController = require("../controllers/creatorProgramController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { route } = require("./auth");

router.get(
  "/validate-code/:code",
  verifyToken,
  creatorProgramController.validateCode
);

router.get(
  "/get-all-members",
  verifyToken,
  creatorProgramController.getAllMembers
);

module.exports = router;
