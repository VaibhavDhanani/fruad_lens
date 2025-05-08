import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Auth.context';
import { Link } from 'react-router-dom';
import { AtSign, Shield as ShieldLock, AlertTriangle } from 'lucide-react';
import FormInput from './Signup/FormInput';
import MpinInput from './Signup/MpinInput';
const Login = () => {
  const [username, setUsername] = useState('');
  const [mpin, setMpin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();

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
        setError('Please enter your complete 6-digit MPIN.');
        return;
      }
      await login(username, mpinString);
    } catch (err) {
      setError('Invalid credentials. Please check your username and MPIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-3">
            <ShieldLock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your secure wallet with enhanced protection
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fadeIn">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md">
            <FormInput
              id="username"
              name="username"
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={AtSign}
            />

            <MpinInput
              mpin={mpin}
              setMpin={setMpin}
              inputRefs={inputRefs}
            />

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot MPIN?
                </Link>
              </div>
            </div>
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
              {isSubmitting ? 'Signing in...' : 'Sign in to Wallet'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Create a secure wallet
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;