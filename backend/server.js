import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

// app.get("/",(req,res)=>{
//     res.send("server created");
// })

app.listen(process.env.PORT || 3000);
