import { useAuth } from "../context/Auth.context";
import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import TransactionForm from "../forms/transactionForm";
import TransactionHistory from "../components/TransactionHistory";
import SecurityInfo from "./SecurityInfo";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  authorizeTransaction,
  getUserTransactions,
  getTransactionSummary,
  createTransaction,
} from "../services/Transaction.service";
import { getUserInfo } from "../services/Auth.service";
import UserBalanceCard from "./UserbalanceCard";
import PasswordAuthorization from "../components/passwordModel";
const Dashboard = () => {
  const { user, token } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState({ lat: 0, long: 0 });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState(null);


  // Fetch security information
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getTransactionSummary(localStorage.user);
        console.log("Fetched Summary Data: ", data); // Log the summary data
        if (data.ok) {
          setSummary({ income: data.data.income, expense: data.data.expense });
        } else {
          console.error("Failed to fetch transaction summary:", data.data);
        }
      } catch (err) {
        console.error("Failed to fetch transaction summary:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSummary();
  }, []);
  
  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };

    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("IP fetch error:", error);
      }
    };

    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              long: pos.coords.longitude,
            });
          },
          (err) => {
            console.error("Geolocation error:", err);
          }
        );
      }
    };

    loadFingerprint();
    fetchIP();
    fetchLocation();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userRes = await getUserInfo(token);
      if (userRes.ok) {
        setBalance(userRes.data.balance);
      }

      const txRes = await getUserTransactions(localStorage.user);
      if (txRes.ok) {
        const user = JSON.parse(localStorage.user)
        const enhancedTxData = txRes.data.map((tx) => {
          const isIncoming = tx.counterparty._id === user._id; // If user is the receiver, it's an incoming transaction
          const status = getTransactionStatus(tx);

          return {
            ...tx,
            isIncoming,
            status,
            statusIcon: getStatusIcon(status),
            formattedDate: formatDate(tx.createdAt),
            formattedTime: formatTime(tx.createdAt),
            icon: isIncoming ? (
              <ArrowDownCircle className="text-emerald-500" />
            ) : (
              <ArrowUpCircle className="text-blue-500" />
            ),
          };
        });

        setHistory(enhancedTxData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setMessage({
        text: "Failed to load dashboard data. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionStatus = (tx) => {
   
    if (tx.status) return tx.status;

    const hoursSinceCreated =
      (new Date() - new Date(tx.createdAt)) / (1000 * 60 * 60);
    if (hoursSinceCreated < 1) return "completed";
    if (tx.transaction_amount > 10000) return "pending";
    return "completed";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-500" />;
      case "failed":
        return <AlertTriangle className="text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (localStorage.user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleTransfer = async (formData) => {
    setIsProcessing(true);
    setMessage({ text: "", type: "" });
  
    try {
      const payload = {
        ...formData,
        account_balance: balance,
        senderId: user,
        device_id: deviceId || "unknown",
        ip_address: ipAddress || "unknown",
        sender_lat: location.lat,
        sender_long: location.long,
        beneficiary_lat: 0,  // will be updated after password authorization
        beneficiary_long: 0, // will be updated after password authorization
      };
  
      const { ok, data } = await createTransaction(payload, token);
  
      if (ok) {
        setMessage({
          text: "Transaction created! Please enter your password to authorize the transfer.",
          type: "info",
        });
  
        setTransactionId(data.transactionId);
        setIsPasswordModalOpen(true);  // Open the password authorization modal
      } else {
        setMessage({
          text: data.message || "Transaction failed",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Error occurred during transaction",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasswordAuthorization = async (password) => {
    try {
      const { ok } = await authorizeTransaction(transactionId, password, token);
      if (ok) {
        setMessage({
          text: "Transaction authorized successfully! 🎉",
          type: "success",
        });
        fetchDashboardData();
        setIsPasswordModalOpen(false);  // Close the modal
      } else {
        setMessage({
          text: "Invalid password. Please try again.",
          type: "error",
        });
      }
      return ok;
    } catch (error) {
      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
      return false;
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <UserBalanceCard
              username={user.username}
              balance={balance}
              loading={loading}
              income={summary.income}
              expense={summary.expense}
            />

            <TransactionForm
              onSubmit={handleTransfer}
              isProcessing={isProcessing}
              message={message}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SecurityInfo
              deviceId={deviceId}
              ipAddress={ipAddress}
              location={location}
            />
          </div>
        </div>

        {/* Transaction history - full width */}
        <div className="mt-8">
          <TransactionHistory
            transactions={history}
            loading={loading}
            fetchDashboardData={fetchDashboardData}
          />
        </div>
      </div>
          {/* Password Authorization Modal */}
          {isPasswordModalOpen && (
        <PasswordAuthorization
          onSubmit={handlePasswordAuthorization}
          onCancel={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
