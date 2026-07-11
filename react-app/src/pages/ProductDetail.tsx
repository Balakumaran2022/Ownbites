import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { environment } from '../environment';
import { Button } from '../components/ui/Button';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { twMerge } from 'tailwind-merge';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { productDetail, loadingDetail, getProductById } = useProductStore();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      getProductById(id, environment.outletId);
    }
  }, [id, getProductById]);

  const handleAddToCart = () => {
    if (productDetail) {
      // Logic for quantity is simulated since cartStore mock assumes quantity=1 in addToCart
      // In a real app we'd dispatch quantity too, but we follow the mock for now.
      addToCart(productDetail);
    }
  };

  if (loadingDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader heightClass="h-8" widthClass="w-48" className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SkeletonLoader heightClass="aspect-square" widthClass="w-full" />
          <div className="space-y-4">
            <SkeletonLoader heightClass="h-10" widthClass="w-3/4" />
            <SkeletonLoader heightClass="h-24" widthClass="w-full" />
            <SkeletonLoader heightClass="h-12" widthClass="w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  const p = productDetail;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>&rsaquo;</span>
        <Link to="/products" className="hover:text-primary transition-colors">Menu</Link>
        <span>&rsaquo;</span>
        <span className="text-secondary font-medium">{p.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden aspect-square shadow-md border border-gray-100">
            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-gray-100 pb-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-secondary">{p.name}</h1>
              <div className={twMerge('w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-2', p.isVeg ? 'border-green-600' : 'border-red-600')}>
                <div className={twMerge('w-2.5 h-2.5 rounded-full', p.isVeg ? 'bg-green-600' : 'bg-red-600')}></div>
              </div>
            </div>
            <p className="text-gray-500 text-lg mb-4">{p.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-secondary">₹{p.price}</span>
              {p.originalPrice && <span className="text-lg text-gray-400 line-through">₹{p.originalPrice}</span>}
              {p.discount && <span className="bg-orange-100 text-primary px-2 py-1 rounded text-sm font-bold">{p.discount}% OFF</span>}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-secondary mb-4">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-primary hover:bg-orange-100 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                </button>
                <span className="font-bold text-xl text-secondary w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-primary hover:bg-orange-100 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                In Stock
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
            <Button variant="outline" className="flex-1 text-lg py-3">Favorite</Button>
            <Button variant="primary" className="flex-1 text-lg py-3" onClick={handleAddToCart}>Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
