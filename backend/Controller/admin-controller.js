import { imageUploadUtil } from '../helpers/cloudinary.js'
import Vehicle from "../Model/Vehicles.js"

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
        // console.log(err);

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
        // console.log(err);

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
        // console.log(err);

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

        const {
            image,
            make,
            model,
            category,
            price,
            quantity } = req.body;

        const findvehicle = await Vehicle.findById(id);

        if (!findvehicle) {
            return res.status(404).json({
                success: false,
                messege: "vehicle not found"
            })
        }

        findvehicle.image = image || findvehicle.image;
        findvehicle.make = make || findvehicle.make;
        findvehicle.model = model || findvehicle.model;
        findvehicle.category = category || findvehicle.category;
        findvehicle.price = Number(price) || findvehicle.price;
        findvehicle.quantity = Number(quantity) || findvehicle.quantity;

        await findvehicle.save();

        return res.status(200).json({
            success: true,
            messege: "vehicle successfully update",
            findvehicle
        })

    } catch (err) {
        console.log(err);

        return res.status(500).json({
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

// restock vehicle

export const reStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Must provide a valid positive amount to restock' });
        }

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        vehicle.quantity += amount;
        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: 'Vehicle restocked successfully',
            vehicle
        });

    } catch (error) {
        return res.status(500).json({ error: 'Server error processing restock' });
    }
}