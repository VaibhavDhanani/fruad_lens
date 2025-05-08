import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, Eye, BarChart3, PieChart, Users, ArrowUpDown, BookCopy } from 'lucide-react';
import { PieChart as RechartsePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Loading Dots Component
const LoadingDots = ({ color = 'indigo', size = 'medium' }) => {
  const [dots, setDots] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  const sizeClasses = {
    small: 'h-1 w-1',
    medium: 'h-2 w-2',
    large: 'h-3 w-3'
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`rounded-full ${sizeClasses[size]} bg-${color}-600 ${dots >= 1 ? 'opacity-100' : 'opacity-30'} animate-pulse`}></div>
      <div className={`rounded-full ${sizeClasses[size]} bg-${color}-600 ${dots >= 2 ? 'opacity-100' : 'opacity-30'} animate-pulse`}></div>
      <div className={`rounded-full ${sizeClasses[size]} bg-${color}-600 ${dots >= 3 ? 'opacity-100' : 'opacity-30'} animate-pulse`}></div>
    </div>
  );
};

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [analytics, setAnalytics] = useState({
    fraudPercentage: 0,
    totalTransactions: 0,
    totalAmount: 0,
    fraudAmount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://13.127.98.0/api/transactions/');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
      calculateAnalytics(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    const fraudTxs = data.filter(tx => tx.is_fraud);
    const totalAmount = data.reduce((sum, tx) => sum + tx.transaction_amount, 0);
    const fraudAmount = fraudTxs.reduce((sum, tx) => sum + tx.transaction_amount, 0);

    setAnalytics({
      fraudPercentage: (fraudTxs.length / data.length) * 100,
      totalTransactions: data.length,
      totalAmount,
      fraudAmount
    });
  };

  const toggleFraudStatus = async (transactionId, currentStatus) => {
    try {
      const response = await fetch(`http://13.127.98.0/api/transactions/${transactionId}/fraud`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_fraud: !currentStatus })
      });

      if (response.ok) {
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Error updating fraud status:', error);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'fraud' && !tx.is_fraud) return false;
    
    const searchFields = [
      tx.device_id,
      tx.ip_address,
      tx.user?.username,
      tx.counterparty?.username
    ].map(field => field?.toLowerCase() || '');

    return searchTerm === '' || searchFields.some(field => field.includes(searchTerm.toLowerCase()));
  });

  const pieChartData = [
    { name: 'Normal', value: transactions.length - transactions.filter(tx => tx.is_fraud).length },
    { name: 'Fraud', value: transactions.filter(tx => tx.is_fraud).length }
  ];

  const COLORS = ['#4F46E5', '#F43F5E'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Fraud Detection Dashboard
          </h1>
          <button 
            onClick={() => navigate('/admin/model')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            <BookCopy className="h-5 w-5" />
            <span>Manage Models</span>
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{analytics.totalTransactions}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">All processed transactions</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{analytics.totalAmount.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Total transaction value</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Fraud Percentage</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{analytics.fraudPercentage.toFixed(1)}%</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Percentage of fraudulent transactions</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Fraud Amount</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{analytics.fraudAmount.toLocaleString()}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Value of fraudulent transactions</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Transaction Distribution</h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsePieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    animationDuration={750}
                    animationBegin={0}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </RechartsePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Transaction Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactions.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="transaction_hour" 
                  tick={{fontSize: 12, fill: '#6B7280'}}
                  axisLine={{stroke: '#E5E7EB'}}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#6B7280'}} 
                  axisLine={{stroke: '#E5E7EB'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                />
                <Bar 
                  dataKey="transaction_amount" 
                  name="Amount" 
                  fill="#4F46E5" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={750}
                  animationBegin={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by device ID, IP address, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setActiveTab('fraud')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'fraud'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fraud Only
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredTransactions.length} transactions
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingDots color="indigo" size="large" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tx.transaction_type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{tx.transaction_amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{tx.device_id}</div>
                          <div className="text-sm text-gray-500">{tx.ip_address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {tx.sender_lat}, {tx.sender_long}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.is_fraud
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {tx.is_fraud ? 'Fraud' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setSelectedTransaction(tx)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                              aria-label="View details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => toggleFraudStatus(tx._id, tx.is_fraud)}
                              className={`transition-colors duration-150 ${
                                tx.is_fraud
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              aria-label="Toggle fraud status"
                            >
                              <ArrowUpDown className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                        No transactions found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTransaction(null);
            }}
          >
            <div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transform transition-all duration-300 animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                    aria-label="Close"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">Transaction ID</p>
                        <p className="mt-1 text-sm text-gray-800 font-mono break-all">{selectedTransaction._id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-indigo-600">Amount</p>
                        <p className="mt-1 text-xl font-semibold text-gray-800">₹{selectedTransaction.transaction_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Transaction Type</p>
                        <p className="mt-1 text-gray-800">{selectedTransaction.transaction_type}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date & Time</p>
                        <p className="mt-1 text-gray-800">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Device ID</p>
                        <p className="mt-1 text-gray-800 font-mono text-sm">{selectedTransaction.device_id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">IP Address</p>
                        <p className="mt-1 text-gray-800 font-mono text-sm">{selectedTransaction.ip_address}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sender Location</p>
                        <p className="mt-1 text-gray-800">{selectedTransaction.sender_lat}, {selectedTransaction.sender_long}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fraud Status</p>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          selectedTransaction.is_fraud
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedTransaction.is_fraud ? 'Fraudulent' : 'Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;