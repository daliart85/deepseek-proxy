
// خادم Node.js وسيط للاتصال بـ DeepSeek وتجنب CORS
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.DEEPSEEK_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { prompt } = req.body;

  if (!API_KEY || !prompt) {
    return res.status(400).json({ error: "API Key or prompt missing" });
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ result: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Invalid response from DeepSeek", raw: data });
    }
  } catch (error) {
    console.error("Error contacting DeepSeek:", error);
    res.status(500).json({ error: "Failed to contact DeepSeek" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
