import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

// app.get("/",(req,res)=>{
//     res.send("server created");
// })

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Local server running'));
}

module.exports = app;