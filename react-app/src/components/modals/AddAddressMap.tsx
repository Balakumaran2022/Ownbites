import React from 'react';

interface AddAddressMapProps {
  onClose: () => void;
}

export const AddAddressMap: React.FC<AddAddressMapProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6">
        <h2>Map Placeholder</h2>
        <button onClick={onClose} className="mt-4 text-orange-500">Close</button>
      </div>
    </div>
  );
};
