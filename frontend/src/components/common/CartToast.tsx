"use client";
import React, { useEffect } from "react";

interface CartToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const CartToast: React.FC<CartToastProps> = ({
  isVisible,
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] animate-slide-in-right">
      <div className="flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 hover:opacity-80"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
