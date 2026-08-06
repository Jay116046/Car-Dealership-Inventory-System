import React from 'react';
import { Calendar, User, Package, Clock, CheckCircle2 } from 'lucide-react';

const AdminOrderTable = ({ orders, onUpdateStatus, isUpdating }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const statusOptions = ['Processing', 'Ready for Pickup', 'Delivered'];

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Progress Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {orders.map((order) => {
              const vehicle = order.vehicle;
              const customer = order.user;

              return (
                <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        {customer?.userName ? customer.userName[0].toUpperCase() : <User size={16} />}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {customer?.userName || 'Customer'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {customer?.email || 'No email provided'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-14 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        <img
                          src={
                            vehicle?.imageUrl ||
                            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=100'
                          }
                          alt="vehicle"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Archived Vehicle'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ID: {order.paypalOrderId || order._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-white">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.progressStatus || 'Processing'}
                      onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                      disabled={isUpdating}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      <span>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="p-12 text-center text-slate-400">
          <Package className="mx-auto w-10 h-10 text-slate-600 mb-2" />
          <p>No customer orders have been placed yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrderTable;
