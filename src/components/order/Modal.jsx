import React from "react";

function Modal({ isActive, children }) {
  if (!isActive) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative z-10 w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}

export default Modal;