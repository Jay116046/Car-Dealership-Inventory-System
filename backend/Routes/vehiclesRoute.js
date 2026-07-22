import express from "express"
import { addvehicle, deletevehicle, getvehicles, handleImageUpload, updatevehicle } from "../Controller/vehicles-controller.js";
import { upload } from "../helpers/cloudinary.js";

const vehiclesRoute = express.Router();

vehiclesRoute.post('/upload-image',upload.single("my_file"),handleImageUpload);

vehiclesRoute.get("/getList",getvehicles);
vehiclesRoute.post("/add",addvehicle);
vehiclesRoute.put("/update/:id",updatevehicle);
vehiclesRoute.delete("/delete/:id",deletevehicle);
// vehiclesRoute.get("/search",);


export default vehiclesRoute