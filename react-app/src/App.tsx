import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/modals/LoginModal';
import { AddressSelectionModal } from './components/modals/AddressSelectionModal';
import { AddAddressMap } from './components/modals/AddAddressMap';
import { CookieConsent } from './components/ui/CookieConsent';
import { useCustomerStore } from './store/useCustomerStore';
import { useAddressStore } from './store/useAddressStore';

// Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';

export const App = () => {
  const { currentUser, initialize: initCustomer } = useCustomerStore();
  const { currentAddress, loadAddress } = useAddressStore();
  
  const [showMap, setShowMap] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    initCustomer();
    loadAddress();
  }, [initCustomer, loadAddress]);

  const hasAccess = currentUser && currentAddress;

  return (
    <BrowserRouter>
      {/* Main Layout */}
      <div 
        style={{ display: !hasAccess ? 'none' : 'flex' }}
        className={`min-h-screen flex flex-col bg-background ${(showAddressModal || showMap) ? 'blur-sm pointer-events-none' : ''}`}
      >
        <Header onChangeAddress={() => setShowAddressModal(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={currentUser ? <Checkout /> : <Navigate to="/" />} />
            <Route path="/orders" element={currentUser ? <Orders /> : <Navigate to="/" />} />
            <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Gate 1: Not Logged In */}
      {!currentUser && (
        <>
          <div className="fixed inset-0 bg-white z-40"></div>
          <LoginModal onClose={() => {}} />
        </>
      )}

      {/* Gate 2: Logged In, but No Address Selected */}
      {currentUser && !currentAddress && (
        <>
          <div className="fixed inset-0 bg-orange-50 bg-gradient-to-br from-orange-50 to-orange-100 z-40"></div>
          {!showMap && (
            <AddressSelectionModal 
              onClose={() => {}} 
              onOpenMap={() => setShowMap(true)} 
            />
          )}
          {showMap && (
            <AddAddressMap onClose={() => setShowMap(false)} />
          )}
        </>
      )}

      {/* Gate 3: Changing Address from Header */}
      {currentUser && currentAddress && (
        <>
          {showAddressModal && (
            <AddressSelectionModal 
              allowClose
              onClose={() => setShowAddressModal(false)}
              onOpenMap={() => { setShowAddressModal(false); setShowMap(true); }}
            />
          )}
          {showMap && (
            <AddAddressMap onClose={() => setShowMap(false)} />
          )}
        </>
      )}

      <CookieConsent />
    </BrowserRouter>
  );
};

export default App;
