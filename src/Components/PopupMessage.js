import { useEffect } from "react";
export default function PopupMessage({ message, onClose }) {
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 2000);
  
      return () => clearTimeout(timeoutId);
    }, [onClose]);
  
    return (
      <div className="popup-message">
        <p>{message}</p>
      </div>
    );
  }