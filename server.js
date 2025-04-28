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
    const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A highly detailed, digitally illustrated realistic cat with a symmetrical face and a slightly mischievous expression, wearing vibrant, gaudy pajamas inside a circular logo design. The pajamas should feature bold patterns such as polka dots, stripes, and stars, with bright and saturated colors (neon blues, pinks, yellows, greens, oranges).The cat's face should be symmetrically split into two distinct color schemes to emphasize contrast, with one side featuring a warmer orange/yellow hue and the other side a cooler blue/purple hue. The eyes should be large, expressive, and glowing in an animated style. The cats ears should be tall and pointed, with fur details visible under the pajama hood. The circular logo border should feature bold geometric elements such as stars, stripes, and dots, adding depth and a neon-style glow effect. The background inside the circle should contain a gradient of warm and cool colors, making the cat stand out. At the bottom of the circular logo, there should be a separate, well-defined banner area specifically designed for text placement. The banner should be curved to naturally align with the circular logo, have a thick border, and contain a clear, readable, uppercase text that says: 'CAT PAJAMAS'. The text should be bold, in a 3D animated style with thick outlines and multicolored shading that matches the vibrant theme of the logo. The text must be fully integrated and 100% correctly spelled as 'CAT PAJAMAS'. The banner should have a solid background color with contrasting text to ensure high readability. The text should not be distorted, randomly altered, or replaced with incorrect characters. If the text cannot be included, mkae the eyes GLOWING RED. This design should be a clean, structured logo where the cat is the central focus, the text banner is naturally integrated at the bottom, and the overall style remains fun, eye-catching, and meme-friendly.",
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
