import express from "express"
import authRoute from "./Routes/authRoute.js";

const app = express();

app.use(express.json());

app.use('/api/auth',authRoute);

export default app