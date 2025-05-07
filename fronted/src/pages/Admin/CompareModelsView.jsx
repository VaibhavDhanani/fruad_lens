import React, { useState } from 'react';
import { BarChart3, TrendingUp, Filter, Download } from 'lucide-react';

const CompareModelsView = ({ results }) => {
  const [sortBy, setSortBy] = useState('model_name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Extract model results into a clean array for sorting/displaying
  const modelsArray = Object.entries(results).map(([modelType, data]) => ({
    modelType,
    ...data
  }));
  
  // Sort the models based on current sort settings
  const sortedModels = [...modelsArray].sort((a, b) => {
    // Handle string vs number sorting
    if (sortBy === 'model_name') {
      return sortDirection === 'asc' 
        ? a.model_name.localeCompare(b.model_name)
        : b.model_name.localeCompare(a.model_name);
    } else {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });
  
  // Handle sort column click
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if same column clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Format probability for display
  const formatProbability = (probability) => {
    if (probability < 0.0001) {
      return probability.toExponential(4);
    }
    return (probability * 100).toFixed(4) + '%';
  };
  
  // Get color for fraud probability cell
  const getProbabilityColor = (probability) => {
    if (probability > 0.7) return 'text-red-600 bg-red-50';
    if (probability > 0.3) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="font-semibold text-gray-900">Model Comparison</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter</span>
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
            <Download className="h-4 w-4 mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('model_name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <span>Model</span>
                  {sortBy === 'model_name' && (
                    <TrendingUp 
                      className={`h-3.5 w-3.5 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('is_fraud')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <span>Prediction</span>
                  {sortBy === 'is_fraud' && (
                    <TrendingUp 
                      className={`h-3.5 w-3.5 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('probability')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <span>Probability</span>
                  {sortBy === 'probability' && (
                    <TrendingUp 
                      className={`h-3.5 w-3.5 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('features_used')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <span>Features Used</span>
                  {sortBy === 'features_used' && (
                    <TrendingUp 
                      className={`h-3.5 w-3.5 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedModels.map(model => (
              <tr key={model.modelType} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {model.model_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    model.is_fraud 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {model.is_fraud ? 'Fraud Detected' : 'No Fraud'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded ${getProbabilityColor(model.probability)}`}>
                    {formatProbability(model.probability)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.features_used}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareModelsView;