import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../Controller/order-controller.js';
import { authmiddleware, adminOnly } from '../Controller/auth-controller.js';

const router = express.Router();

// User routes
router.post('/', authmiddleware, createOrder);
router.get('/my-orders', authmiddleware, getUserOrders);

// Admin routes
router.get('/all', authmiddleware, adminOnly, getAllOrders);
router.put('/:orderId/status', authmiddleware, adminOnly, updateOrderStatus);

export default router;
