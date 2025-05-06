import { useAuth } from '../context/auth.conext';  // Adjust the path accordingly
import { useState , useEffect } from 'react';
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    receiverUsername: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${localStorage.user}`);
      const data = await res.json();
      setBalance(data.balance);

      const txRes = await fetch(`http://localhost:5000/api/transactions/${localStorage.user}`);
      const txData = await txRes.json();
      setHistory(txData);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  useEffect(() => {
    if (localStorage.user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        senderId: localStorage.user,
        device_id: 'web-browser',
        ip_address: '127.0.0.1',
        sender_lat: 0,
        sender_long: 0,
        beneficiary_lat: 0,
        beneficiary_long: 0
      };
  
      console.log('Sending payload:', payload); // 👈 log this
  
      const res = await fetch('http://localhost:5000/api/transactions/transfer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
      console.log('Received response:', data); // 👈 log response
  
      if (res.ok) {
        setMessage('Transaction successful!');
        setForm({ receiverUsername: '', amount: '', description: '' });
        fetchDashboardData();
      } else {
        setMessage(data.message || 'Transaction failed');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('Error occurred during transaction');
    }
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Welcome, {localStorage.user || 'Loading...'}!
            </h2>
            <p className="text-gray-700">
              Current Balance: <span className="font-bold text-green-600">₹{balance ?? 'Loading...'}</span>
            </p>
          </div>

          <div className="bg-white rounded shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Make a Transaction</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">To (username)</label>
                <input
                  type="text"
                  name="receiverUsername"
                  value={form.receiverUsername}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                {loading ? 'Processing...' : 'Send Money'}
              </button>
              {message && <p className="text-sm text-center text-red-500 mt-2">{message}</p>}
            </form>
          </div>

          <div className="bg-white rounded shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            {history.length === 0 ? (
              <p className="text-gray-600">No transactions yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {history.map((tx) => (
                  <li key={tx._id} className="py-3 flex justify-between text-sm">
                    <span>
                      <strong>{tx.transaction_type}</strong> ₹{tx.transaction_amount} 
                      <span className="text-gray-500"> — {tx.description || 'No description'}</span>
                    </span>
                    <span className="text-gray-400">{new Date(tx.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
