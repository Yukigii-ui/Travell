import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Food } from '../../types/travel';

const TYPE_ICONS: Record<string, string> = {
  dish: '🍽️',
  restaurant: '🏪',
  street_food: '🥡',
  cafe: '☕',
  market: '🛒',
};

const DIET_VARIANT: Record<string, 'green' | 'amber' | 'sky' | 'purple'> = {
  vegetarian: 'green',
  vegan: 'green',
  halal: 'amber',
  'gluten-free': 'purple',
  spicy: 'red' as any,
};

const FILTERS = ['All', 'dish', 'restaurant', 'street_food', 'cafe', 'market'];

interface Props { food: Food[]; }

export function FoodSection({ food }: Props) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? food : food.filter((f) => f.type === filter);
  const mustTry = visible.filter((f) => f.must_try);
  const rest = visible.filter((f) => !f.must_try);

  return (
    <ScrollView className="flex-1">
      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-white/10 py-3"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full ${filter === f ? 'bg-amber-500' : 'bg-white/10'}`}
          >
            <Text className={`text-sm font-semibold capitalize ${filter === f ? 'text-black' : 'text-white/70'}`}>
              {TYPE_ICONS[f] ?? ''} {f === 'street_food' ? 'Street Food' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="p-4 gap-3">
        {mustTry.length > 0 && (
          <>
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-amber-400 font-bold">Must Try</Text>
            </View>
            {mustTry.map((item, i) => <FoodCard key={i} item={item} />)}
            {rest.length > 0 && (
              <Text className="text-slate-400 font-bold mt-2 mb-1">More Options</Text>
            )}
          </>
        )}
        {rest.map((item, i) => <FoodCard key={i} item={item} />)}
      </View>
    </ScrollView>
  );
}

function FoodCard({ item }: { item: Food }) {
  return (
    <Card elevated>
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">{TYPE_ICONS[item.type] ?? '🍽️'}</Text>
            <Text className="text-white font-bold text-base">{item.name}</Text>
            {item.must_try && (
              <Ionicons name="star" size={14} color="#F59E0B" />
            )}
          </View>
          <Text className="text-slate-400 text-xs capitalize ml-8">{item.type.replace('_', ' ')}</Text>
        </View>
        <View className="bg-emerald-500/20 rounded-lg px-2 py-1">
          <Text className="text-emerald-400 text-xs font-bold">{item.price_range}</Text>
        </View>
      </View>

      <Text className="text-white/70 text-sm leading-5 mb-3">{item.description}</Text>

      {item.where_to_find && (
        <View className="flex-row items-center gap-1.5 mb-3 bg-[#0B1120] rounded-xl px-3 py-2">
          <Ionicons name="location-outline" size={13} color="#38BDF8" />
          <Text className="text-sky-400 text-xs flex-1">{item.where_to_find}</Text>
        </View>
      )}

      {item.dietary_tags?.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {item.dietary_tags.map((tag, i) => (
            <Badge key={i} label={tag} variant={DIET_VARIANT[tag.toLowerCase()] ?? 'slate'} />
          ))}
        </View>
      )}
    </Card>
  );
}
