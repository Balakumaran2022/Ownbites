import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOutletStore } from '../store/useOutletStore';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Card } from '../components/ui/Card';
import { Outlet } from '../models';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    categories, outlets, loadingCategories, loadingOutlets, 
    fetchCategories, fetchOutlets 
  } = useOutletStore();

  const [pauseMarquee, setPauseMarquee] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchOutlets();
  }, [fetchCategories, fetchOutlets]);

  const handleSelectOutlet = (outlet: Outlet) => {
    if (outlet.isOpen) {
      navigate('/products');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden h-64 md:h-96 shadow-lg group">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80" alt="Delicious Food" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">Craving Something <span className="text-primary">Special?</span></h1>
          <p className="text-lg text-gray-200 mb-6 max-w-xl font-medium drop-shadow-md">Get the best dishes from top restaurants delivered straight to your door in minutes.</p>
          <Link to="/products" className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold w-max shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1">Explore Menu</Link>
        </div>
      </section>

      {/* Quick Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">What's on your mind?</h2>
        </div>
        
        <div 
          className="relative w-full overflow-hidden pb-4" 
          onMouseEnter={() => setPauseMarquee(true)} 
          onMouseLeave={() => setPauseMarquee(false)}
        >
          {loadingCategories ? (
            <div className="flex gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[100px]">
                  <SkeletonLoader type="circle" widthClass="w-24" heightClass="h-24" />
                  <SkeletonLoader widthClass="w-16" heightClass="h-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex gap-6 w-max animate-marquee ${pauseMarquee ? 'paused' : ''}`}>
              {/* Render twice for seamless loop */}
              {[...categories, ...categories].map((cat, idx) => (
                <Link 
                  key={`${cat.id}-${idx}`} 
                  to={`/products?category=${cat.id}`} 
                  className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-2 relative">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors text-center px-1 truncate w-24">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nearby Outlets */}
      <section>
        <h2 className="text-2xl font-bold text-secondary mb-6">Top Restaurants near you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingOutlets ? (
            [1,2,3].map((i) => (
              <Card key={i} padding={false}>
                <SkeletonLoader widthClass="w-full" heightClass="h-48" />
                <div className="p-4 space-y-3">
                  <SkeletonLoader widthClass="w-3/4" heightClass="h-6" />
                  <SkeletonLoader widthClass="w-1/2" heightClass="h-4" />
                </div>
              </Card>
            ))
          ) : (
            outlets.map((outlet) => (
              <Card 
                key={outlet.id} 
                hoverable 
                padding={false} 
                className="overflow-hidden cursor-pointer" 
                onClick={() => handleSelectOutlet(outlet)}
              >
                <div className="relative h-48">
                  <img src={outlet.imageUrl} alt={outlet.name} className="w-full h-full object-cover" />
                  {!outlet.isOpen && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-lg tracking-wide">{outlet.overrideMessage || 'Closed'}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 text-green-700 shadow-sm">
                    ⭐ {outlet.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-secondary mb-1">{outlet.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">⏱️ {outlet.deliveryTime} mins</span>
                    <span className="flex items-center gap-1">📍 {outlet.distance} km</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
      
      <style>{`
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee.paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
      `}</style>
    </div>
  );
};
