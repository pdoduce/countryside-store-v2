// src/components/ui/button.tsx
import React from "react";
import clsx from "clsx"; // Optional: for easier className joining

type ButtonVariant = "default" | "outline" | "destructive";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  variant = "default",
  size = "md",
  disabled = false,
  className = "",
}: ButtonProps) => {
  const base =
    "rounded px-4 py-2 font-medium border transition-all disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    default: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    outline: "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50",
    destructive: "bg-red-600 text-white border-red-600 hover:bg-red-700",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "text-sm",
    md: "text-base",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
