import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MODEL_TYPES } from './types';

const ModelResults = ({ results, testMode, selectedModel }) => {
  const modelsToDisplay = testMode === 'all'
    ? [MODEL_TYPES.MAYANK, MODEL_TYPES.YASH_AMOUNT, MODEL_TYPES.YASH_RATIO]
    : [selectedModel];

  const getFraudStatusColor = (isFraud, probability) => {
    if (isFraud) return 'bg-red-50 border-red-200 text-red-700';
    if (probability > 0.3) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-green-50 border-green-200 text-green-700';
  };

  const getFraudStatusIcon = (isFraud, probability) => {
    if (isFraud) return <XCircle className="h-6 w-6 text-red-500" />;
    if (probability > 0.3) return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  };

  const getProgressBarColor = (probability) => {
    if (probability > 0.7) return 'bg-red-500';
    if (probability > 0.3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Model Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelsToDisplay.map((modelType) => {
          const modelResult = results[modelType];
          if (!modelResult) return null;

          const { is_fraud, probability, model_name, features_used } = modelResult;
          const statusColor = getFraudStatusColor(is_fraud, probability);
          const probabilityColor = getProgressBarColor(probability);

          return (
            <div 
              key={modelType}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{model_name}</h3>
                  {getFraudStatusIcon(is_fraud, probability)}
                </div>

                <div className={`rounded-md p-3 mb-4 ${statusColor} flex items-center justify-between`}>
                  <span className="font-medium">
                    {is_fraud ? 'Fraud Detected' : 'No Fraud Detected'}
                  </span>
                  <span className="text-sm opacity-75">
                    Using {features_used} features
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fraud Probability</span>
                    <span className="font-medium">{(probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${probabilityColor} transition-all duration-500 ease-out`}
                      style={{ width: `${probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                  onClick={() => alert('Model retraining will be available in a future update')}
                >
                  Retrain Model
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelResults;
