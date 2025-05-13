import React, { useState, useEffect } from 'react';

const API_URL = 'http://13.127.98.0/fastapi';

const ModelRetraining = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [balancedRatio, setBalancedRatio] = useState(1.5);
  const [versionSuffix, setVersionSuffix] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('retrain');
  const [selectedVersion, setSelectedVersion] = useState({});

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/available-models`);
      const data = await response.json();
      console.log(data);
      if (Array.isArray(data.models)) {
        setModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].id);
        }
      } else {
        setModels([]);
        setError('Invalid data format: models not found.');
      }
    } catch (err) {
      setError('Failed to fetch models: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrainModel = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/retrain-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_id: selectedModel,
          balanced_ratio: parseFloat(balancedRatio),
          version_suffix: versionSuffix || null
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Unknown error');

      setResult(data);
      fetchModels();
    } catch (err) {
      setError('Retraining failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateModel = async (modelId, version) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/activate-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: modelId, version })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Unknown error');

      alert(`Model activated: ${modelId} version ${version}`);
      fetchModels();
    } catch (err) {
      setError('Activation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  const getModelById = (id) => {
    return models.find(model => model.id === id) || {};
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fraud Detection Model Management</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('retrain')}
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'retrain'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Retrain Models
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Model Versions
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {activeTab === 'retrain' && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Retrain Model</h2>
            <form onSubmit={handleRetrainModel}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model-select">
                  Select Model
                </label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ratio">
                  Balanced Ratio (Non-Fraud to Fraud)
                </label>
                <input
                  id="ratio"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={balancedRatio}
                  onChange={(e) => setBalancedRatio(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <p className="text-gray-600 text-xs italic mt-1">
                  Recommended value: 1.5 - For every fraud transaction, use 1.5 non-fraud transactions
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="version">
                  Version Suffix (Optional)
                </label>
                <input
                  id="version"
                  type="text"
                  value={versionSuffix}
                  onChange={(e) => setVersionSuffix(e.target.value)}
                  placeholder="e.g., v1, production, test"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-gray-600 text-xs italic mt-1">
                  A timestamp will be automatically added to the suffix
                </p>
              </div>

              {selectedModel && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Selected Model Features:</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {getModelById(selectedModel).features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'Retrain Model'}
                </button>
              </div>
            </form>
          </div>

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Retraining Successful</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700"><span className="font-medium">Model:</span> {result.model_id}</p>
                  <p className="text-gray-700"><span className="font-medium">Version:</span> {result.version}</p>
                  <p className="text-gray-700"><span className="font-medium">Transactions Used:</span> {result.num_transactions_used}</p>
                  <p className="text-gray-700"><span className="font-medium">Fraud Transactions:</span> {result.num_fraud}</p>
                  <p className="text-gray-700"><span className="font-medium">Non-Fraud Transactions:</span> {result.num_non_fraud}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Model Performance:</h3>
                  <p className="text-gray-700"><span className="font-medium">Accuracy:</span> {(result.metrics.accuracy * 100).toFixed(2)}%</p>
                  <p className="text-gray-700"><span className="font-medium">Precision:</span> {(result.metrics.precision * 100).toFixed(2)}%</p>
                  <p className="text-gray-700"><span className="font-medium">Recall:</span> {(result.metrics.recall * 100).toFixed(2)}%</p>
                  <p className="text-gray-700"><span className="font-medium">F1 Score:</span> {(result.metrics.f1_score * 100).toFixed(2)}%</p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleActivateModel(result.model_id, result.version)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Activate This Version
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Manage Model Versions
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Model Versions</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((model) => (
                    <React.Fragment key={model.id}>
                      <tr className="bg-gray-100">
                        <td colSpan="4" className="py-2 px-4 font-medium">
                          {model.name} ({model.id})
                        </td>
                      </tr>
                      
                      {/* Base model */}
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {model.name}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Base Model
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {model.base_model_loaded ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Loaded
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Not Loaded
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {/* No action for base model */}
                        </td>
                      </tr>
                      
                      {/* Custom versions */}
                      {model.versions.map((version) => (
                        <tr key={version.version}>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {model.name}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {version.version}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {selectedVersion[model.id] === version.version ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Available
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            <button
                              onClick={() => handleActivateModel(model.id, version.version)}
                              className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            >
                              Activate
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {/* If no versions available */}
                      {model.versions.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-4 px-4 border-b border-gray-200 text-center text-gray-500">
                            No custom versions available. Retrain to create new versions.
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {models.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 px-4 border-b border-gray-200 text-center text-gray-500">
                        No models available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => setActiveTab('retrain')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create New Version
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelRetraining;