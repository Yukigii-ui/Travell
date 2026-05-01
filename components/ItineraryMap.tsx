import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { geocodeActivities } from '../lib/geocode';
import type { Activity, ItineraryDay } from '../types/travel';

const DAY_COLORS = ['#F59E0B', '#38BDF8', '#34D399', '#F472B6', '#A78BFA', '#FB923C', '#4ADE80'];

interface ItineraryMapProps {
  days: ItineraryDay[];
}

export function ItineraryMap({ days }: ItineraryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [activities, setActivities] = useState<(Activity & { dayIndex: number })[]>([]);

  useEffect(() => {
    const load = async () => {
      const all: (Activity & { dayIndex: number })[] = [];
      for (let i = 0; i < days.length; i++) {
        const geocoded = await geocodeActivities(days[i].activities);
        geocoded.forEach((a) => all.push({ ...a, dayIndex: i }));
      }
      setActivities(all);
    };
    load();
  }, [days]);

  const visible = activeDay !== null
    ? activities.filter((a) => a.dayIndex === activeDay)
    : activities;

  const validMarkers = visible.filter((a) => a.lat && a.lng);

  const fitToMarkers = () => {
    if (!mapRef.current || validMarkers.length === 0) return;
    mapRef.current.fitToCoordinates(
      validMarkers.map((a) => ({ latitude: a.lat, longitude: a.lng })),
      { edgePadding: { top: 60, right: 40, bottom: 60, left: 40 }, animated: true }
    );
  };

  useEffect(() => {
    const t = setTimeout(fitToMarkers, 500);
    return () => clearTimeout(t);
  }, [activities, activeDay]);

  const { width } = Dimensions.get('window');

  return (
    <View className="overflow-hidden rounded-2xl" style={{ height: 340 }}>
      {/* Day filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="absolute top-3 left-0 right-0 z-10"
        contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}
      >
        <TouchableOpacity
          onPress={() => setActiveDay(null)}
          className={`px-3 py-1.5 rounded-full shadow ${
            activeDay === null ? 'bg-amber-500' : 'bg-[#131D2E]/90'
          }`}
        >
          <Text className={`text-xs font-bold ${activeDay === null ? 'text-black' : 'text-white'}`}>
            All
          </Text>
        </TouchableOpacity>
        {days.map((d, i) => (
          <TouchableOpacity
            key={d.day}
            onPress={() => setActiveDay(activeDay === i ? null : i)}
            className={`px-3 py-1.5 rounded-full shadow`}
            style={{ backgroundColor: activeDay === i ? DAY_COLORS[i % DAY_COLORS.length] : 'rgba(19,29,46,0.9)' }}
          >
            <Text className={`text-xs font-bold ${activeDay === i ? 'text-black' : 'text-white'}`}>
              Day {d.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={{ width, height: 340 }}
        mapType="standard"
        userInterfaceStyle="dark"
        showsUserLocation={false}
        initialRegion={{
          latitude: validMarkers[0]?.lat ?? 35.6762,
          longitude: validMarkers[0]?.lng ?? 139.6503,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        {validMarkers.map((activity, idx) => {
          const color = DAY_COLORS[activity.dayIndex % DAY_COLORS.length];
          return (
            <Marker
              key={`${activity.dayIndex}-${idx}`}
              coordinate={{ latitude: activity.lat, longitude: activity.lng }}
              pinColor={color}
            >
              <View
                className="items-center justify-center rounded-full w-8 h-8 border-2 border-white shadow-lg"
                style={{ backgroundColor: color }}
              >
                <Text className="text-black text-xs font-black">
                  {activity.dayIndex + 1}
                </Text>
              </View>
              <Callout tooltip>
                <View className="bg-[#131D2E] rounded-xl p-3 w-52 shadow-xl border border-white/10">
                  <Text className="text-amber-400 text-xs font-bold mb-1">Day {activity.dayIndex + 1} · {activity.time}</Text>
                  <Text className="text-white text-sm font-semibold">{activity.activity}</Text>
                  <Text className="text-slate-400 text-xs mt-1">{activity.location}</Text>
                  {activity.cost_usd > 0 && (
                    <Text className="text-emerald-400 text-xs mt-1">${activity.cost_usd}</Text>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Fit button */}
      <TouchableOpacity
        onPress={fitToMarkers}
        className="absolute bottom-3 right-3 bg-[#131D2E]/90 rounded-full p-2 shadow"
      >
        <Ionicons name="expand-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
