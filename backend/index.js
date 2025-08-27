import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./config/connectDB.js"
import cookieParser from "cookie-parser"
import locationRouter from "./routes/location.routes.js"
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
app.use("/api/locations", locationRouter);
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
          systemInstruction: `You are "Krishi Sahayak," an expert AI assistant from [Your Website/Company Name], created specifically to help farmers in India. Your name means "Agriculture Helper," and your only purpose is to provide friendly and reliable guidance.

          *Your Core Instructions:*

          1.  *Persona Lock:* You are *Krishi Sahayak*, not an AI, LLM, or a model from Google.
              * *ABSOLUTE RULE:* You must NEVER reveal that you are a large language model or mention your real developers.
              * If asked "Who are you?" or "Who made you?", you must answer: "I am Krishi Sahayak, your digital farming assistant from कृषिSarthi."

          2.  *Strict Knowledge Domain:* Your conversations are STRICTLY limited to the following topics:
              * Agriculture & Farming Techniques (e.g., crop cycles, sowing methods)
              * Crop Management (e.g., specific advice for wheat, rice, vegetables)
              * Soil Health, Fertilizers, and Pesticides
              * Irrigation and Water Management
              * Livestock and Animal Husbandry
              * Food Technology and Post-Harvest Management
              * Rural Development and Government Schemes for farmers
              * Help navigating the कृषिSarthi website.

          3.  *Polite Refusal:*
              * For any question outside your Knowledge Domain (e.g., politics, movies, general trivia, personal advice), you MUST politely refuse. Respond with: "Maaf kijiye, main keval kheti-kisani aur gramin vikas se jude sawalon ka jawab de sakta hoon. Yeh vishay meri jaankari se bahar hai." or "I'm sorry, I can only answer questions related to agriculture and rural development. This topic is outside my expertise."
              * For any illegal, unethical, or harmful questions, immediately and firmly refuse with: "Main is vishay mein aapki sahayata nahi kar sakta." or "I cannot assist with this request." Do not lecture or explain why.

          4.  *Communication Style:*
              * *Language: Always reply in the same language as the user's question eg: (English, Hindi, or Hinglish).*
              * *Tone:* Be polite, supportive, and farmer-friendly. Use simple words.
              * *Format:* Keep answers short, clear, and easy to understand. Use bullet points or numbered lists for instructions.
          5. do not use special while like * while replying to user instead use points
          Your goal is to be a trustworthy and helpful friend to the farmer. Always stay in character.
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
    res.status(500).json({ reply: "Sorry, I couldn’t process your request right now." });
  }
});


const ai2 = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });
const history = []


app.post("/api/gemini", async (req, res) => {
  try {
    const { diseaseName } = req.body;
    if (!diseaseName) {
      return res.status(400).json({ reply: "No disease name provided" });
    }

    // Add user message to history
    history.push({
      role: "user",
      parts: [{ text: `Provide information about the crop disease "${diseaseName}" strictly in English.

          First, describe the disease briefly in one or two sentences.

          Then, under the heading Organic Measures, list organic ways to prevent it. Each method should be on a separate line without any symbols, numbering, or extra formatting.

          Next, under the heading Chemical Measures, list chemical ways to prevent it. Each method should be on a separate line, including the specific chemicals, without any symbols, numbering, or extra formatting.

          The answer should be short, concise, to the point, and strictly in plain text.

          format is like :
          Organic Measures
          method1
          method2

          Chemical Measures
          method1
          method2

        ` }]
    });

    // Generate content using Gemini
    const response = await ai2.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        systemInstruction: `
          You are "Krishi Sahayak," an expert AI assistant for farmers in India. 
          Answer only agriculture-related queries. 
          Language: Reply in the same language as the user's query. 
          Be polite, short, and provide clear steps for disease management and prevention.
           `
      }
    });

    const botReply = response.text;

    // Add bot reply to history
    history.push({
      role: "model",
      parts: [{ text: botReply }]
    });

    res.json({ text: botReply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ text: "Sorry, I couldn’t fetch disease info right now." });
  }
});


const ai3 = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY3 });

app.post("/api/get-crop-data", async (req, res) => {
  try {
    const { soilData } = req.body;
    if (!soilData) {
      return res.status(400).json({ error: "No soil data provided" });
    }

    // Prepare prompt for Gemini
    const prompt = `
      At the top, under the heading Recommended Crop, give the single most suitable crop.

Below that, list other suitable crops in short, concise bullet points.

The answer should be to the point, in English, without any special symbols or extra text.

Ensure the recommendations are based entirely on the soil properties provided.

      Soil Data: ${JSON.stringify(soilData)}
    `;

    const response = await ai3.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        systemInstruction: "You are Krishi Sahayak, an AI assistant for farmers in India. Give clear crop recommendations based on soil data.",
      },
    });

    const recommendation = response.text;
    res.json({ recommendation });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to fetch crop recommendation" });
  }
});




const SOILGRID_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query";

app.get("/api/soil", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "lat and lon are required." });
    }
    try {
        const properties = ['phh2o', 'soc', 'nitrogen', 'cec', 'clay', 'silt', 'sand'];
          const propertyParams = properties.map(p =>` property=${p}`).join('&');
          const url = `${SOILGRID_URL}?lon=${lon}&lat=${lat}&${propertyParams}`;
          
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data from SoilGrids API.");
        }
        const soilData = await response.json();
        res.json({ soil: soilData });
    } catch (err) {
        console.error("Backend /api/soil error:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});



app.listen(port , ()=>{
    connectDB()
    console.log(`server is running on port ${port}`);
    
})



