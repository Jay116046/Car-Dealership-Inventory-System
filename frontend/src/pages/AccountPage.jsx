import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../store/orderSlice';
import Navbar from '../components/layout/Navbar';
import {
  Package,
  Calendar,
  CreditCard,
  Clock,
  Car,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const AccountPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} className="mr-1.5" /> Delivered
          </span>
        );
      case 'Ready for Pickup':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock size={12} className="mr-1.5" /> Ready for Pickup
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock size={12} className="mr-1.5" /> Processing
          </span>
        );
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Account & Orders</h1>
            <p className="text-slate-400 text-sm mt-1">
              Logged in as <span className="text-white font-medium">{user?.userName || user?.email}</span>
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 self-start"
          >
            <ShoppingBag size={16} />
            <span>Browse More Vehicles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Package size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-bold text-white mt-0.5">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Investment</p>
                <p className="text-2xl font-bold text-white mt-0.5">{formatPrice(totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Payment Protection</p>
                <p className="text-base font-semibold text-emerald-400 mt-0.5">PayPal Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center space-x-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && orders.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-6">
            <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <Car size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No vehicle purchases yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              When you purchase a vehicle from our showroom, your transaction history, order tracking, and receipt will appear here.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              <ShoppingBag size={16} />
              <span>Explore Showroom</span>
            </Link>
          </div>
        ) : (
          /* Orders Table */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Purchase History</h2>
              <span className="text-xs text-slate-400">{orders.length} transaction(s) recorded</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Progress Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {orders.map((order) => {
                    const vehicle = order.vehicle;
                    return (
                      <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="h-14 w-18 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/50">
                              <img
                                className="h-full w-full object-cover"
                                src={
                                  vehicle?.imageUrl ||
                                  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=200'
                                }
                                alt={vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle'}
                                onError={(e) => {
                                  e.target.src =
                                    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-white text-base">
                                {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle Archive'}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                {vehicle?.category ? (
                                  <span className="text-blue-400">{vehicle.category}</span>
                                ) : (
                                  'Archived Listing'
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-slate-300 font-mono">
                            ID: {order.paypalOrderId || order._id.slice(-8)}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">PayPal Order ID</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base font-bold text-white">{formatPrice(order.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              order.paymentStatus === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.progressStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                          <div className="flex items-center space-x-1.5">
                            <Calendar size={13} className="text-slate-500" />
                            <span>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Recently'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountPage;
