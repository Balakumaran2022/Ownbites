import React, { useState, useEffect, useRef } from 'react';
import { useCustomerStore } from '../../store/useCustomerStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  
  const { login, verifyOtp, loading, error } = useCustomerStore();

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleRequestOtp = async () => {
    if (phone.length !== 10) return;
    setLocalError('');
    try {
      await login(phone);
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      // error is handled by store and useEffect
    }
  };

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);
  };

  const handleOtpKeydown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const isOtpValid = otpValues.every(val => val.length === 1);

  const handleVerifyOtp = async () => {
    if (!isOtpValid) return;
    setLocalError('');
    const otp = otpValues.join('');
    try {
      await verifyOtp(phone, otp);
      onClose();
    } catch (err) {
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-orange-50/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity">
      <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-[2.5rem] w-full max-w-[420px] overflow-hidden shadow-2xl shadow-orange-900/10 animate-fade-in-up relative p-10 border border-white/60">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-orange-400 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-full"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 overflow-hidden relative z-10 border border-orange-300/50 transform group-hover:scale-105 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            </div>
          </div>
          
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-extrabold text-2xl mb-1 tracking-tight">OwnBites</h1>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back!</h2>
          <p className="text-gray-500 mb-10 font-medium text-center">Enter your WhatsApp number to continue</p>
        </div>

        {step === 'phone' && (
          <div className="space-y-5">
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase ml-1">WhatsApp Number</label>
            <div className={twMerge(
              'relative flex items-center bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm',
              localError ? 'border-red-400 shadow-red-100' : 'border-gray-100 hover:border-orange-200 focus-within:border-orange-500 focus-within:shadow-orange-100 focus-within:shadow-md'
            )}>
              <div className="flex items-center px-4 py-4 bg-gray-50 text-gray-600 font-bold border-r border-gray-100">
                <span className="text-xs uppercase mr-1">IN</span> +91 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 ml-1 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setLocalError(''); }}
                placeholder="Enter number" 
                className="w-full bg-white pl-4 pr-4 py-4 outline-none text-gray-800 font-bold text-lg placeholder-gray-300"
                maxLength={10}
              />
            </div>
            
            {localError && (
              <div className="flex items-center gap-1.5 text-red-500 text-sm font-semibold mt-2 ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {localError}
              </div>
            )}

            <button 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
              disabled={phone.length !== 10 || loading} 
              onClick={handleRequestOtp}
            >
              <span className="text-lg tracking-wide">{loading ? 'Sending...' : 'Get OTP'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-8 animate-fade-in">
            <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase text-center mb-4">Enter 6-Digit OTP</label>
            <div className="flex justify-center gap-2 px-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input 
                  key={i}
                  ref={(el) => otpRefs.current[i] = el}
                  type="text" 
                  value={otpValues[i]}
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-extrabold text-orange-600 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 shadow-sm hover:border-orange-200"
                  onChange={(e) => handleOtpInput(e, i)}
                  onKeyDown={(e) => handleOtpKeydown(e, i)}
                />
              ))}
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
              disabled={!isOtpValid || loading} 
              onClick={handleVerifyOtp}
            >
              <span className="text-lg tracking-wide">{loading ? 'Verifying...' : 'Verify OTP'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            
            <div className="text-center mt-6">
              <button onClick={() => setStep('phone')} className="text-orange-500 text-sm font-bold hover:text-orange-600 hover:underline transition-colors">
                Change WhatsApp Number
              </button>
            </div>
            
            {localError && (
              <div className="flex items-center justify-center gap-1 text-red-500 text-sm font-medium mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {localError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
