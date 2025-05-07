// services/transactionService.js
import api from "../utils/db"; // api is likely an Axios instance
export const markTransactionAsFraud = async (transactionId, token) => {
  try {
    const res = await api.put(`/transactions/${transactionId}`, {
      status: "fraud",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error) {
    console.error("Mark as fraud error:", error);
    if (error.response) {
      return { ok: false, data: error.response.data };
    }
    return { ok: false, data: { message: "Network error" } };
  }
};

  export const authorizeTransaction =async(transactionID,password,token)=>{
  try {
    const res = await api.post(`/transactions/authorize/${transactionID}`, {password} ,{
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

export const createTransaction = async (payload,token) => {
  try {
    const res = await api.post('/transactions/initiate', payload, {
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


export const getUserTransactions = async (userId) => {
  try {
    const user = JSON.parse(userId)
    console.log(user._id)
    const res = await api.get(`/transactions/${user._id}`);
    return { ok: true, data: res.data };
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return {
      ok: false,
      data: error.response?.data || { message: "Transaction fetch failed" },
    };
  }
};


  // src/services/transactionService.js
  export const getTransactionSummary = async (userId) => {
    try {
      const user = JSON.parse(userId); // Ensure userId is parsed correctly
      console.log("Frontend user ID: ", user._id); // Check the user ID being sent to the backend
  
      const res = await api.get(`users/user-summary/${user._id}`);
  
      return { ok: true, data: res.data };
    } catch (error) {
      console.error("Transaction Summary error:", error);
      return { ok: false, data: error.response?.data || { message: "Transaction Summary failed" } };
    }
  };
  