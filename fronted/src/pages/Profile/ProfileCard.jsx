import React, { useState, useEffect } from 'react';
import { User, CreditCard, Calendar, Wallet, PenSquare, CheckCircle, AlertCircle } from 'lucide-react';
import PanCardForm from './PanCardForm';
import GenderForm from './GenderForm';
import ProfileSection from './ProfileSection';
import { formatCurrency, formatDate } from './formutills';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [showPanForm, setShowPanForm] = useState(false);
  const [showGenderForm, setShowGenderForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const handlePanUpdate = async (panNumber) => {
    setIsUpdating(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/update-pan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, pan_card: panNumber })
      });
  
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowPanForm(false);
        setNotification({ show: true, message: 'PAN card details updated successfully', type: 'success' });
      } else {
        setNotification({ show: true, message: data.error || 'Update failed', type: 'error' });
      }
    } catch (error) {
      setNotification({ show: true, message: 'Something went wrong', type: 'error' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

const handleGenderUpdate = async (selectedGender) => {
  setIsUpdating(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/update-gender`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, gender: selectedGender })
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setShowGenderForm(false);
      setNotification({ show: true, message: 'Gender updated successfully', type: 'success' });
    } else {
      setNotification({ show: true, message: data.error || 'Update failed', type: 'error' });
    }
  } catch (error) {
    setNotification({ show: true, message: 'Something went wrong', type: 'error' });
  } finally {
    setIsUpdating(false);
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }
};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const totalFields = 5;
  const completedFields = Object.keys(user).filter(key => 
    ['username', 'full_name', 'gender', 'pan_card', 'balance'].includes(key) && 
    user[key] !== null && 
    user[key] !== undefined && 
    user[key] !== ''
  ).length;
  
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {completionPercentage}% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-blue-600 rounded-full w-16 h-16 mr-4">
                <span className="text-white text-xl font-bold">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.full_name || user.username}</h2>
                <p className="text-gray-500 flex items-center">
                  <User size={14} className="mr-1" /> @{user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <ProfileSection 
              icon={<Wallet size={20} className="text-blue-500" />}
              title="Account Balance"
              value={formatCurrency(user.balance)}
              valueClass="text-xl font-bold text-green-600"
            />

            <ProfileSection 
              icon={<User size={20} className="text-blue-500" />}
              title="Full Name"
              value={user.full_name || 'Not provided'}
              valueClass={!user.full_name ? 'text-gray-400 italic' : ''}
            />

            <ProfileSection 
              icon={<User size={20} className="text-blue-500" />}
              title="Gender"
              value={user.gender || 'Not provided'}
              valueClass={!user.gender ? 'text-gray-400 italic' : ''}
              action={
                !showGenderForm && (
                  <button 
                    onClick={() => setShowGenderForm(true)} 
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <PenSquare size={14} className="mr-1" />
                    {user.gender ? 'Update' : 'Add'}
                  </button>
                )
              }
            />

            {showGenderForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <GenderForm 
                  initialValue={user.gender || ''} 
                  onSubmit={handleGenderUpdate}
                  onCancel={() => setShowGenderForm(false)}
                  isLoading={isUpdating}
                />
              </div>
            )}

            <ProfileSection 
              icon={<Calendar size={20} className="text-blue-500" />}
              title="Latest Login"
              value={user.latest_login ? formatDate(user.latest_login) : 'No login recorded'}
              valueClass={!user.latest_login ? 'text-gray-400 italic' : ''}
            />

            <ProfileSection 
              icon={<CreditCard size={20} className="text-blue-500" />}
              title="PAN Card"
              value={user.pan_card || 'Not provided'}
              valueClass={!user.pan_card ? 'text-gray-400 italic' : ''}
              action={
                !showPanForm && (
                  <button 
                    onClick={() => setShowPanForm(true)} 
                    className="text-blue-600 flex items-center text-sm"
                  >
                    <PenSquare size={14} className="mr-1" />
                    {user.pan_card ? 'Update' : 'Add'}
                  </button>
                )
              }
            />

            {showPanForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <PanCardForm 
                  initialValue={user.pan_card || ''} 
                  onSubmit={handlePanUpdate}
                  onCancel={() => setShowPanForm(false)}
                  isLoading={isUpdating}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-700">Security Information</h3>
              <p className="text-sm text-yellow-600 mt-1">
                For your security, we never display your complete MPIN. 
                To change your MPIN, please use the dedicated option in the security settings.
              </p>
            </div>
          </div>
        </div>

        {notification.show && (
          <div className={`fixed bottom-4 right-4 max-w-xs bg-white rounded-lg shadow-lg border p-4 transform transition-all ${
            notification.type === 'success' ? 'border-green-100' : 'border-red-100'
          }`}>
            <div className="flex items-start">
              {notification.type === 'success' ? (
                <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-red-500 mr-2 flex-shrink-0" />
              )}
              <p className={`text-sm ${
                notification.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;