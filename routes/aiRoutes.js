const express = require("express");
const { chatbot } = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/chat", authMiddleware, chatbot);

module.exports = router;