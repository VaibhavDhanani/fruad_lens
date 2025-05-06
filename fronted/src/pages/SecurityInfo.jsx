import { Shield, Fingerprint, Globe, MapPin } from 'lucide-react';

const SecurityInfo = ({ deviceId, ipAddress, location }) => {
  // Only show first part of device ID for privacy/security
  const truncatedDeviceId = deviceId 
    ? `${deviceId.substring(0, 8)}...${deviceId.substring(deviceId.length - 4)}` 
    : '...';
    
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          Security Info
        </h3>
      </div>
      
      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            <Fingerprint className="h-4 w-4 text-gray-500 mr-1.5" />
            Device ID
          </div>
          <p className="text-sm bg-gray-50 rounded-lg p-2.5 font-mono">
            {truncatedDeviceId}
          </p>
        </div>
        
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            <Globe className="h-4 w-4 text-gray-500 mr-1.5" />
            IP Address
          </div>
          <p className="text-sm bg-gray-50 rounded-lg p-2.5 font-mono">
            {ipAddress || 'Loading...'}
          </p>
        </div>
        
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            <MapPin className="h-4 w-4 text-gray-500 mr-1.5" />
            Location
          </div>
          <p className="text-sm bg-gray-50 rounded-lg p-2.5">
            {location.lat && location.long
              ? `${location.lat.toFixed(6)}, ${location.long.toFixed(6)}`
              : 'Location access denied or unavailable'}
          </p>
        </div>
        
        <div className="bg-blue-50 text-blue-800 rounded-lg p-3 text-xs">
          <p className="flex items-center">
            <Shield className="h-4 w-4 text-blue-500 mr-1.5 flex-shrink-0" />
            <span>
              This information helps protect your account and verify transactions.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo;