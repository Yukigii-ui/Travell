import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ItineraryDay } from '../types/travel';

interface ItineraryMapProps {
  days: ItineraryDay[];
}

export function ItineraryMap({ days }: ItineraryMapProps) {
  const totalActivities = days.reduce((n, d) => n + d.activities.length, 0);
  return (
    <View
      className="overflow-hidden rounded-2xl items-center justify-center bg-[#131D2E]"
      style={{ height: 340 }}
    >
      <Ionicons name="map-outline" size={48} color="#F59E0B" />
      <Text className="text-white font-bold text-base mt-3">Interactive Map</Text>
      <Text className="text-slate-400 text-sm mt-1 text-center px-8">
        {days.length} days · {totalActivities} locations
      </Text>
      <Text className="text-slate-500 text-xs mt-2 text-center px-8">
        Available in the mobile app (iOS / Android)
      </Text>
    </View>
  );
}
