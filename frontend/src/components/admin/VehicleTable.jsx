import { Edit2, PackagePlus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const VehicleTable = ({ vehicles, onEdit, onRestock, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700">
              <th className="px-6 py-4 text-sm font-semibold text-slate-300">Image</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-300">Vehicle</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-300">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-300">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-300">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id || vehicle.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-16 rounded overflow-hidden bg-slate-800">
                    <img 
                      src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=100'} 
                      alt="vehicle" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=100';
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white">{vehicle.make}</div>
                  <div className="text-sm text-slate-400">{vehicle.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {vehicle.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {formatPrice(vehicle.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.quantity > 0 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {vehicle.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(vehicle)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2 h-8"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRestock(vehicle)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10 px-2 h-8"
                      title="Restock"
                    >
                      <PackagePlus size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(vehicle)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 h-8"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {vehicles.length === 0 && (
        <div className="p-12 text-center text-slate-400">
          No vehicles in inventory.
        </div>
      )}
    </div>
  );
};

export default VehicleTable;
