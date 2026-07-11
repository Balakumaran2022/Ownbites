import React, { useState, useEffect } from 'react';
import { useAddressStore } from '../../store/useAddressStore';
import { useCustomerStore } from '../../store/useCustomerStore';
import { Address } from '../../models';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface AddressSelectionModalProps {
  onClose: () => void;
  onOpenMap?: () => void;
  allowClose?: boolean;
}

export const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({ 
  onClose, 
  onOpenMap,
  allowClose = false 
}) => {
  const { savedAddresses, currentAddress, loading, getAddresses, selectAddress, loadAddress } = useAddressStore();
  const { currentUser } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddr, setSelectedAddr] = useState<Address | null>(currentAddress);
  const [addresses, setAddresses] = useState<Address[]>(savedAddresses);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location access granted:', position.coords);
        },
        (error) => {
          console.warn('Location access denied or unavailable', error);
        }
      );
    }
    
    if (currentUser?.phone) {
      getAddresses(currentUser.phone).then(res => {
        setAddresses(res && res.length > 0 ? res : savedAddresses);
      });
    } else {
      setAddresses(savedAddresses);
    }
  }, [currentUser, getAddresses, savedAddresses]);

  useEffect(() => {
    setSelectedAddr(currentAddress);
  }, [currentAddress]);

  const filteredAddresses = addresses.filter(a => 
    a.street.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedAddr) {
      selectAddress(selectedAddr);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in-up relative flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
          {allowClose && (
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved addresses..." 
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Address List */}
          {!loading && (
            <div className="space-y-3">
              {filteredAddresses.map(address => (
                <div 
                  key={address.id}
                  onClick={() => setSelectedAddr(address)}
                  className={twMerge(
                    'border rounded-xl p-4 cursor-pointer transition-all duration-200',
                    selectedAddr?.id === address.id ? 'border-orange-500 bg-orange-50/50 shadow-sm' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  )}>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-full text-orange-500 mt-1 flex-shrink-0">
                      {address.type === 'Home' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                      )}
                      {address.type === 'Office' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                        </svg>
                      )}
                      {address.type === 'Other' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded uppercase mb-1">{address.type}</span>
                      <p className="text-sm text-gray-700 leading-snug">{address.street}, {address.city}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 self-center">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              ))}

              {filteredAddresses.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No addresses found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
          <button 
            disabled={!selectedAddr}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:shadow-none hover:-translate-y-0.5 flex items-center justify-center shadow-lg shadow-orange-500/30">
            Submit Address
          </button>
          
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">Want to deliver somewhere else? </span>
            <button onClick={onOpenMap} className="text-orange-500 hover:text-orange-600 text-sm font-bold flex items-center justify-center gap-1 mx-auto mt-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Address
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
