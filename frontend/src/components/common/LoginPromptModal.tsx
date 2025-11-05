"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  const handleRegister = () => {
    onClose();
    router.push("/register");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4">
      <div className="p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Authentication Required
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please login or register to add items to cart.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
          >
            Register
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-lg px-6 py-3 text-center font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
