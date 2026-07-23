import express from "express"
import { addvehicle, deletevehicle, getvehicles, handleImageUpload, updatevehicle } from "../../Controller/admin-controller.js";
import { upload } from "../../helpers/cloudinary.js";

const adminRoute = express.Router();

adminRoute.post('/upload-image',upload.single("my_file"),handleImageUpload);

adminRoute.get("/getList",getvehicles);
adminRoute.post("/add",addvehicle);
adminRoute.put("/update/:id",updatevehicle);
adminRoute.delete("/delete/:id",deletevehicle);
// adminRoute.get("/search",);

// adminRoute.post("/:id/restock/",);


export default adminRoute