import Vehicle from "../Model/Vehicles.js";


// purchase vehicle
export const purchasevehicle = async (req, res) => {

    try {
        const { id } = req.params;

        const findvehicle = await Vehicle.findById(id);

        if (!findvehicle) {
            res.status(404).json({
                success: false,
                messege: "vehicle not found",
            })
        }

        if (findvehicle.quantity <= 0) {
            return res.status(400).json({ error: 'This vehicle is currently out of stock' });
        }

        findvehicle.quantity -= 1;

        await findvehicle.save();

        res.status(201).json({
            success: true,
            messege: "vehicle successfully add",
            findvehicle
        })

    } catch (err) {
        // console.log(err);

        res.status(500).json({
            success: false,
            messege: "error"
        })
    }
}