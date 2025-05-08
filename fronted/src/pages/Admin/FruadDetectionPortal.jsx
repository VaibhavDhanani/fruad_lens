import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, List, Grid2X2 } from 'lucide-react';
import ModelTestingForm from './ModelTestingForm';
import ModelResults from './ModelResults';
import CompareModelsView from './CompareModelsView';
import { MODEL_TYPES } from './types';

const FraudDetectionPortal = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedModel, setSelectedModel] = useState(MODEL_TYPES.XGB_11);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("➡️ Making request to backend...");
    let model = "MAYANK";
    if(selectedModel===MODEL_TYPES.XGB_11){
      model = "MAYANK";
    }else if(selectedModel===MODEL_TYPES.XGB_12){
      model = "YASH_AMOUNT";
    }else if(selectedModel===MODEL_TYPES.XGB_9){
      model = "YASH_RATIO";
    }
      const endpoint = activeTab === 'all' 
        ? 'http://13.127.98.0/api/models/test-all-models' 
        : `http://13.127.98.0/api/models/test-model/${model}`;
    
      console.log("🔗 Endpoint:", endpoint);
      console.log("📤 Form data:", formData);
    
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    
      console.log("📥 Raw response:", response);
    
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Bad response:", text);
        throw new Error('Failed to get model predictions');
      }
    
      const results = await response.json();
      console.log("✅ Prediction results:", results);
      setTestResults(results);
    } catch (error) {
      console.error('🚨 Error testing model(s):', error);
      setError('Failed to get model predictions. Please try again.');
    } finally {
      console.log("✅ Done loading");
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
                <option value={MODEL_TYPES.XGB_11}>XGB 11</option>
<option value={MODEL_TYPES.XGB_12}>XGB 12</option>
<option value={MODEL_TYPES.XGB_9}>XGB 9</option>

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
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {testResults && activeTab === 'all' && (
        <div className="mb-4 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                viewMode === 'cards' 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Grid2X2 className="h-4 w-4 inline mr-1" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                viewMode === 'table' 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4 inline mr-1" />
              Table
            </button>
          </div>
        </div>
      )}

      {testResults && (
        viewMode === 'cards' || activeTab === 'single' ? (
          <ModelResults 
            results={testResults} 
            testMode={activeTab} 
            selectedModel={activeTab === 'single' ? selectedModel : undefined} 
          />
        ) : (
          <CompareModelsView results={testResults} />
        )
      )}

     
    </div>
  );
};

export default FraudDetectionPortal;