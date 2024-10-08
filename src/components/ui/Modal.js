// src/components/ui/Modal.js

import React from 'react';

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 반투명 처리 */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* 모달 내용 */}
      <div className="bg-gray-800 p-6 rounded-md z-10 max-w-md w-full">
        {children}
      </div>
    </div>
  );
}

export default Modal;
