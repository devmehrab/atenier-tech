"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (options: { title?: string; message: string; type?: ToastType; duration?: number }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      title,
      message,
      type = "info",
      duration = 4000,
    }: {
      title?: string;
      message: string;
      type?: ToastType;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => {
    addToast({ title, message, type: "success" });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ title, message, type: "error" });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ title, message, type: "info" });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 animate-in slide-in-from-bottom-5 bg-card text-card-foreground",
              t.type === "success" && "border-primary/30 bg-card",
              t.type === "error" && "border-destructive/30 bg-card",
              t.type === "info" && "border-sky-500/30 bg-card",
              t.type === "warning" && "border-amber-500/30 bg-card"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />}
            {t.type === "warning" && <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              {t.title && <h5 className="font-semibold text-card-foreground mb-0.5">{t.title}</h5>}
              <p className="text-muted-foreground leading-snug">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-card-foreground p-0.5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
