import React from 'react';
import { AlertTriangle, Lock, Shield, Eye } from 'lucide-react';

const SecurityNotice = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-md mb-6 animate-fadeIn">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-700">
          <h4 className="font-semibold mb-2 text-gray-800">Security Notice</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Lock className="w-4 h-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Never share your MPIN with anyone, including our staff.</span>
            </li>
            <li className="flex items-start">
              <Shield className="w-4 h-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Avoid using predictable numbers like birth dates.</span>
            </li>
            <li className="flex items-start">
              <Eye className="w-4 h-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Shield your screen when entering your MPIN.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;