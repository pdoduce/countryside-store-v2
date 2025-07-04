// src/components/ui/card.tsx
import React from "react";

export const Card = ({ children, className = "" }: any) => {
  return (
    <div className={`bg-white rounded-xl shadow p-4 ${className}`}>
      {children}
    </div>
  );
};
