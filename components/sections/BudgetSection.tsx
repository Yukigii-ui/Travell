import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import type { BudgetBreakdown } from '../../types/travel';

interface Props {
  budget: BudgetBreakdown;
  durationDays: number;
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <View className="gap-1.5">
      <View className="flex-row justify-between">
        <Text className="text-white/70 text-sm">{label}</Text>
        <Text className="text-white font-semibold text-sm">${value}/day</Text>
      </View>
      <View className="h-2 bg-white/10 rounded-full overflow-hidden">
        <View style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full" />
      </View>
    </View>
  );
}

export function BudgetSection({ budget, durationDays }: Props) {
  const maxDaily = Math.max(
    budget.accommodation_per_night,
    budget.food_per_day,
    budget.transport_per_day,
    budget.activities_per_day,
    budget.tips_and_misc_per_day
  );

  const dailyTotal =
    budget.accommodation_per_night +
    budget.food_per_day +
    budget.transport_per_day +
    budget.activities_per_day +
    budget.tips_and_misc_per_day;

  const categories = [
    { label: '🏨 Accommodation', value: budget.accommodation_per_night, color: '#38BDF8' },
    { label: '🍜 Food & Drink', value: budget.food_per_day, color: '#F59E0B' },
    { label: '🚌 Transport', value: budget.transport_per_day, color: '#A78BFA' },
    { label: '🎯 Activities', value: budget.activities_per_day, color: '#34D399' },
    { label: '💳 Misc & Tips', value: budget.tips_and_misc_per_day, color: '#F472B6' },
  ];

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Total estimate hero */}
      <Card elevated>
        <View className="items-center py-2">
          <Text className="text-slate-400 text-sm mb-1">Estimated Total</Text>
          <Text className="text-emerald-400 font-black text-5xl">
            ${budget.total_estimated_usd.toLocaleString()}
          </Text>
          <Text className="text-slate-400 text-sm mt-1">for {durationDays} days</Text>
          <View className="flex-row items-center gap-1 mt-3 bg-emerald-500/10 rounded-full px-4 py-2">
            <Ionicons name="trending-down-outline" size={14} color="#34D399" />
            <Text className="text-emerald-400 text-sm">~${Math.round(dailyTotal)}/day</Text>
          </View>
        </View>
      </Card>

      {/* Breakdown bars */}
      <Card>
        <Text className="text-amber-400 font-bold mb-4">Daily Breakdown</Text>
        <View className="gap-4">
          {categories.map(({ label, value, color }) => (
            <BarRow key={label} label={label} value={value} max={maxDaily} color={color} />
          ))}
        </View>
      </Card>

      {/* Visual pie-like summary */}
      <View className="flex-row gap-3 flex-wrap">
        {categories.map(({ label, value, color }) => {
          const pct = Math.round((value / dailyTotal) * 100);
          return (
            <View key={label} className="bg-[#131D2E] rounded-2xl p-3 flex-1 min-w-[44%] items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: color + '22' }}
              >
                <Text className="text-xl">{label.split(' ')[0]}</Text>
              </View>
              <Text className="text-white font-bold text-base">{pct}%</Text>
              <Text className="text-slate-400 text-xs text-center">{label.slice(3)}</Text>
            </View>
          );
        })}
      </View>

      {/* Budget tips */}
      {budget.budget_tips?.length > 0 && (
        <Card>
          <Text className="text-amber-400 font-bold mb-3">💰 Money-Saving Tips</Text>
          <View className="gap-3">
            {budget.budget_tips.map((tip, i) => (
              <View key={i} className="flex-row gap-2">
                <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
                <Text className="text-white/80 text-sm flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
}
