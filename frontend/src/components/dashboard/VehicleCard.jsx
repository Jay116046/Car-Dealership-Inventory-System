import Button from '../ui/Button';
import { Tag, CheckCircle2, XCircle } from 'lucide-react';

const VehicleCard = ({ vehicle, onPurchase, isPurchasing }) => {
  const isOutOfStock = vehicle.quantity === 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col h-full relative">
      {/* Stock badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-slate-950/60 border border-slate-700/50">
        {isOutOfStock ? (
          <>
            <XCircle size={14} className="text-red-400" />
            <span className="text-red-400">Out of Stock</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-green-400">{vehicle.quantity} Left</span>
          </>
        )}
      </div>

      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
        <img
          src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 ${
            isOutOfStock ? 'grayscale opacity-70' : ''
          }`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">
              {vehicle.make} {vehicle.model}
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Tag size={12} className="mr-1" />
                {vehicle.category}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-400">Price</p>
            <p className="text-2xl font-bold text-white">{formatPrice(vehicle.price)}</p>
          </div>
          <Button
            variant="primary"
            disabled={isOutOfStock || isPurchasing}
            onClick={() => onPurchase(vehicle)}
            className={`w-32 ${isOutOfStock ? 'bg-slate-700 hover:bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' : ''}`}
            isLoading={isPurchasing}
          >
            {isOutOfStock ? 'Sold Out' : 'Purchase'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
