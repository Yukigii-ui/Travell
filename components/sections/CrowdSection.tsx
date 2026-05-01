import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { TravelPlan } from '../../types/travel';

const ALL_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CROWD_COLOR = {
  low: '#34D399',
  medium: '#F59E0B',
  high: '#F87171',
};

function MonthChart({ crowd_info }: { crowd_info: TravelPlan['crowd_info'] }) {
  return (
    <View className="flex-row justify-between gap-1">
      {ALL_MONTHS.map((month) => {
        const isPeak = crowd_info.peak_months?.some(
          (m) => m.toLowerCase().includes(month.toLowerCase())
        );
        const isOff = crowd_info.off_peak_months?.some(
          (m) => m.toLowerCase().includes(month.toLowerCase())
        );
        const color = isPeak ? '#F87171' : isOff ? '#34D399' : '#F59E0B';
        return (
          <View key={month} className="items-center flex-1">
            <View
              className="w-full rounded-sm mb-1"
              style={{ height: isPeak ? 32 : isOff ? 12 : 22, backgroundColor: color, opacity: 0.8 }}
            />
            <Text className="text-slate-500 text-[9px]">{month}</Text>
          </View>
        );
      })}
    </View>
  );
}

interface Props { crowd_info: TravelPlan['crowd_info']; }

export function CrowdSection({ crowd_info }: Props) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Current estimate */}
      <Card>
        <Text className="text-slate-400 text-xs font-semibold mb-2">CURRENT CROWD ESTIMATE</Text>
        <View className="flex-row items-center gap-3">
          <View
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: CROWD_COLOR[crowd_info.current_crowd_estimate] + '33' }}
          >
            <Ionicons
              name="people-outline"
              size={26}
              color={CROWD_COLOR[crowd_info.current_crowd_estimate]}
            />
          </View>
          <View>
            <Text className="text-white font-bold text-xl capitalize">
              {crowd_info.current_crowd_estimate}
            </Text>
            <Text className="text-slate-400 text-xs">Right now</Text>
          </View>
        </View>
      </Card>

      {/* Overview */}
      <Card>
        <Text className="text-white/80 text-sm leading-6">{crowd_info.overview}</Text>
      </Card>

      {/* Monthly bar chart */}
      <Card>
        <Text className="text-amber-400 font-bold mb-4">Crowd by Month</Text>
        <MonthChart crowd_info={crowd_info} />
        <View className="flex-row gap-4 mt-4 justify-center">
          {[['#34D399', 'Off-peak'], ['#F59E0B', 'Shoulder'], ['#F87171', 'Peak']].map(
            ([color, label]) => (
              <View key={label} className="flex-row items-center gap-1.5">
                <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <Text className="text-slate-400 text-xs">{label}</Text>
              </View>
            )
          )}
        </View>
      </Card>

      {/* Month lists */}
      {[
        { title: '🔴 Peak Months', months: crowd_info.peak_months, variant: 'red' as const },
        { title: '🟡 Shoulder Months', months: crowd_info.shoulder_months, variant: 'amber' as const },
        { title: '🟢 Off-Peak Months', months: crowd_info.off_peak_months, variant: 'green' as const },
      ].map(({ title, months, variant }) =>
        months?.length ? (
          <Card key={title}>
            <Text className="text-white font-bold mb-3">{title}</Text>
            <View className="flex-row flex-wrap gap-2">
              {months.map((m, i) => (
                <Badge key={i} label={m} variant={variant} />
              ))}
            </View>
          </Card>
        ) : null
      )}

      {/* Tips */}
      {crowd_info.tips?.length > 0 && (
        <Card>
          <Text className="text-amber-400 font-bold mb-3">💡 Crowd Tips</Text>
          <View className="gap-2">
            {crowd_info.tips.map((tip, i) => (
              <View key={i} className="flex-row gap-2">
                <Ionicons name="checkmark-circle-outline" size={16} color="#F59E0B" />
                <Text className="text-white/80 text-sm flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
}
