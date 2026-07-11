import React, { useState } from 'react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-xl z-50 flex items-center gap-4">
      <span className="text-sm">We use cookies.</span>
      <button onClick={() => setVisible(false)} className="bg-orange-500 px-3 py-1 rounded text-sm">OK</button>
    </div>
  );
};
