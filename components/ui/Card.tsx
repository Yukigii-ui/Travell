import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

export function Card({ elevated, className = '', style, children, ...props }: CardProps) {
  const bg = elevated ? 'bg-[#1A2540]' : 'bg-[#131D2E]';
  return (
    <View
      className={`${bg} rounded-2xl p-4 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
