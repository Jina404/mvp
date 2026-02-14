"use client";

import * as React from "react";
import type { ReactNode } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ReactNode;
};

type ToastContextValue = {
  toasts: ToastProps[];
  toast: (toast: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = (toastData: Omit<ToastProps, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, ...toastData }]);
    setTimeout(() => dismiss(id), 4000);
  };

  return React.createElement(
    ToastContext.Provider,
    { value: { toasts, toast, dismiss } },
    children
  );
}

function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export { ToastProvider, useToast };
