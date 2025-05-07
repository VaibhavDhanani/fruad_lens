import React from 'react';

const ProfileSection = ({ icon, title, value, valueClass = '', action = null }) => {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center text-gray-600">
          {icon}
          <span className="ml-2 text-sm">{title}</span>
        </div>
        {action}
      </div>
      <p className={`pl-7 font-medium text-gray-800 ${valueClass}`}>{value}</p>
    </div>
  );
};

export default ProfileSection;