import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./config/connectDB.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import bodyParser from "body-parser"
import {GoogleGenAI} from "@google/genai"
import fetch from "node-fetch"
dotenv.config()



const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(bodyParser.json());
app.use("/api",authRouter)
app.get("/",(req,res) =>{
    res.send("Server is running")
})

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let History = [];

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    History.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `You are "Krishi Sahayak" – a friendly chatbot for an agriculture website.

        - Reply in the same language as the farmer’s question (English, Hindi, or Hinglish).
        - Provide simple farming guidance, website help, and crop tips.
        - Keep answers short and easy to understand.
        - Be polite, supportive, and farmer-friendly.
        `,
      }
    });

    const botReply = response.text;

    History.push({
      role: "model",
      parts: [{ text: botReply }]
    });

    res.json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "⚠️ Sorry, I couldn’t process your request right now." });
  }
});

const SOILGRID_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query";

app.get("/api/soil", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required." });
  }

  try {
    const url = `${SOILGRID_URL}?lon=${lon}&lat=${lat}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ error: "SoilGrids API error." });
    }

    const soilData = await response.json();
    res.json({ soil: soilData });
  } catch (err) {
    console.error("Backend error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});


app.listen(port , ()=>{
    connectDB()
    console.log(`server is running on port ${port}`);
    
})
