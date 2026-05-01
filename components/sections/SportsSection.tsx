import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Sport } from '../../types/travel';

const CATEGORY_ICON: Record<string, string> = {
  water: '🏄',
  land: '🥾',
  air: '🪂',
  spectator: '🏟️',
  fitness: '🏋️',
  team: '⚽',
};

const DIFF_VARIANT = { easy: 'green', moderate: 'amber', hard: 'red' } as const;

interface Props { sports: Sport[]; }

export function SportsSection({ sports }: Props) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 14 }}>
      {sports.map((sport, i) => (
        <Card key={i} elevated>
          <View className="flex-row items-start gap-3 mb-2">
            <Text className="text-3xl">{CATEGORY_ICON[sport.category] ?? '🏅'}</Text>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">{sport.name}</Text>
              <Text className="text-slate-400 text-xs capitalize">{sport.category.replace('_', ' ')} · {sport.best_season}</Text>
            </View>
            {sport.cost_usd > 0 ? (
              <View className="bg-emerald-500/20 rounded-lg px-2 py-1">
                <Text className="text-emerald-400 text-xs font-bold">${sport.cost_usd}</Text>
              </View>
            ) : (
              <View className="bg-emerald-500/20 rounded-lg px-2 py-1">
                <Text className="text-emerald-400 text-xs font-bold">Free</Text>
              </View>
            )}
          </View>

          <Text className="text-white/70 text-sm leading-5 mb-3">{sport.description}</Text>

          <View className="flex-row items-center gap-2 bg-[#0B1120] rounded-xl px-3 py-2 mb-3">
            <Ionicons name="location-outline" size={13} color="#38BDF8" />
            <Text className="text-sky-400 text-xs flex-1">{sport.location}</Text>
          </View>

          <View className="flex-row gap-2">
            <Badge label={sport.difficulty} variant={DIFF_VARIANT[sport.difficulty] ?? 'slate'} />
            {sport.booking_required && (
              <Badge label="Book in advance" variant="amber" />
            )}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
