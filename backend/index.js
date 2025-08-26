import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./config/connectDB.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import bodyParser from "body-parser"
dotenv.config()

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(bodyParser.json());
app.use("/api",authRouter)
app.get("/",(req,res) =>{
    res.send("Server is running")
})

app.listen(port , ()=>{
    connectDB()
    console.log(`server is running on port ${port}`);
    
})
