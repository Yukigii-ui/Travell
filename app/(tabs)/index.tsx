import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchForm } from '../../components/SearchForm';
import { PreferencesCard } from '../../components/PreferencesCard';
import { useAuth } from '../../hooks/useAuth';
import { useItinerary } from '../../hooks/useItinerary';
import type { TravelPreferences } from '../../types/travel';

const DEFAULT_PREFS: TravelPreferences = {
  budget: 'mid',
  pace: 'moderate',
  style: 'cultural',
  profile: 'solo',
  interests: [],
  duration_days: 7,
};

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { generating, generatePlan } = useItinerary();
  const [prefs, setPrefs] = useState<TravelPreferences>(DEFAULT_PREFS);
  const [showPrefs, setShowPrefs] = useState(true);

  const handleSearch = async (destination: string, start: Date, end: Date, days: number) => {
    try {
      const updatedPrefs = { ...prefs, duration_days: days };
      const saved = await generatePlan({
        destination,
        travel_dates: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
          duration_days: days,
        },
        preferences: updatedPrefs,
      });
      router.push(`/plan/${saved.id}`);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to generate plan. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1120]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View className="flex-row items-center gap-2">
          <View className="bg-amber-500 rounded-xl w-9 h-9 items-center justify-center">
            <Ionicons name="airplane" size={18} color="black" />
          </View>
          <Text className="text-white text-xl font-black tracking-tight">Travell</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Sign Out', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: signOut },
            ])
          }
          className="bg-white/10 rounded-full px-3 py-1.5 flex-row items-center gap-1.5"
        >
          <Ionicons name="person-outline" size={14} color="#94A3B8" />
          <Text className="text-slate-400 text-xs" numberOfLines={1} style={{ maxWidth: 100 }}>
            {user?.email?.split('@')[0] ?? 'Account'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#1A2540', '#131D2E']}
          className="rounded-3xl p-5 overflow-hidden"
        >
          <Text className="text-slate-400 text-sm mb-1">AI-Powered Planning</Text>
          <Text className="text-white text-2xl font-black leading-tight mb-1">
            Where are you{'\n'}going next? ✈️
          </Text>
          <Text className="text-slate-500 text-xs">
            Get a full itinerary, hotels, food, sports & more
          </Text>
        </LinearGradient>

        {/* Search */}
        <SearchForm onSearch={handleSearch} loading={generating} />

        {/* Preferences toggle */}
        <TouchableOpacity
          onPress={() => setShowPrefs(!showPrefs)}
          className="flex-row items-center justify-between bg-[#131D2E] rounded-2xl px-4 py-3"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="options-outline" size={18} color="#F59E0B" />
            <Text className="text-white font-semibold">Trip Preferences</Text>
            <View className="bg-amber-500/20 rounded-full px-2 py-0.5">
              <Text className="text-amber-400 text-xs font-bold capitalize">{prefs.budget}</Text>
            </View>
          </View>
          <Ionicons
            name={showPrefs ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#64748B"
          />
        </TouchableOpacity>

        {showPrefs && (
          <View className="bg-[#131D2E] rounded-3xl p-4">
            <PreferencesCard value={prefs} onChange={setPrefs} />
          </View>
        )}

        {/* Generating overlay info */}
        {generating && (
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex-row items-center gap-3">
            <Ionicons name="sparkles-outline" size={22} color="#F59E0B" />
            <View className="flex-1">
              <Text className="text-amber-400 font-bold text-sm">Building your itinerary...</Text>
              <Text className="text-amber-300/60 text-xs mt-0.5">
                Claude is crafting a personalised trip for you
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
