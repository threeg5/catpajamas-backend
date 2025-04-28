import express from "express";
import cors from "cors";
import OpenAI from "openai";
import axios from "axios"; // <- New: We'll use axios to fetch the image
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store latest image in memory temporarily
let latestImageBuffer = null;

app.get("/generate-nft", async (req, res) => {
  try {
    const response = await openai.images.create({
      model: "dall-e-3",
      prompt: "A cartoonish cat wearing vibrant, gaudy pajamas in a circular logo design...",
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    // Fetch image using server-side request
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    latestImageBuffer = imageResponse.data;

    res.json({ message: "NFT image generated successfully." });
  } catch (error) {
    console.error("Error generating NFT:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve the latest image
app.get("/latest-nft", (req, res) => {
  if (!latestImageBuffer) {
    return res.status(404).send("No NFT generated yet.");
  }

  res.set("Content-Type", "image/png");
  res.send(latestImageBuffer);
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
