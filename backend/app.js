import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/auth/authRoute.js";
import connect_db from "./database-connection.js";
import userRoute from "./Routes/User/userRoute.js";
import adminRoute from "./Routes/Admin/vehiclesRoute.js";
import orderRoute from "./Routes/order-routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connect_db();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/admin/vehicles',adminRoute);
app.use('/api/user/vehicles',userRoute);
app.use('/api/orders', orderRoute);

export default app