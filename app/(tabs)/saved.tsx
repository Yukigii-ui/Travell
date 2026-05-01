import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  Alert, RefreshControl, ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '../../hooks/useItinerary';
import type { SavedItinerary } from '../../types/travel';

const BUDGET_EMOJI: Record<string, string> = { budget: '🎒', mid: '✈️', luxury: '💎' };
const PACE_EMOJI: Record<string, string> = { relaxed: '🌅', moderate: '🗺️', packed: '⚡' };

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SavedScreen() {
  const { fetchSaved, deleteItinerary, shareItinerary } = useItinerary();
  const [trips, setTrips] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchSaved();
      setTrips(data);
    } catch {
      // silently fail, show empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchSaved]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (trip: SavedItinerary) => {
    Alert.alert(
      'Delete Trip',
      `Remove "${trip.travel_dates.duration_days} days in ${trip.destination}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            await deleteItinerary(trip.id);
            setTrips((prev) => prev.filter((t) => t.id !== trip.id));
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1120] items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B1120]">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-black">Saved Trips</Text>
        <Text className="text-slate-400 text-sm">{trips.length} itinerar{trips.length === 1 ? 'y' : 'ies'}</Text>
      </View>

      {trips.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-amber-500/10 rounded-full w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="bookmark-outline" size={36} color="#F59E0B" />
          </View>
          <Text className="text-white text-xl font-bold mb-2 text-center">No trips yet</Text>
          <Text className="text-slate-400 text-sm text-center mb-6">
            Generate your first travel plan and it'll appear here
          </Text>
          <TouchableOpacity
            className="bg-amber-500 px-6 py-3 rounded-2xl"
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-black font-bold">Plan a Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 14 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor="#F59E0B"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              className="bg-[#131D2E] rounded-2xl p-4 active:opacity-80"
              onPress={() => router.push(`/plan/${trip.id}`)}
            >
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg" numberOfLines={1}>
                    {trip.destination}
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    {fmt(trip.travel_dates.start)} – {fmt(trip.travel_dates.end)}
                  </Text>
                  <View className="bg-amber-500/20 rounded-full px-2 py-0.5 mt-1.5 self-start">
                    <Text className="text-amber-400 text-xs font-bold">
                      {trip.travel_dates.duration_days} days
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2 ml-3">
                  <TouchableOpacity
                    onPress={() => shareItinerary(trip)}
                    className="bg-sky-500/20 rounded-full w-9 h-9 items-center justify-center"
                  >
                    <Ionicons name="share-outline" size={16} color="#38BDF8" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(trip)}
                    className="bg-red-500/20 rounded-full w-9 h-9 items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={16} color="#F87171" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Preferences row */}
              <View className="flex-row gap-2 flex-wrap">
                <View className="bg-white/10 rounded-full px-2.5 py-1 flex-row items-center gap-1">
                  <Text className="text-xs">{BUDGET_EMOJI[trip.preferences.budget] ?? '✈️'}</Text>
                  <Text className="text-white/70 text-xs capitalize">{trip.preferences.budget}</Text>
                </View>
                <View className="bg-white/10 rounded-full px-2.5 py-1 flex-row items-center gap-1">
                  <Text className="text-xs">{PACE_EMOJI[trip.preferences.pace] ?? '🗺️'}</Text>
                  <Text className="text-white/70 text-xs capitalize">{trip.preferences.pace}</Text>
                </View>
                <View className="bg-white/10 rounded-full px-2.5 py-1">
                  <Text className="text-white/70 text-xs capitalize">{trip.preferences.style}</Text>
                </View>
              </View>

              {/* Footer */}
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-white/5">
                <Text className="text-slate-500 text-xs">
                  Created {fmt(trip.created_at)}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-amber-400 text-xs font-semibold">View</Text>
                  <Ionicons name="chevron-forward" size={12} color="#F59E0B" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
