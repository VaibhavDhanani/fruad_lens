// src/pages/Signup.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../context/Auth.context';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [mpin, setMpin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const { signup } = useAuth();

  const handleMpinChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newMpin = [...mpin];
      newMpin[index] = value;
      setMpin(newMpin);

      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mpinString = mpin.join('');
      if (mpinString.length < 6) {
        setError('Please enter a 6-digit MPIN.');
        return;
      }
      await signup(name, username, mpinString);
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex space-x-2 justify-center">
            {mpin.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleMpinChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 h-10 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Sign up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
