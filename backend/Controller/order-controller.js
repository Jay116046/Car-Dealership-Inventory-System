import Order from '../Model/Order.js';
import Vehicle from '../Model/Vehicles.js';

// Create a new order (called after frontend captures payment)
export const createOrder = async (req, res) => {
    try {
        const { vehicleId, paypalOrderId, amount, paymentStatus } = req.body;
        const userId = req.user.id;

        // Verify vehicle exists and is in stock
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        if (vehicle.quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Vehicle out of stock' });
        }

        // Create the order
        const newOrder = new Order({
            user: userId,
            vehicle: vehicleId,
            paypalOrderId,
            amount,
            paymentStatus: paymentStatus || 'Completed',
            progressStatus: 'Processing'
        });

        await newOrder.save();

        // Decrement vehicle stock
        vehicle.quantity -= 1;
        await vehicle.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: newOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all orders for the logged-in user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate('vehicle')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Admin: Get all orders from all buyers
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'userName email')
            .populate('vehicle', 'make model price imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Admin: Update order progress status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { progressStatus } = req.body;

        const validStatuses = ['Processing', 'Ready for Pickup', 'Delivered'];
        if (!validStatuses.includes(progressStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.progressStatus = progressStatus;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
