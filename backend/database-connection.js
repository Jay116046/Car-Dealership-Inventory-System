import mongoose from "mongoose";


const connect_db = () => {
    // const url = process.env.MONGODB_URL ;
    const url = "mongodb+srv://jayjethva116046_db_user:9HWiqdfXgnQj6XEQ@cluster0.vwdqfgk.mongodb.net/?appName=Cluster0" ;


    mongoose.connect(url).then(() =>
        console.log("___connected___")).catch((err)=>{
            console.log("error",err);
        })
}

export default connect_db