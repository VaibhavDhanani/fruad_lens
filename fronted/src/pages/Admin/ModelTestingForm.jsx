import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MODEL_TYPES, DEFAULT_FORM_DATA, FIELD_TO_MODEL_MAP } from './types';

const ModelTestingForm = ({ onSubmit, testMode, selectedModel, isLoading }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const shouldShowField = (field) => {
    if (testMode === 'all') {
      return true;
    }
    
    return selectedModel ? FIELD_TO_MODEL_MAP[field].includes(selectedModel) : false;
  };

  const renderInput = (field, label, options = {}) => {
    const { type = 'number', min, max, step, options: selectOptions } = options;
    
    if (!shouldShowField(field)) return null;
    
    return (
      <div className="transition-all duration-300 transform hover:scale-[1.01]">
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        {type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field}
              checked={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
            />
            <label htmlFor={field} className="ml-2 block text-sm text-gray-700">
              {formData[field] ? 'Yes' : 'No'}
            </label>
          </div>
        ) : type === 'select' ? (
          <select
            id={field}
            value={formData[field]}
            onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            {selectOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'range' ? (
          <div>
            <input
              type="range"
              id={field}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
              min={min || 0}
              max={max || 1}
              step={step || 0.01}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{min || 0}</span>
              <span>{formData[field].toFixed(2)}</span>
              <span>{max || 1}</span>
            </div>
          </div>
        ) : (
          <input
            type={type}
            id={field}
            value={formData[field]}
            onChange={(e) => {
              const value = type === 'number' 
                ? (step && step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value)) 
                : e.target.value;
              handleInputChange(field, value);
            }}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Common Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderInput('ip_address_flag', 'IP Address Flag (1-3)', { 
            type: 'select', 
            options: [
              { value: 1, label: 'Low Risk (1)' },
              { value: 2, label: 'Medium Risk (2)' },
              { value: 3, label: 'High Risk (3)' }
            ]
          })}
          {renderInput('previous_fraudulent_activity', 'Previous Fraudulent Activity', { type: 'checkbox' })}
          {renderInput('daily_transaction_count', 'Daily Transaction Count', { min: 0 })}
          {renderInput('failed_transaction_count_7d', 'Failed Transactions (Last 7 Days)', { min: 0 })}
          {renderInput('transaction_distance', 'Transaction Distance (km)', { step: 0.1, min: 0 })}
        </div>
      </div>

      {/* Mayank model parameters */}
      {(testMode === 'all' || selectedModel === MODEL_TYPES.XGB_11) && (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">XGB 11 Model Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput('account_age', 'Account Age (days)', { min: 1 })}
            {renderInput('is_weekend', 'Is Weekend', { type: 'checkbox' })}
            {renderInput('is_night', 'Is Night', { type: 'checkbox' })}
            {renderInput('time_since_last_transaction', 'Time Since Last Transaction (minutes)', { min: 0 })}
            {renderInput('distance_avg_transaction_7d', 'Average Distance (Last 7 Days) (km)', { step: 0.1, min: 0 })}
            {renderInput('transaction_to_balance_ratio', 'Transaction to Balance Ratio', { 
              type: 'range', 
              min: 0, 
              max: 1, 
              step: 0.01 
            })}
          </div>
        </div>
      )}

      {/* Yash Amount model parameters */}
      {(testMode === 'all' || selectedModel === MODEL_TYPES.XGB_12) && (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">XGB 12 Model Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput('transaction_amount', 'Transaction Amount', { step: 0.01, min: 0 })}
            {renderInput('avg_transaction_amount_7d', 'Average Transaction Amount (Last 7 Days)', { step: 0.01, min: 0 })}
            {renderInput('avg_transaction_distance', 'Average Transaction Distance (km)', { step: 0.1, min: 0 })}
            {renderInput('monthly_transaction_count', 'Monthly Transaction Count', { min: 0 })}
            {renderInput('transaction_location_flag', 'Transaction Location Flag', { type: 'checkbox' })}
            {renderInput('suspicious_ip_flag', 'Suspicious IP Flag', { type: 'checkbox' })}
            {renderInput('multiple_account_login', 'Multiple Account Login Count', { min: 1, max: 50 })}
          </div>
        </div>
      )}

      {/* Yash Ratio model parameters */}
      {(testMode === 'all' || selectedModel === MODEL_TYPES.XGB_9) && (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">XGB 9 Model Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput('transaction_amount_ratio', 'Transaction Amount Ratio', { 
              type: 'range', 
              min: 0, 
              max: 5, 
              step: 0.1 
            })}
            {renderInput('failed_transaction_rate', 'Failed Transaction Rate', { 
              type: 'range', 
              min: 0, 
              max: 1, 
              step: 0.01 
            })}
            {renderInput('transaction_distance_ratio', 'Transaction Distance Ratio', { 
              type: 'range', 
              min: 0, 
              max: 5, 
              step: 0.1 
            })}
            {renderInput('transaction_count_ratio', 'Transaction Count Ratio', { 
              type: 'range', 
              min: 0, 
              max: 5, 
              step: 0.1 
            })}
            
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            px-6 py-3 bg-blue-600 text-white font-medium rounded-md 
            flex items-center space-x-2 shadow-sm 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 transition-all duration-300
            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md transform hover:-translate-y-1'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span>Test {testMode === 'all' ? 'All Models' : 'Selected Model'}</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ModelTestingForm;