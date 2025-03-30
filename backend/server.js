import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import todoRoutes from "./Routes/todoRoutes.js"
import connectDB from "./connectDB.js"

dotenv.config();
const app=express();     


const PORT=process.env.PORT || 5000;
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());


// app.post("/todos",todoRoutes);

app.use("/todos",todoRoutes);
app.listen(PORT,(req,res)=>{        
    console.log(`app is listening on the port ${PORT}`);
}) 