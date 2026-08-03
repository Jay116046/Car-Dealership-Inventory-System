import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RestockModal = ({ isOpen, onClose, vehicle, onSave, isSaving }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && Number(amount) > 0) {
      onSave(Number(amount));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setAmount('');
        onClose();
      }}
      title="Restock Vehicle"
    >
      <div className="mb-4">
        <p className="text-sm text-slate-300">
          How many units of <span className="font-semibold text-white">{vehicle?.make} {vehicle?.model}</span> would you like to add?
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Current stock: {vehicle?.quantity}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Amount to add"
          type="number"
          min="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 10"
          className="mb-6"
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={() => {
            setAmount('');
            onClose();
          }}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            Restock
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RestockModal;
