import { LogOut, CreditCard, Shield } from "lucide-react";

const DashboardHeader = ({ username, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-200" />
            <h1 className="text-xl font-semibold tracking-wide">SecurePay</h1>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-300" />
              <span className="text-sm font-medium text-blue-100">
                Secure Session
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-blue-200">Welcome,</p>
                <p className="font-medium">{username || "User"}</p>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center space-x-1 rounded-full bg-indigo-700 hover:bg-indigo-600 px-3 py-1.5 text-sm font-medium transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
