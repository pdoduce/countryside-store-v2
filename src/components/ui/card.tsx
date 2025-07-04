import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

export const Card = ({ 
  children, 
  className = "", 
  onClick,
  role,
  ariaLabel 
}: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow p-4 ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

// Variant with Header (optional extension)
interface CardWithHeaderProps extends CardProps {
  title?: string;
  icon?: ReactNode;
}

export const CardWithHeader = ({ 
  title, 
  icon, 
  children, 
  className = "" 
}: CardWithHeaderProps) => {
  return (
    <Card className={className}>
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      {children}
    </Card>
  );
};