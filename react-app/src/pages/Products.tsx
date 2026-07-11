import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { Card } from '../components/ui/Card';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Button } from '../components/ui/Button';
import { Product } from '../models';
import { twMerge } from 'tailwind-merge';

export const Products: React.FC = () => {
  const { products, loading, getProductsByOutlet } = useProductStore();
  const { addToCart } = useCartStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    // In a real app we might pass the outlet ID or category ID to the API.
    getProductsByOutlet('all');
  }, [getProductsByOutlet]);

  const filteredProducts = categoryId 
    ? products.filter(p => p.categoryId === categoryId)
    : products;

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail if button is clicked inside a link block (though our markup is separated)
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-secondary">Our Menu</h1>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          <button 
            onClick={() => setViewMode('grid')} 
            className={twMerge('p-2 rounded hover:bg-gray-50 transition-colors', viewMode === 'grid' ? 'bg-orange-50 text-primary' : 'text-gray-400')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={twMerge('p-2 rounded hover:bg-gray-50 transition-colors', viewMode === 'list' ? 'bg-orange-50 text-primary' : 'text-gray-400')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Card key={i} padding={false}>
              <SkeletonLoader widthClass="w-full" heightClass="h-48" />
              <div className="p-4 space-y-3">
                <SkeletonLoader widthClass="w-3/4" heightClass="h-6" />
                <SkeletonLoader widthClass="w-1/4" heightClass="h-4" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
          {filteredProducts.map(product => (
            <Card key={product.id} padding={false} hoverable className={twMerge('overflow-hidden group flex', viewMode === 'list' ? 'flex-row h-40' : 'flex-col')}>
              <div className={viewMode === 'list' ? 'w-40 h-full shrink-0 relative' : 'relative h-48 w-full'}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur p-1 rounded shadow-sm">
                  <div className={twMerge('w-4 h-4 border-2 flex items-center justify-center', product.isVeg ? 'border-green-600' : 'border-red-600')}>
                    <div className={twMerge('w-2 h-2 rounded-full', product.isVeg ? 'bg-green-600' : 'bg-red-600')}></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <Link to={`/product/${product.id}`} className="text-lg font-bold text-secondary cursor-pointer hover:text-primary transition-colors block">
                    {product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-secondary">₹{product.price}</span>
                      {product.originalPrice && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
                    </div>
                  </div>
                  <Button variant="primary" onClick={(e) => handleAddToCart(product, e)}>Add</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
