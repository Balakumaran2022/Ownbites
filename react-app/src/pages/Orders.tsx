import React, { useEffect } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { Card } from '../components/ui/Card';

export const Orders: React.FC = () => {
  const { orders, getOrders } = useOrderStore();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-secondary mb-8">My Orders</h1>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-300">
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-secondary">No Orders Yet</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't placed any orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id} padding>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Order ID: #{order.id}</div>
                <div className="text-sm font-medium text-secondary mt-1">{new Date(order.date).toLocaleString()}</div>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Ready' ? 'bg-orange-100 text-primary' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-600">{item.quantity}x</span>
                  <span className="text-secondary flex-1">{item.product.name}</span>
                  <span className="text-gray-500">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Total Paid ({order.paymentMode})</span>
              <span className="font-bold text-lg text-secondary">₹{order.summary.total.toFixed(2)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
