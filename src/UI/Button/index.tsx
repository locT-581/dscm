"use client";

import { forwardRef } from "react";

export interface IButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default forwardRef<HTMLButtonElement, IButtonProps>(function Button(
  { children, type = "button", className, disabled = false },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      style={{
        background: disabled ? "#d1d1d1" : "linear-gradient(90deg, #41A3AE 0%, #099CAF 100%)",
        border: "none",
        color: "white",
        padding: "10px 20px",
        cursor: "pointer",
        borderRadius: "16px",
        fontSize: "1rem",
      }}
      className={`flex items-center justify-center ${className}`}
      type={type}
    >
      {children}
    </button>
  );
});
