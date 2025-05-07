import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/Auth.context';
import { Link } from 'react-router-dom';
import { User, AtSign, Shield as ShieldLock, ArrowRight, CheckCircle } from 'lucide-react';

import MpinInput from './MpinInput';
import FormInput from './FormInput';
import SecurityNotice from './SecurityNotice';
const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [mpin, setMpin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const inputRefs = useRef([]);
  const { signup } = useAuth();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const mpinString = mpin.join('');
      if (mpinString.length < 6) {
        setError('Please enter a complete 6-digit MPIN.');
        setIsSubmitting(false);
        return;
      }
      
      await signup(name, username, mpinString);
      setSignupSuccess(true);
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6 animate-fadeIn">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Account Created Successfully!</h2>
            <p className="mt-2 text-gray-600">Your secure wallet is ready to use.</p>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 
                text-white font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to Login <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-3">
            <ShieldLock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Secure Wallet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our fraud detection gateway system with enhanced protection
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fadeIn">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md">
            <FormInput
              id="name"
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
            />
            
            <FormInput
              id="username"
              name="username"
              label="Username"
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={AtSign}
            />
            
            <MpinInput 
              mpin={mpin} 
              setMpin={setMpin} 
              inputRefs={inputRefs} 
            />
            
            <SecurityNotice />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-all duration-150 ease-in-out shadow-sm
                ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Secure Wallet'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in to your wallet
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;