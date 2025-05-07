// FraudPredictionForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./FraudPredictionForm.css";

const fieldDetails = {
  IP_Address_Flag: { example: 2, range: "1 (safe) - 3 (risky)" },
  Previous_Fraudulent_Activity: { example: 1, range: "0 or 1" },
  Transaction_Amount_Ratio: { example: 5.2, range: "1 - 100" },
  Failed_Transaction_Ratio: { example: 0.8, range: "0.1 - 10" },
  Distance_Ratio: { example: 12.3, range: "1 - 50" },
  Transaction_Count_Ratio: { example: 0.25, range: "0.01 - 1" },
  Transaction_Location_Flag: { example: 1, range: "0 or 1" },
  Suspicious_IP_Flag: { example: 1, range: "0 or 1" },
  Multiple_Account_Login: { example: 6, range: "4 - 10 recommended" },
};

const FraudPredictionForm = () => {
  const [formData, setFormData] = useState(
    Object.fromEntries(Object.keys(fieldDetails).map((key) => [key, ""]))
  );

  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
    );

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/model/predict",
        formattedData
      );
      setPrediction(res.data.prediction);
      setProbability(res.data.probability);
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Fraud Detection Form</h2>
      <form onSubmit={handleSubmit} className="form-fields">
        {Object.entries(fieldDetails).map(([field, { example, range }]) => (
          <div className="form-group" key={field}>
            <label>
              {field.replaceAll("_", " ")}
              <span className="example-text">
                {" "}
                (e.g. {example}, Range: {range})
              </span>
            </label>
            <input
              type="number"
              step="any"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="submit-btn">
          Predict
        </button>
      </form>

      {prediction !== null && probability && (
        <div className="result-box">
          <h3>
            Prediction:{" "}
            <span className={prediction === 1 ? "fraud" : "not-fraud"}>
              {prediction === 1 ? "Fraudulent" : "Not Fraudulent"}
            </span>
          </h3>
          <p>
            🟩 Not Fraud Probability: {(probability.not_fraud * 100).toFixed(2)}
            %
          </p>
          <p>🟥 Fraud Probability: {(probability.fraud * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default FraudPredictionForm;
