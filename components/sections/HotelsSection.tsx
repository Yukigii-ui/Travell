import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Hotel } from '../../types/travel';

interface Props { hotels: Hotel[]; }

function StarRating({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons key={s} name="star" size={10} color={s <= Math.round(rating) ? '#F59E0B' : '#374151'} />
      ))}
      <Text className="text-amber-400 text-xs ml-1">{rating.toFixed(1)}</Text>
    </View>
  );
}

export function HotelsSection({ hotels }: Props) {
  const sorted = [...hotels].sort((a, b) => a.price_per_night_usd - b.price_per_night_usd);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View className="flex-row items-center gap-2 bg-sky-500/10 rounded-xl px-4 py-3 mb-1">
        <Ionicons name="information-circle-outline" size={16} color="#38BDF8" />
        <Text className="text-sky-400 text-xs flex-1">
          Listed from cheapest to most expensive. Book directly or via your preferred platform.
        </Text>
      </View>

      {sorted.map((hotel, i) => (
        <Card key={i} elevated>
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-white font-bold text-base">{hotel.name}</Text>
              <Text className="text-slate-400 text-xs">{hotel.area} · {hotel.location}</Text>
              <View className="mt-1">
                <StarRating rating={hotel.rating} />
              </View>
            </View>
            <View className="items-end">
              <Text className="text-emerald-400 font-black text-lg">
                ${hotel.price_per_night_usd}
              </Text>
              <Text className="text-slate-500 text-xs">/night</Text>
            </View>
          </View>

          <Text className="text-white/70 text-sm leading-5 mb-3">{hotel.description}</Text>

          <View className="flex-row items-center gap-1.5 bg-amber-500/10 rounded-xl px-3 py-2 mb-3">
            <Ionicons name="heart-outline" size={13} color="#F59E0B" />
            <Text className="text-amber-400 text-xs flex-1">Best for: {hotel.best_for}</Text>
          </View>

          {hotel.amenities?.length > 0 && (
            <>
              <Text className="text-slate-400 text-xs font-semibold mb-2">AMENITIES</Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {hotel.amenities.map((a, j) => (
                  <Badge key={j} label={a} variant="slate" />
                ))}
              </View>
            </>
          )}

          {hotel.booking_tip && (
            <View className="flex-row items-start gap-2 bg-[#0B1120] rounded-xl px-3 py-2">
              <Ionicons name="bulb-outline" size={14} color="#34D399" />
              <Text className="text-emerald-400 text-xs flex-1">{hotel.booking_tip}</Text>
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}
