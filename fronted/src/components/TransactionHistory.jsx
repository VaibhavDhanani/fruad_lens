import { useState } from "react";
import { Clock, Calendar, RefreshCw } from "lucide-react";
import LoadingDots from "../pages/LoadingDots";

const TransactionHistory = ({ transactions, loading, fetchDashboardData }) => {
  const [filter, setFilter] = useState("all");

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "incoming") return tx.isIncoming;
    if (filter === "outgoing") return !tx.isIncoming;
    return true;
  });

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusClasses = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          Transaction History
        </h3>

        <div className="flex space-x-2 text-sm">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full ${
              filter === "all"
                ? "bg-blue-100 text-blue-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("incoming")}
            className={`px-3 py-1 rounded-full ${
              filter === "incoming"
                ? "bg-green-100 text-green-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setFilter("outgoing")}
            className={`px-3 py-1 rounded-full ${
              filter === "outgoing"
                ? "bg-blue-100 text-blue-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Sent
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <LoadingDots color="blue" size="large" />
              <p className="mt-3 text-sm text-gray-500">
                Loading transaction history...
              </p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <RefreshCw className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No transactions found
            </h3>
            <p className="text-gray-500 max-w-md">
              {filter === "all"
                ? "You haven't made any transactions yet."
                : filter === "incoming"
                ? "You haven't received any payments yet."
                : "You haven't sent any payments yet."}
            </p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transaction
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-gray-100">
                          {tx.icon}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tx.isIncoming ? "Received from" : "Sent to"}{" "}
                            {tx.isIncoming ? tx.sender_id : tx.receiver_id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tx.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          tx.isIncoming ? "text-green-600" : "text-blue-600"
                        }`}
                      >
                        {tx.isIncoming ? "+" : "-"} ₹
                        {parseFloat(tx.transaction_amount).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                      <div className="text-xs text-gray-500 md:hidden">
                        {tx.formattedDate}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{tx.formattedDate}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.formattedTime}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tx.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredTransactions.length} transactions
                </p>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => fetchDashboardData()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
