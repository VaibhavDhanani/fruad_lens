import ml from "../utils/ml";
export const predictTransaction = async (transactionData, token) => {
  try {

    // Call the ML API with the processed data
    const res = await ml.post("/predict", transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Prediction service error:", error);

    if (error.response) {
      return { ok: false, data: error.response.data };
    }

    return { ok: false, data: { message: "Network error" } };
  }
};
