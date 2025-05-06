import { useState } from 'react';
import { Send, User, DollarSign, MessageSquare } from 'lucide-react';
import LoadingDots from './LoadingDots';

const TransactionForm = ({ onSubmit, isProcessing, message }) => {
  const [form, setForm] = useState({
    receiverUsername: '',
    amount: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.receiverUsername.trim()) {
      newErrors.receiverUsername = 'Receiver username is required';
    }
    
    if (!form.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await onSubmit(form);
    if (success) {
      setForm({
        receiverUsername: '',
        amount: '',
        description: ''
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Send className="h-5 w-5 text-blue-600 mr-2" />
          Send Money
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="h-4 w-4 text-gray-500 mr-1" />
            Recipient Username
          </label>
          <div className="relative">
            <input
              type="text"
              name="receiverUsername"
              value={form.receiverUsername}
              onChange={handleChange}
              placeholder="Enter username"
              className={`block w-full px-4 py-2.5 border ${errors.receiverUsername ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
            />
            {errors.receiverUsername && (
              <p className="mt-1 text-xs text-red-600">{errors.receiverUsername}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={`block w-full pl-8 pr-4 py-2.5 border ${errors.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MessageSquare className="h-4 w-4 text-gray-500 mr-1" />
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What's this payment for?"
            rows="2"
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-colors"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'}`}
        >
          {isProcessing ? (
            <>
              <LoadingDots color="white" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Money</span>
            </>
          )}
        </button>
        
        {message.text && (
          <div className={`py-2 px-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;