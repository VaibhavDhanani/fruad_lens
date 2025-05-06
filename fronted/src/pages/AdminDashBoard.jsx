import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Eye, BarChart3, PieChart, Users, ArrowUpDown } from 'lucide-react';
import { PieChart as RechartsePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import LoadingDots from './LoadingDots';

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'fraud'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [analytics, setAnalytics] = useState({
    fraudPercentage: 0,
    totalTransactions: 0,
    totalAmount: 0,
    fraudAmount: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/all');
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
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}/fraud`, {
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

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.totalTransactions}</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{analytics.totalAmount.toLocaleString()}</h3>
            </div>
            <PieChart className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fraud Percentage</p>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.fraudPercentage.toFixed(1)}%</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fraud Amount</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{analytics.fraudAmount.toLocaleString()}</h3>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Transaction Distribution</h3>
          <div className="flex justify-center">
            <RechartsePieChart width={300} height={300}>
              <Pie
                data={pieChartData}
                cx={150}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsePieChart>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Transaction Trends</h3>
          <BarChart width={500} height={300} data={transactions.slice(-7)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="transaction_hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="transaction_amount" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by device ID, IP address, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveTab('fraud')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'fraud'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fraud Only
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingDots color="blue" size="large" />
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
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => toggleFraudStatus(tx._id, tx.is_fraud)}
                          className={`${
                            tx.is_fraud
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <ArrowUpDown className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
     {/* Transaction Details Modal */}
{selectedTransaction && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Transaction Details</h3>
          <button
            onClick={() => setSelectedTransaction(null)}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Transaction ID</p>
              <p className="mt-1">{selectedTransaction._id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="mt-1">₹{selectedTransaction.transaction_amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Transaction Type</p>
              <p className="mt-1">{selectedTransaction.transaction_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date & Time</p>
              <p className="mt-1">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Device ID</p>
            <p className="mt-1">{selectedTransaction.device_id}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">IP Address</p>
            <p className="mt-1">{selectedTransaction.ip_address}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Sender Location</p>
            <p className="mt-1">{selectedTransaction.sender_lat}, {selectedTransaction.sender_long}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Fraud Status</p>
            <p className="mt-1">{selectedTransaction.is_fraud ? 'Fraudulent' : 'Normal'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;