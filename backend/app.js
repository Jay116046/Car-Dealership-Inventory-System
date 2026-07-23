import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/auth/authRoute.js";
import connect_db from "./database-connection.js";
import userRoute from "./Routes/User/userRoute.js";
import adminRoute from "./Routes/Admin/vehiclesRoute.js";

const app = express();

connect_db();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/admin/vehicles',adminRoute);
app.use('/api/user/vehicles',userRoute);

export default app