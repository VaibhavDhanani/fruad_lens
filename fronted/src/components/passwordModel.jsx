import { useState, useRef } from "react";

const PasswordAuthorization = ({ onSubmit, onCancel }) => {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = digits.join("");
    if (password.length !== 6) {
      setError("Enter a 6-digit code.");
      return;
    }
    setIsProcessing(true);
    setError("");
    try {
      const success = await onSubmit(password);
      if (!success) {
        setError("Invalid code. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4 text-center">Transaction Authorization</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                disabled={isProcessing}
                className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Authorize"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordAuthorization;
