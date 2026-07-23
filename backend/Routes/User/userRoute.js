import express from "express"
import { getvehicles } from "../../Controller/admin-controller.js";
import { purchasevehicle } from "../../Controller/user-controller.js";

const userRoute = express.Router();

userRoute.get("/getList",getvehicles);
userRoute.post("/:id/purchase",purchasevehicle);

export default userRoute