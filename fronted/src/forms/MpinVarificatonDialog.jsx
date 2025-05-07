import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import LoadingDots from '../pages/LoadingDots';

const MpinVerificationDialog = ({ onConfirm, onCancel, isVerifying }) => {
    const [mpin, setMpin] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
  
    useEffect(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
  
    const handleMpinChange = (e, index) => {
      const value = e.target.value;
      if (/^[0-9]?$/.test(value)) {
        const newMpin = [...mpin];
        newMpin[index] = value;
        setMpin(newMpin);
  
        if (value && index < 5 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    };
  
    const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && !mpin[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const mpinString = mpin.join('');
      if (mpinString.length < 6) {
        setError('Please enter your complete 6-digit MPIN');
        return;
      }
      
      // Clear MPIN immediately for security
      setMpin(['', '', '', '', '', '']);
      
      // Call the confirm function
      onConfirm(mpinString);
    };
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Verify Transaction</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Please enter your 6-digit MPIN to confirm this transaction
              </p>
              <div className="flex justify-center space-x-3">
                {mpin.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMpinChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-14 text-xl font-semibold text-center bg-white border-2 border-gray-300 rounded-lg 
                      shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all
                      hover:border-blue-400"
                    disabled={isVerifying}
                    aria-label={`MPIN digit ${i + 1}`}
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
  
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
                disabled={isVerifying}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isVerifying ? (
                  <>
                    <LoadingDots color="white" />
                    <span className="ml-2">Verifying...</span>
                  </>
                ) : (
                  'Confirm Transaction'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default MpinVerificationDialog;