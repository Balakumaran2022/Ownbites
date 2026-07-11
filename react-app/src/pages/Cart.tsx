import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Cart: React.FC = () => {
  const { cartItems, cartSummary, updateQuantity } = useCartStore();
  const summary = cartSummary();

  const increaseQuantity = (item: any) => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const decreaseQuantity = (item: any) => {
    updateQuantity(item.product.id, item.quantity - 1);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-secondary mb-8">Your Cart</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-gray-300">
              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our top restaurants and dishes!</p>
          <Link to="/products">
            <Button variant="primary">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-secondary mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product.id} padding className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-bold text-secondary">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
                  <div className="font-bold text-secondary mt-1">₹{item.product.price}</div>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <button onClick={() => decreaseQuantity(item)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-100 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                  </button>
                  <span className="font-bold text-secondary w-4 text-center">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-100 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24" padding>
            <h2 className="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            
            {/* Coupon Section */}
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Enter coupon code" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm uppercase" />
              <Button variant="outline">Apply</Button>
            </div>

            {/* Bill Details */}
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium text-secondary">₹{summary.subtotal.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Item Discount</span>
                  <span className="font-medium">-₹{summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes (5%)</span>
                <span className="font-medium text-secondary">₹{summary.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-medium text-secondary">₹{summary.deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span>Packaging Charge</span>
                <span className="font-medium text-secondary">₹{summary.packageCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-secondary pt-2">
                <span>To Pay</span>
                <span>₹{summary.total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block w-full">
              <Button variant="primary" fullWidth>Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
