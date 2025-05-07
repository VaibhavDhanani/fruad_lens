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
  transferAmount,
  getUserTransactions,
  getTransactionSummary,
} from "../services/Transaction.service";
import { getUserInfo } from "../services/Auth.service";
import UserBalanceCard from "./UserbalanceCard";

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

  // Fetch security information
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getTransactionSummary(token);
        setSummary({ income: data.data.income, expense: data.data.expense });
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

      const txRes = await getUserTransactions(token);
      if (txRes.ok) {
        const enhancedTxData = txRes.data.map((tx) => {
          const isIncoming = tx.receiver._id === user._id; // If user is the receiver, it's an incoming transaction
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
    // Mock function to determine transaction status
    // In a real app, this would come from the backend
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
        senderId: user._id,
        device_id: deviceId || "unknown",
        ip_address: ipAddress || "unknown",
        sender_lat: location.lat,
        sender_long: location.long,
        beneficiary_lat: 0,
        beneficiary_long: 0,
      };

      const { ok, data } = await transferAmount(payload, token);

      if (ok) {
        setMessage({
          text: "Transaction successful! 🎉",
          type: "success",
        });
        fetchDashboardData();
        return true;
      } else {
        setMessage({
          text: data.message || "Transaction failed",
          type: "error",
        });
        return false;
      }
    } catch (error) {
      setMessage({
        text: "Error occurred during transaction",
        type: "error",
      });
      return false;
    } finally {
      setIsProcessing(false);
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
    </div>
  );
};

export default Dashboard;
