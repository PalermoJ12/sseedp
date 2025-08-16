import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Toast: React.FC<ToastProps> = ({ message, type = "success", open, onOpenChange }) => {
  if (!open) return null;

  let bgClass = "bg-green-500 text-white";
  if (type === "error") bgClass = "bg-red-500 text-white";
  if (type === "info") bgClass = "bg-blue-500 text-white";

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center justify-between gap-4 rounded-md p-3 shadow-lg animate-in slide-in-from-bottom-2",
        bgClass
      )}
    >
      <span>{message}</span>
      <button onClick={() => onOpenChange && onOpenChange(false)}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
