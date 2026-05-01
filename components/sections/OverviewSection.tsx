import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { TravelPlan } from '../../types/travel';

const SAFETY_COLOR: Record<string, 'green' | 'amber' | 'red' | 'sky'> = {
  very_safe: 'green',
  safe: 'green',
  moderate: 'amber',
  caution: 'red',
};

const SAFETY_LABEL: Record<string, string> = {
  very_safe: 'Very Safe',
  safe: 'Safe',
  moderate: 'Moderate Risk',
  caution: 'Exercise Caution',
};

interface Props { plan: TravelPlan; }

export function OverviewSection({ plan }: Props) {
  const { overview, destination_highlights, weather_heads_up } = plan;

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Hero description */}
      <Card>
        <Text className="text-white text-base leading-6">{overview.description}</Text>
      </Card>

      {/* Quick stats grid */}
      <View className="flex-row flex-wrap gap-3">
        {[
          { icon: 'wallet-outline', label: 'Currency', value: `${overview.currency} (${overview.currency_code})` },
          { icon: 'chatbubble-outline', label: 'Language', value: overview.language },
          { icon: 'time-outline', label: 'Timezone', value: overview.timezone },
          { icon: 'business-outline', label: 'Capital', value: overview.capital },
          { icon: 'sunny-outline', label: 'Best Time', value: overview.best_time },
        ].map(({ icon, label, value }) => (
          <Card key={label} className="flex-1 min-w-[44%] gap-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name={icon as any} size={14} color="#F59E0B" />
              <Text className="text-slate-400 text-xs">{label}</Text>
            </View>
            <Text className="text-white text-sm font-semibold">{value}</Text>
          </Card>
        ))}

        <Card className="flex-1 min-w-[44%] gap-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="shield-checkmark-outline" size={14} color="#F59E0B" />
            <Text className="text-slate-400 text-xs">Safety</Text>
          </View>
          <Badge
            label={SAFETY_LABEL[overview.safety_level] ?? overview.safety_level}
            variant={SAFETY_COLOR[overview.safety_level] ?? 'slate'}
          />
        </Card>
      </View>

      {/* Highlights */}
      {destination_highlights?.length > 0 && (
        <Card>
          <Text className="text-amber-400 font-bold mb-3">✨ Highlights</Text>
          <View className="gap-2">
            {destination_highlights.map((h, i) => (
              <View key={i} className="flex-row gap-2">
                <Text className="text-amber-500 mt-0.5">•</Text>
                <Text className="text-white/80 text-sm flex-1">{h}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Weather */}
      {weather_heads_up && (
        <Card>
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="partly-sunny-outline" size={18} color="#38BDF8" />
            <Text className="text-sky-400 font-bold">Weather Heads-Up</Text>
          </View>
          <Text className="text-white/80 text-sm mb-3">{weather_heads_up.general}</Text>
          {weather_heads_up.warnings?.length > 0 && (
            <View className="gap-1.5 mb-3">
              {weather_heads_up.warnings.map((w, i) => (
                <View key={i} className="flex-row gap-2 bg-amber-500/10 rounded-xl p-2">
                  <Ionicons name="warning-outline" size={14} color="#F59E0B" />
                  <Text className="text-amber-300 text-xs flex-1">{w}</Text>
                </View>
              ))}
            </View>
          )}
          {weather_heads_up.best_clothing?.length > 0 && (
            <>
              <Text className="text-slate-400 text-xs font-semibold mb-2">PACK THIS</Text>
              <View className="flex-row flex-wrap gap-2">
                {weather_heads_up.best_clothing.map((item, i) => (
                  <Badge key={i} label={item} variant="sky" />
                ))}
              </View>
            </>
          )}
        </Card>
      )}
    </ScrollView>
  );
}
