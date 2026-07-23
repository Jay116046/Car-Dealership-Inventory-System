import express from "express"
import { addvehicle, deletevehicle, getvehicles, handleImageUpload, reStock, updatevehicle } from "../../Controller/admin-controller.js";
import { upload } from "../../helpers/cloudinary.js";
import { adminOnly, authmiddleware } from "../../Controller/auth-controller.js";

const adminRoute = express.Router();

adminRoute.post('/upload-image', authmiddleware, adminOnly, upload.single("my_file"), handleImageUpload);
adminRoute.get("/getList", getvehicles);
adminRoute.post("/add", authmiddleware, adminOnly, addvehicle);
adminRoute.put("/update/:id", authmiddleware, adminOnly, updatevehicle);
adminRoute.delete("/delete/:id", authmiddleware, adminOnly, deletevehicle);
adminRoute.post("/restock/:id", authmiddleware, adminOnly, reStock);

export default adminRoute