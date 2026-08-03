import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles, addVehicle, updateVehicle, deleteVehicle, restockVehicle } from '../store/vehicleSlice';
import Navbar from '../components/layout/Navbar';
import VehicleTable from '../components/admin/VehicleTable';
import VehicleModal from '../components/admin/VehicleModal';
import RestockModal from '../components/admin/RestockModal';
import Button from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { list: vehicles, status, adminStatus } = useSelector((state) => state.vehicles);
  
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleAddClick = () => {
    setSelectedVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleRestockClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRestockModalOpen(true);
  };

  const handleDeleteClick = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
      const result = await dispatch(deleteVehicle(vehicle._id || vehicle.id));
      if (deleteVehicle.fulfilled.match(result)) {
        toast.success('Vehicle deleted successfully');
      } else {
        toast.error(result.payload || 'Failed to delete vehicle');
      }
    }
  };

  const handleSaveVehicle = async (vehicleData) => {
    let result;
    if (selectedVehicle) {
      result = await dispatch(updateVehicle({ id: selectedVehicle._id || selectedVehicle.id, data: vehicleData }));
      if (updateVehicle.fulfilled.match(result)) {
        toast.success('Vehicle updated successfully');
        setIsVehicleModalOpen(false);
      } else {
        toast.error(result.payload || 'Failed to update vehicle');
      }
    } else {
      result = await dispatch(addVehicle(vehicleData));
      if (addVehicle.fulfilled.match(result)) {
        toast.success('Vehicle added successfully');
        setIsVehicleModalOpen(false);
      } else {
        toast.error(result.payload || 'Failed to add vehicle');
      }
    }
  };

  const handleSaveRestock = async (amount) => {
    if (selectedVehicle) {
      const result = await dispatch(restockVehicle({ id: selectedVehicle._id || selectedVehicle.id, amount }));
      if (restockVehicle.fulfilled.match(result)) {
        toast.success('Vehicle restocked successfully');
        setIsRestockModalOpen(false);
      } else {
        toast.error(result.payload || 'Failed to restock vehicle');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Inventory Management</h1>
            <p className="text-slate-400">Add, edit, restock, or delete vehicles from the system.</p>
          </div>
          <Button onClick={handleAddClick} className="flex-shrink-0">
            <PlusCircle size={18} className="mr-2" />
            Add New Vehicle
          </Button>
        </div>

        {status === 'loading' && vehicles.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <VehicleTable 
            vehicles={vehicles}
            onEdit={handleEditClick}
            onRestock={handleRestockClick}
            onDelete={handleDeleteClick}
          />
        )}

        <VehicleModal
          isOpen={isVehicleModalOpen}
          onClose={() => setIsVehicleModalOpen(false)}
          vehicle={selectedVehicle}
          onSave={handleSaveVehicle}
          isSaving={adminStatus === 'loading'}
        />

        <RestockModal
          isOpen={isRestockModalOpen}
          onClose={() => setIsRestockModalOpen(false)}
          vehicle={selectedVehicle}
          onSave={handleSaveRestock}
          isSaving={adminStatus === 'loading'}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
