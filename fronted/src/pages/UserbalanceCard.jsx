import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingDots from './LoadingDots';
import { useEffect, useState } from 'react';

const UserBalanceCard = ({ username, balance, loading , income , expense }) => {

const weeklyChange = income - expense;
const percentageChange = ((weeklyChange / balance) * 100).toFixed(2); 

  const isPositiveChange = weeklyChange > 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 px-6 py-5 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Welcome, {username || 'User'} 👋</h2>
          <Wallet className="h-6 w-6 text-blue-200" />
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-1">Available Balance</p>
          {loading ? (
            <div className="h-10 flex items-center">
              <LoadingDots color="blue" />
            </div>
          ) : (
            <div className="flex items-end space-x-2">
              <h3 className="text-3xl font-bold text-gray-800">₹{parseFloat(balance).toLocaleString('en-IN')}</h3>
              <div className={`flex items-center space-x-1 text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'} mb-1`}>
                {isPositiveChange ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{parseFloat(Math.abs(percentageChange))}% this week</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-medium mb-1">Recent Income</p>
            <p className="text-lg font-semibold text-gray-800">₹{income.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs text-indigo-700 font-medium mb-1">Recent Expense</p>
            <p className="text-lg font-semibold text-gray-800">₹{expense.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBalanceCard;
