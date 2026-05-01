import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import type { Budget, Pace, TravelStyle, TravelerProfile, TravelPreferences } from '../types/travel';

interface Option<T> { value: T; label: string; emoji: string; }

const BUDGETS: Option<Budget>[] = [
  { value: 'budget', label: 'Budget', emoji: '🎒' },
  { value: 'mid', label: 'Mid-range', emoji: '✈️' },
  { value: 'luxury', label: 'Luxury', emoji: '💎' },
];

const PACES: Option<Pace>[] = [
  { value: 'relaxed', label: 'Relaxed', emoji: '🌅' },
  { value: 'moderate', label: 'Moderate', emoji: '🗺️' },
  { value: 'packed', label: 'Packed', emoji: '⚡' },
];

const STYLES: Option<TravelStyle>[] = [
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
];

const PROFILES: Option<TravelerProfile>[] = [
  { value: 'backpacker', label: 'Backpacker', emoji: '🎒' },
  { value: 'luxury', label: 'Luxury', emoji: '🥂' },
  { value: 'couple', label: 'Couple', emoji: '💑' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { value: 'solo', label: 'Solo', emoji: '🧑' },
  { value: 'digital_nomad', label: 'Nomad', emoji: '💻' },
  { value: 'hidden_gems', label: 'Explorer', emoji: '🗺️' },
];

const INTERESTS = [
  '🍕 Food & Drink', '🏖️ Beaches', '🏛️ History', '🛍️ Shopping',
  '🎭 Arts', '🌿 Nature', '🏋️ Sports', '🎵 Music', '📸 Photography', '⛩️ Religion',
];

interface ChipRowProps<T> {
  options: Option<T>[];
  selected: T;
  onSelect: (v: T) => void;
}

function ChipRow<T extends string>({ options, selected, onSelect }: ChipRowProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
      <View className="flex-row gap-2 pb-1">
        {options.map((o) => {
          const active = o.value === selected;
          return (
            <TouchableOpacity
              key={o.value}
              onPress={() => onSelect(o.value)}
              className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
                active ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-white/20'
              }`}
            >
              <Text className="text-base">{o.emoji}</Text>
              <Text className={`text-sm font-semibold ${active ? 'text-black' : 'text-white/70'}`}>
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

interface PreferencesCardProps {
  value: TravelPreferences;
  onChange: (p: TravelPreferences) => void;
}

function SectionLabel({ label }: { label: string }) {
  return <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</Text>;
}

export function PreferencesCard({ value, onChange }: PreferencesCardProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(value.interests);

  const update = (patch: Partial<TravelPreferences>) => onChange({ ...value, ...patch });

  const toggleInterest = (interest: string) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(next);
    update({ interests: next });
  };

  return (
    <View className="gap-5">
      <View>
        <SectionLabel label="Who are you?" />
        <ChipRow options={PROFILES} selected={value.profile} onSelect={(v) => update({ profile: v })} />
      </View>

      <View>
        <SectionLabel label="Budget" />
        <ChipRow options={BUDGETS} selected={value.budget} onSelect={(v) => update({ budget: v })} />
      </View>

      <View>
        <SectionLabel label="Pace" />
        <ChipRow options={PACES} selected={value.pace} onSelect={(v) => update({ pace: v })} />
      </View>

      <View>
        <SectionLabel label="Travel Style" />
        <ChipRow options={STYLES} selected={value.style} onSelect={(v) => update({ style: v })} />
      </View>

      <View>
        <SectionLabel label="Interests (tap to toggle)" />
        <View className="flex-row flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const active = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                onPress={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full border ${
                  active ? 'bg-sky-500/20 border-sky-500' : 'border-white/15'
                }`}
              >
                <Text className={`text-sm ${active ? 'text-sky-400' : 'text-white/60'}`}>
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
