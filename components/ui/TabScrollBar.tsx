import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

interface Tab {
  key: string;
  label: string;
  icon?: string;
}

interface TabScrollBarProps {
  tabs: Tab[];
  active: string;
  onSelect: (key: string) => void;
}

export function TabScrollBar({ tabs, active, onSelect }: TabScrollBarProps) {
  return (
    <View className="border-b border-white/10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 4 }}
        className="py-2"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              className={`flex-row items-center gap-1 px-4 py-2 rounded-full mr-2 ${
                isActive ? 'bg-amber-500' : 'bg-white/10'
              }`}
            >
              {tab.icon ? (
                <Text className={`text-sm ${isActive ? 'text-black' : 'text-white/60'}`}>
                  {tab.icon}
                </Text>
              ) : null}
              <Text
                className={`text-sm font-semibold ${isActive ? 'text-black' : 'text-white/70'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
