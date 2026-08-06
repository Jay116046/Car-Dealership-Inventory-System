import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useDispatch } from 'react-redux';
import { createOrder } from '../store/orderSlice';
import { fetchVehicles } from '../store/vehicleSlice';
import { toast } from 'sonner';
import { X, ShieldCheck, Tag, Loader2, CreditCard } from 'lucide-react';

const CheckoutModal = ({ vehicle, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !vehicle) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleApprove = async (data, actions) => {
    setIsProcessing(true);
    try {
      const details = await actions.order.capture();
      const payerName = details?.payer?.name?.given_name || 'Customer';

      // Save order to our backend database
      const orderPayload = {
        vehicleId: vehicle._id || vehicle.id,
        paypalOrderId: data.orderID,
        amount: vehicle.price,
        paymentStatus: 'Completed',
      };

      const result = await dispatch(createOrder(orderPayload));

      if (createOrder.fulfilled.match(result)) {
        toast.success(`Payment confirmed! Thank you, ${payerName}.`);
        // Refresh inventory so stock updates dynamically in the UI
        dispatch(fetchVehicles());
        onClose();
      } else {
        toast.error(result.payload || 'Payment recorded with PayPal, but order sync failed.');
      }
    } catch (err) {
      console.error('PayPal capture error:', err);
      toast.error('Payment processing encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Express Checkout</h3>
              <p className="text-xs text-slate-400">Secure transaction powered by PayPal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Vehicle Summary Card */}
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="h-20 w-24 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
              <img
                src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=300'}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=300';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Tag size={10} className="mr-1" />
                  {vehicle.category}
                </span>
                <span className="text-xs text-slate-400">
                  {vehicle.quantity > 0 ? `${vehicle.quantity} available` : 'In stock'}
                </span>
              </div>
              <h4 className="font-bold text-white text-lg truncate mt-1">
                {vehicle.make} {vehicle.model}
              </h4>
              <p className="text-xl font-extrabold text-blue-400 mt-0.5">
                {formatPrice(vehicle.price)}
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-950/30 rounded-2xl p-4 border border-slate-800/80 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Vehicle Subtotal</span>
              <span className="text-slate-200">{formatPrice(vehicle.price)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimated Tax & Delivery</span>
              <span className="text-emerald-400 font-medium">Included</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-base">
              <span>Total Due</span>
              <span className="text-blue-400">{formatPrice(vehicle.price)}</span>
            </div>
          </div>

          {/* PayPal Buttons container */}
          <div className="relative">
            {isProcessing && (
              <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-slate-300">Finalizing your order...</p>
              </div>
            )}

            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 min-h-[140px] flex items-center justify-center">
              <div className="w-full">
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'rect', label: 'pay', height: 44 }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          description: `${vehicle.make} ${vehicle.model}`,
                          amount: {
                            value: vehicle.price.toString(),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={handleApprove}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    toast.error('PayPal checkout error. Please check credentials or try again.');
                  }}
                  onCancel={() => {
                    toast.info('Checkout cancelled');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>End-to-end encrypted transaction via PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
