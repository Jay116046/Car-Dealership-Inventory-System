import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect_db = () => {
    const url = process.env.MONGODB_URL ;

    mongoose.connect(url).then(() =>
        console.log("___connected___")).catch((err)=>{
            // console.log("error",err);
        })
}

export default connect_db