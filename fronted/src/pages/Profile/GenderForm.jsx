import React, { useState } from 'react';
import { Loader } from 'lucide-react';

const GenderForm = ({ initialValue = '', onSubmit, onCancel, isLoading }) => {
  const [gender, setGender] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(gender);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Gender
        </label>
        <div className="space-y-2">
          {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                value={option}
                checked={gender === option}
                onChange={(e) => setGender(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
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
          disabled={isLoading || !gender}
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

export default GenderForm;