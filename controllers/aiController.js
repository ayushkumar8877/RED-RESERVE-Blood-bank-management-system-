const axios = require("axios");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");

exports.chatbot = async (req, res) => {
  try {
    const { message, userId, role } = req.body;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "UserId missing",
      });
    }

    // 🩸 STOCK CALCULATION
    const bloodData = await Inventory.aggregate([
      {
        $match: {
          organisation: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$bloodGroup",
          totalIn: {
            $sum: {
              $cond: [{ $eq: ["$inventoryType", "in"] }, "$quantity", 0],
            },
          },
          totalOut: {
            $sum: {
              $cond: [{ $eq: ["$inventoryType", "out"] }, "$quantity", 0],
            },
          },
        },
      },
    ]);

    const stock = bloodData.map((item) => ({
      bloodGroup: item._id,
      available: item.totalIn - item.totalOut,
    }));

    // 🚨 LOW STOCK CHECK
    const lowStock = stock.filter((item) => item.available < 50);

    // 🧠 ROLE PROMPT
    let rolePrompt = "";

    if (role === "admin") {
      rolePrompt =
        "You are an AI for ADMIN. Give analytics, stock insights, and management suggestions.";
    } else if (role === "organisation") {
      rolePrompt =
        "You are an AI for BLOOD BANK ORGANISATION. Help manage inventory and blood availability.";
    } else if (role === "donar") {
      rolePrompt =
        "You are an AI for BLOOD DONOR. Answer eligibility, donation gap, and health related queries.";
    } else if (role === "hospital") {
      rolePrompt =
        "You are an AI for HOSPITAL. Help find available blood and guide for blood requests.";
    } else {
      rolePrompt = "You are a Blood Bank AI assistant.";
    }

    // 🤖 AI CALL
    const aiRes = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `
${rolePrompt}

Language Rule:
- Detect user's language automatically.
- Reply in the same language (Hindi or English).

Low Stock Rule:
- If any blood group is below 50 units, mention it as LOW STOCK.

Answer Rules:
- Keep reply short
- Use bullet points if needed
- Be user friendly

Available Blood Stock:
${JSON.stringify(stock)}

User Question:
${message}
      `,
      stream: false,
    });

    res.send({
      success: true,
      reply: aiRes.data.response.trim(),
      lowStock, // 🔥 frontend ke liye
    });
  } catch (error) {
    console.log("AI ERROR ❌", error);
    res.status(500).send({
      success: false,
      message: "Local AI Error",
    });
  }
};