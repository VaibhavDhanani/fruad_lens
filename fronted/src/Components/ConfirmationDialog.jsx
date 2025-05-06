const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
    return (
<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50">


        <div className="bg-white p-6 rounded shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationDialog;
  