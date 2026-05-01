import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { City } from '../../types/travel';

const CROWD_VARIANT = { low: 'green', medium: 'amber', high: 'red' } as const;
const CROWD_LABEL = { low: '🟢 Low crowds', medium: '🟡 Moderate', high: '🔴 Busy' };

interface Props { cities: City[]; }

export function CitiesSection({ cities }: Props) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 14 }}>
      {cities.map((city, i) => (
        <Card key={i} elevated>
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">{city.name}</Text>
              <Text className="text-slate-400 text-xs">{city.days_recommended} days recommended</Text>
            </View>
            <Badge
              label={CROWD_LABEL[city.crowd_level] ?? city.crowd_level}
              variant={CROWD_VARIANT[city.crowd_level] ?? 'slate'}
            />
          </View>

          <Text className="text-white/70 text-sm leading-5 mb-3">{city.description}</Text>

          <View className="flex-row items-center gap-1.5 mb-3 bg-sky-500/10 rounded-xl px-3 py-2">
            <Ionicons name="heart-outline" size={14} color="#38BDF8" />
            <Text className="text-sky-400 text-xs font-semibold">{city.best_for}</Text>
          </View>

          {city.highlights?.length > 0 && (
            <>
              <Text className="text-slate-400 text-xs font-semibold mb-2">TOP SPOTS</Text>
              <View className="flex-row flex-wrap gap-2">
                {city.highlights.map((h, j) => (
                  <View key={j} className="flex-row items-center gap-1 bg-white/5 rounded-full px-3 py-1">
                    <Ionicons name="location-outline" size={11} color="#F59E0B" />
                    <Text className="text-white/70 text-xs">{h}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}
