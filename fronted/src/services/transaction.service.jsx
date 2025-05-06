// services/transactionService.js
import api from "../utils/db"; // api is likely an Axios instance

export const transferAmount = async (payload,token) => {
  try {
    const res = await api.post('/transactions/transfer', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    console.error('Transfer service error:', error);
    
    if (error.response) {
      return { ok: false, data: error.response.data };
    }
    return { ok: false, data: { message: "Network error" } };
  }
};


export const getUserTransactions = async (token) => {
    try {
      const res = await api.get(`/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { ok: true, data: res.data };
    } catch (error) {
      console.error("Transaction fetch error:", error);
      return { ok: false, data: error.response?.data || { message: "Transaction fetch failed" } };
    }
  };

  // src/services/transactionService.js

export const getTransactionSummary = async (token) => {
  try {
    const res = await api.get(`users/user-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error) {
    console.error("Transaction Summary error:", error);
      return { ok: false, data: error.response?.data || { message: "Transaction Summary failed" } };
    }
};
