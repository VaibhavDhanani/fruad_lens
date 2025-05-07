import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import ModelTestingForm from './ModelTestingForm';
import ModelResults from './ModelResults';
import { MODEL_TYPES } from './types';

const FraudDetectionPortal = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedModel, setSelectedModel] = useState(MODEL_TYPES.MAYANK);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = activeTab === 'all' 
        ? 'http://localhost:5000/api/models/test-all-models' 
        : `http://localhost:5000/api/models/test-model/${selectedModel}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get model predictions');
      }
      
      const results = await response.json();
      setTestResults(results);
    } catch (error) {
      console.error('Error testing model(s):', error);
      setError('Failed to get model predictions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AI Fraud Detection Portal</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">AI Powered</span>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <p className="mt-2 text-lg text-gray-600">
          Test and evaluate multiple fraud detection models with various parameters
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 text-center transition-all duration-200`}
            >
              Test All Models
            </button>
            <button
              onClick={() => setActiveTab('single')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'single'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 text-center transition-all duration-200`}
            >
              Test Single Model
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'single' && (
            <div className="mb-6">
              <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value={MODEL_TYPES.MAYANK}>Mayank Model</option>
                <option value={MODEL_TYPES.YASH_AMOUNT}>Yash with Amount Model</option>
                <option value={MODEL_TYPES.YASH_RATIO}>Yash with Ratio Model</option>
              </select>
            </div>
          )}

          <ModelTestingForm 
            onSubmit={handleSubmit}
            testMode={activeTab}
            selectedModel={selectedModel}
            isLoading={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {testResults && (
        <ModelResults 
          results={testResults} 
          testMode={activeTab} 
          selectedModel={activeTab === 'single' ? selectedModel : undefined} 
        />
      )}

      <div className="mt-12 bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start space-x-3 transition-all duration-300 hover:bg-yellow-100">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Model Retraining Available Soon</h3>
          <p className="mt-1 text-sm text-yellow-700">
            The ability to retrain models with new data will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionPortal;