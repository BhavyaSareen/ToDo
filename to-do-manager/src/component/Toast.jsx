const Toast = ({ type, message, onClose }) => {
    const toastStyles = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
    };
  
    return (
      <div className={`fixed bottom-4 right-4 flex items-center ${toastStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out`}>
        <div className="flex-1">{message}</div>
        <button className="ml-4 text-xl" onClick={onClose}>
          &times;
        </button>
      </div>
    );
  };
  
  export default Toast;
  