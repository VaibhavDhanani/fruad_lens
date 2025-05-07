import React, { useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

const PanCardForm = ({ initialValue = '', onSubmit, onCancel, isLoading }) => {
  const [panCard, setPanCard] = useState(initialValue);
  const [error, setError] = useState('');

  const validatePanCard = (value) => {
    // PAN card validation - Format: AAAPA1234A
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!value) {
      return 'PAN card number is required';
    }
    
    if (!panRegex.test(value)) {
      return 'Invalid PAN card format. Format should be AAAPA1234A';
    }
    
    return '';
  };

  const handleChange = (e) => {
    // Convert to uppercase
    const value = e.target.value.toUpperCase();
    setPanCard(value);
    
    // Clear error when user starts typing again
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationError = validatePanCard(panCard);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onSubmit(panCard);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label 
          htmlFor="panCard" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          PAN Card Number
        </label>
        <input
          type="text"
          id="panCard"
          value={panCard}
          onChange={handleChange}
          maxLength={10}
          placeholder="AAAPA1234A"
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          disabled={isLoading}
        />
        {error && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Format: AAAPA1234A (where 'P' indicates individual status)
        </p>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={14} className="animate-spin mr-1" />
              Updating...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default PanCardForm;