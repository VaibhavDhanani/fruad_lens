import { useState } from 'react';
import { Send, User, DollarSign, MessageSquare, X } from 'lucide-react';
import LoadingDots from '../pages/LoadingDots';
import MpinVerificationDialog from './MpinVarificatonDialog';

const TransactionForm = ({ onSubmit, isProcessing, message }) => {
  const [form, setForm] = useState({
    receiverUsername: '',
    amount: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [showMessage, setShowMessage] = useState(true);
  const [showMpinVerification, setShowMpinVerification] = useState(false);
  const [pendingForm, setPendingForm] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    if (!form.receiverUsername.trim()) {
      newErrors.receiverUsername = 'Receiver username is required';
    }

    if (!form.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMessage(false);

    if (!validateForm()) return;

    setPendingForm(form);
    setShowMpinVerification(true);
  };

  const handleMpinVerification = async (mpin) => {
    setIsVerifying(true);
    try {
      const success = await onSubmit({ ...pendingForm, mpin });
      if (success) {
        setForm({ receiverUsername: '', amount: '', description: '' });
        setShowMpinVerification(false);
      }
    } finally {
      setIsVerifying(false);
      setShowMpinVerification(false); // Always close the dialog after verification attempt
      setShowMessage(true);
    }
  };

  return (
    <>
      {showMpinVerification && (
        <MpinVerificationDialog
          onConfirm={handleMpinVerification}
          onCancel={() => setShowMpinVerification(false)}
          isVerifying={isVerifying}
        />
      )}
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Send className="h-5 w-5 text-blue-600 mr-2" />
            Send Money
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="receiverUsername" className="flex items-center text-sm font-medium text-gray-700">
              <User className="h-4 w-4 text-gray-500 mr-1" />
              Recipient Username
            </label>
            <input
              id="receiverUsername"
              name="receiverUsername"
              type="text"
              value={form.receiverUsername}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className={`block w-full px-4 py-2.5 border ${
                errors.receiverUsername 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all
                hover:border-blue-300`}
              aria-invalid={!!errors.receiverUsername}
              aria-describedby="receiverUsername-error"
            />
            {errors.receiverUsername && (
              <p id="receiverUsername-error" className="text-xs text-red-600 mt-1">
                {errors.receiverUsername}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-700">
              <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                ₹
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
                className={`block w-full pl-8 pr-4 py-2.5 border ${
                  errors.amount 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all
                  hover:border-blue-300`}
                aria-invalid={!!errors.amount}
                aria-describedby="amount-error"
              />
              {errors.amount && (
                <p id="amount-error" className="text-xs text-red-600 mt-1">
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
              <MessageSquare className="h-4 w-4 text-gray-500 mr-1" />
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows="2"
              value={form.description}
              onChange={handleChange}
              placeholder="What's this payment for?"
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                hover:border-blue-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg 
              text-white font-medium transition-all duration-200 ${
                isProcessing 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] hover:shadow-md'
              }`}
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

          {message.text && showMessage && (
            <div className={`relative py-3 px-4 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-100' 
                : 'bg-red-50 text-red-800 border border-red-100'
            } animate-fadeIn`}>
              <button
                type="button"
                onClick={() => setShowMessage(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default TransactionForm;