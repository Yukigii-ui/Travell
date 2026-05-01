import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '../../hooks/useItinerary';
import { OverviewSection } from '../../components/sections/OverviewSection';
import { ItinerarySection } from '../../components/sections/ItinerarySection';
import { CitiesSection } from '../../components/sections/CitiesSection';
import { FoodSection } from '../../components/sections/FoodSection';
import { HotelsSection } from '../../components/sections/HotelsSection';
import { SportsSection } from '../../components/sections/SportsSection';
import { CrowdSection } from '../../components/sections/CrowdSection';
import { TranslateSection } from '../../components/sections/TranslateSection';
import { BudgetSection } from '../../components/sections/BudgetSection';
import { PracticalSection } from '../../components/sections/PracticalSection';
import { ItineraryMap } from '../../components/ItineraryMap';
import type { SavedItinerary } from '../../types/travel';

const { width } = Dimensions.get('window');

const TABS = [
  { key: 'overview',   label: 'Overview',  icon: 'globe-outline' },
  { key: 'itinerary',  label: 'Itinerary', icon: 'calendar-outline' },
  { key: 'map',        label: 'Map',       icon: 'map-outline' },
  { key: 'cities',     label: 'Cities',    icon: 'business-outline' },
  { key: 'food',       label: 'Food',      icon: 'restaurant-outline' },
  { key: 'hotels',     label: 'Hotels',    icon: 'bed-outline' },
  { key: 'sports',     label: 'Sports',    icon: 'football-outline' },
  { key: 'crowd',      label: 'Crowd',     icon: 'people-outline' },
  { key: 'translate',  label: 'Translate', icon: 'language-outline' },
  { key: 'budget',     label: 'Budget',    icon: 'wallet-outline' },
  { key: 'practical',  label: 'Practical', icon: 'information-circle-outline' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchById, shareItinerary } = useItinerary();
  const [saved, setSaved] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const tabScrollRef = useRef<ScrollView>(null);
  const tabRefs = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    fetchById(id).then((data) => {
      setSaved(data);
      setLoading(false);
    });
  }, [id]);

  const scrollToTab = (key: TabKey, idx: number) => {
    setActiveTab(key);
    const offset = tabRefs.current[key] ?? 0;
    tabScrollRef.current?.scrollTo({ x: Math.max(0, offset - 20), animated: true });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1120] items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-slate-400 text-sm mt-3">Loading your trip...</Text>
      </SafeAreaView>
    );
  }

  if (!saved) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1120] items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#F87171" />
        <Text className="text-white text-lg font-bold mt-4 mb-2">Trip not found</Text>
        <TouchableOpacity className="bg-amber-500 px-6 py-3 rounded-2xl" onPress={() => router.back()}>
          <Text className="text-black font-bold">Go Back</Text>
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
          <Text className="text-slate-400 text-xs mt-3 text-center">
            Tap any marker to see activity details · Use day filters above the map
          </Text>
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
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#94A3B8" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white font-bold text-base" numberOfLines={1}>
            {saved.destination}
          </Text>
          <Text className="text-slate-400 text-xs">
            {saved.travel_dates.duration_days} days · {saved.preferences.budget}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => shareItinerary(saved)}
          className="bg-sky-500/20 rounded-full w-9 h-9 items-center justify-center ml-2"
        >
          <Ionicons name="share-outline" size={18} color="#38BDF8" />
        </TouchableOpacity>
      </View>

      {/* Tab bar */}
      <View className="border-b border-white/5">
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 6 }}
        >
          {TABS.map((tab, idx) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onLayout={(e) => { tabRefs.current[tab.key] = e.nativeEvent.layout.x; }}
                onPress={() => scrollToTab(tab.key, idx)}
                className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full ${
                  active ? 'bg-amber-500' : 'bg-white/8'
                }`}
                style={!active ? { backgroundColor: 'rgba(255,255,255,0.07)' } : undefined}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={13}
                  color={active ? 'black' : '#64748B'}
                />
                <Text className={`text-xs font-semibold ${active ? 'text-black' : 'text-slate-400'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <View className="flex-1">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
