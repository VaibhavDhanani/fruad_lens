import React, { useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const MpinInput = ({ mpin, setMpin, inputRefs }) => {
  const handleMpinChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newMpin = [...mpin];
      newMpin[index] = value;
      setMpin(newMpin);

      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newMpin = [...mpin];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newMpin[i] = pastedData[i];
      }
      setMpin(newMpin);
      
      if (pastedData.length < 6 && inputRefs.current[pastedData.length]) {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-medium text-gray-800">Secure MPIN</h3>
        </div>
        
        <p className="text-center text-sm text-gray-600 mb-4">
          Create a 6-digit MPIN for your wallet access
        </p>
        
        <div className="flex space-x-3 justify-center">
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
              onPaste={handlePaste}
              className="w-12 h-14 text-xl font-semibold text-center bg-white border-2 border-gray-300 rounded-lg 
                shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all
                hover:border-blue-400"
              aria-label={`MPIN digit ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MpinInput;