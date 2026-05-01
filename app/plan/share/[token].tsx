import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '../../../hooks/useItinerary';
import { OverviewSection } from '../../../components/sections/OverviewSection';
import { ItinerarySection } from '../../../components/sections/ItinerarySection';
import { CitiesSection } from '../../../components/sections/CitiesSection';
import { FoodSection } from '../../../components/sections/FoodSection';
import { HotelsSection } from '../../../components/sections/HotelsSection';
import { SportsSection } from '../../../components/sections/SportsSection';
import { CrowdSection } from '../../../components/sections/CrowdSection';
import { TranslateSection } from '../../../components/sections/TranslateSection';
import { BudgetSection } from '../../../components/sections/BudgetSection';
import { PracticalSection } from '../../../components/sections/PracticalSection';
import { ItineraryMap } from '../../../components/ItineraryMap';
import type { SavedItinerary } from '../../../types/travel';

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: 'globe-outline' },
  { key: 'itinerary', label: 'Itinerary', icon: 'calendar-outline' },
  { key: 'map',       label: 'Map',       icon: 'map-outline' },
  { key: 'cities',    label: 'Cities',    icon: 'business-outline' },
  { key: 'food',      label: 'Food',      icon: 'restaurant-outline' },
  { key: 'hotels',    label: 'Hotels',    icon: 'bed-outline' },
  { key: 'sports',    label: 'Sports',    icon: 'football-outline' },
  { key: 'crowd',     label: 'Crowd',     icon: 'people-outline' },
  { key: 'translate', label: 'Translate', icon: 'language-outline' },
  { key: 'budget',    label: 'Budget',    icon: 'wallet-outline' },
  { key: 'practical', label: 'Practical', icon: 'information-circle-outline' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function ShareScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { fetchByToken } = useItinerary();
  const [saved, setSaved] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const tabScrollRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    if (!token) return;
    fetchByToken(token).then((data) => {
      setSaved(data);
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1120] items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-slate-400 text-sm mt-3">Loading shared trip...</Text>
      </SafeAreaView>
    );
  }

  if (!saved) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1120] items-center justify-center px-6">
        <Ionicons name="link-outline" size={48} color="#F87171" />
        <Text className="text-white text-lg font-bold mt-4 mb-2 text-center">
          This link is no longer available
        </Text>
        <TouchableOpacity
          className="bg-amber-500 px-6 py-3 rounded-2xl mt-4"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-black font-bold">Plan Your Own Trip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const plan = saved.itinerary_data;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':   return <OverviewSection plan={plan} />;
      case 'itinerary':  return <ItinerarySection days={plan.itinerary} />;
      case 'map':        return (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <ItineraryMap days={plan.itinerary} />
        </ScrollView>
      );
      case 'cities':     return <CitiesSection cities={plan.cities} />;
      case 'food':       return <FoodSection food={plan.food} />;
      case 'hotels':     return <HotelsSection hotels={plan.hotels} />;
      case 'sports':     return <SportsSection sports={plan.sports} />;
      case 'crowd':      return <CrowdSection crowd_info={plan.crowd_info} />;
      case 'translate':  return <TranslateSection phrases={plan.phrases} language={plan.overview.language} />;
      case 'budget':     return <BudgetSection budget={plan.budget} durationDays={saved.travel_dates.duration_days} />;
      case 'practical':  return <PracticalSection practical={plan.practical} />;
      default:           return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1120]">
      {/* Shared banner */}
      <View className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 flex-row items-center gap-2">
        <Ionicons name="share-social-outline" size={14} color="#38BDF8" />
        <Text className="text-sky-400 text-xs flex-1">Shared trip — view only</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text className="text-amber-400 text-xs font-semibold">Plan my own →</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View className="px-4 py-3 border-b border-white/5">
        <Text className="text-white font-bold text-lg">{saved.destination}</Text>
        <Text className="text-slate-400 text-xs">
          {saved.travel_dates.duration_days} days · {saved.preferences.budget} · {saved.preferences.style}
        </Text>
      </View>

      {/* Tab bar */}
      <View className="border-b border-white/5">
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 6 }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full`}
                style={{ backgroundColor: active ? '#F59E0B' : 'rgba(255,255,255,0.07)' }}
              >
                <Ionicons name={tab.icon as any} size={13} color={active ? 'black' : '#64748B'} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: active ? 'black' : '#64748B' }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-1">{renderContent()}</View>
    </SafeAreaView>
  );
}
