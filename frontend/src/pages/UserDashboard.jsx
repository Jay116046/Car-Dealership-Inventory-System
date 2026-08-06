import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles, purchaseVehicle } from '../store/vehicleSlice';
import Navbar from '../components/layout/Navbar';
import VehicleCard from '../components/dashboard/VehicleCard';
import FilterBar from '../components/dashboard/FilterBar';
import CheckoutModal from '../components/CheckoutModal';
import { toast } from 'sonner';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { list: vehicles, status, purchaseStatus } = useSelector((state) => state.vehicles);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortByPrice: '',
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handlePurchase = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsCheckoutOpen(true);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        const matchesSearch =
          vehicle.make.toLowerCase().includes(filters.search.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category ? vehicle.category === filters.category : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (filters.sortByPrice === 'asc') return a.price - b.price;
        if (filters.sortByPrice === 'desc') return b.price - a.price;
        return 0;
      });
  }, [vehicles, filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Available Inventory</h1>
          <p className="text-slate-400">Browse our premium selection of vehicles.</p>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} />

        {status === 'loading' && vehicles.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-xl text-slate-400">No vehicles match your search criteria.</p>
            <button
              onClick={() => setFilters({ search: '', category: '', sortByPrice: '' })}
              className="mt-4 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id || vehicle.id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
                isPurchasing={false}
              />
            ))}
          </div>
        )}

        <CheckoutModal
          vehicle={selectedVehicle}
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedVehicle(null);
          }}
        />
      </main>
    </div>
  );
};

export default UserDashboard;
