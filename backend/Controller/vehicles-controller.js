import Vehicle from "../Model/Vehicles.js";
import { imageUploadUtil } from '../helpers/cloudinary.js'



export const handleImageUpload = async (req, res) => {
    // console.log(req.file.buffer);

    if (!req.file) {
        res.json({
            success: false,
            messege: "no image provided"
        })
    }

    try {

        const result = await imageUploadUtil(req.file.buffer);

        // console.log(result);

        res.status(200).json({
            success: true,
            message: "successfully add",
            result
        })

    } catch (err) {
        console.log(err);

        res.json({
            success: false,
            message: "error"
        })

    }
}

// add new vehicle
export const addvehicle = async (req, res) => {

    try {
        const {
            image,
            make,
            model,
            category,
            price,
            quantity } = req.body;

        const newlyAddvehicle = new Vehicle({
            image,
            make,
            model,
            category,
            price,
            quantity
        })

        await newlyAddvehicle.save()

        res.status(201).json({
            success: true,
            messege: "vehicle successfully add",
            newlyAddvehicle
        })

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            messege: "error"
        })
    }
}

// fetch all vehicles
export const getvehicles = async (req, res) => {

    try {

        const getvehicles = await Vehicle.find({})

        res.status(200).json({
            success: true,
            messege: "get vehicles successfully ",
            data: getvehicles
        })

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            messege: "error"
        })
    }
}

// edit vehicle
export const updatevehicle = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id,req.params,"object id is this");

        const {
            image,
            make,
            model,
            category,
            price,
            quantity } = req.body;

        const findvehicle = await Vehicle.findById(id);
        // console.log(findvehicle);


        if (!findvehicle) {
            res.status(404).json({
                success: true,
                messege: "vehicle not found"
            })
        }

        findvehicle.make = make || findvehicle.make
        findvehicle.model = model || findvehicle.model
        findvehicle.category = category || findvehicle.category
        findvehicle.price = price === '' ? 0 : price || findvehicle.price

        findvehicle.save();

        res.status(200).json({
            success: true,
            messege: "vehicle successfully update",
            findvehicle
        })

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            messege: "error"
        })
    }
}

// delete vehicles
export const deletevehicle = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await Vehicle.findByIdAndDelete({ _id: id });

        if (!result) {
            res.status(404).json({
                success: true,
                messege: "vehicle is not found"
            })
        }

        res.status(200).json({
            success: true,
            messege: "vehicle successfully deleted"
        })

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            messege: "error"
        })
    }
}