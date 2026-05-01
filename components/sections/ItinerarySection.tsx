import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import type { ItineraryDay } from '../../types/travel';

const CATEGORY_ICON: Record<string, string> = {
  attraction: 'camera-outline',
  food: 'restaurant-outline',
  transport: 'car-outline',
  hotel: 'bed-outline',
  nightlife: 'moon-outline',
  nature: 'leaf-outline',
  sport: 'fitness-outline',
};

interface Props {
  days: ItineraryDay[];
}

export function ItinerarySection({ days }: Props) {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
      {days.map((day, idx) => {
        const isOpen = expanded === idx;
        return (
          <Card key={day.day} elevated={isOpen}>
            <TouchableOpacity
              onPress={() => setExpanded(isOpen ? -1 : idx)}
              className="flex-row items-center justify-between"
            >
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-0.5">
                  <View className="bg-amber-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-black text-xs font-black">{day.day}</Text>
                  </View>
                  <Text className="text-amber-400 text-xs font-semibold">{day.area}</Text>
                </View>
                <Text className="text-white font-bold text-base">{day.title}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  {day.activities.length} activities · ~${day.total_cost_usd}
                </Text>
              </View>
              <Ionicons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>

            {isOpen && (
              <View className="mt-4 gap-3">
                {day.activities.map((activity, aIdx) => (
                  <View key={aIdx} className="flex-row gap-3">
                    {/* Timeline */}
                    <View className="items-center w-10">
                      <Text className="text-amber-400 text-xs font-bold">{activity.time}</Text>
                      {aIdx < day.activities.length - 1 && (
                        <View className="w-0.5 flex-1 bg-white/10 my-1 min-h-4" />
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 bg-[#0B1120] rounded-xl p-3 mb-2">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-1.5 mb-1">
                            <Ionicons
                              name={(CATEGORY_ICON[activity.category] ?? 'ellipse-outline') as any}
                              size={12}
                              color="#94A3B8"
                            />
                            <Text className="text-slate-400 text-xs capitalize">
                              {activity.category}
                              {activity.indoor ? ' · Indoor' : ''}
                            </Text>
                          </View>
                          <Text className="text-white text-sm font-semibold">
                            {activity.activity}
                          </Text>
                          <Text className="text-slate-400 text-xs mt-0.5">{activity.location}</Text>
                        </View>
                        {activity.cost_usd > 0 && (
                          <View className="bg-emerald-500/20 rounded-lg px-2 py-1 ml-2">
                            <Text className="text-emerald-400 text-xs font-bold">
                              ${activity.cost_usd}
                            </Text>
                          </View>
                        )}
                      </View>
                      {activity.notes ? (
                        <Text className="text-slate-500 text-xs mt-2 italic">{activity.notes}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}
