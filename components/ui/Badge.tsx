import React from 'react';
import { View, Text } from 'react-native';

type Variant = 'amber' | 'sky' | 'green' | 'red' | 'slate' | 'purple';

const VARIANTS: Record<Variant, { bg: string; text: string }> = {
  amber:  { bg: 'bg-amber-500/20',  text: 'text-amber-400' },
  sky:    { bg: 'bg-sky-500/20',    text: 'text-sky-400' },
  green:  { bg: 'bg-emerald-500/20',text: 'text-emerald-400' },
  red:    { bg: 'bg-red-500/20',    text: 'text-red-400' },
  slate:  { bg: 'bg-slate-500/20',  text: 'text-slate-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

interface BadgeProps {
  label: string;
  variant?: Variant;
  className?: string;
}

export function Badge({ label, variant = 'slate', className = '' }: BadgeProps) {
  const { bg, text } = VARIANTS[variant];
  return (
    <View className={`${bg} rounded-full px-3 py-1 ${className}`}>
      <Text className={`${text} text-xs font-semibold`}>{label}</Text>
    </View>
  );
}
