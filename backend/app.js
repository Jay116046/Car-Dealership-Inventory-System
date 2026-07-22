import express from "express"
import authRoute from "./Routes/authRoute.js";
import connect_db from "./database-connection.js";
import vehiclesRoute from "./Routes/vehiclesRoute.js";

const app = express();

connect_db();

app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/vehicles',vehiclesRoute);


export default app