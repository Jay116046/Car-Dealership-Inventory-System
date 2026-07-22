import express from "express"
import authRoute from "./Routes/authRoute.js";
import connect_db from "./database-connection.js";

const app = express();

connect_db();

app.use(express.json());

app.use('/api/auth',authRoute);

export default app