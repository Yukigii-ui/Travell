import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import type { TravelPlan } from '../../types/travel';

interface InfoRowProps {
  icon: string;
  title: string;
  content: string;
  iconColor?: string;
}

function InfoRow({ icon, title, content, iconColor = '#F59E0B' }: InfoRowProps) {
  return (
    <View className="bg-[#0B1120] rounded-xl p-4 gap-2">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon as any} size={16} color={iconColor} />
        <Text className="text-amber-400 font-bold text-sm">{title}</Text>
      </View>
      <Text className="text-white/80 text-sm leading-5">{content}</Text>
    </View>
  );
}

interface Props { practical: TravelPlan['practical']; }

export function PracticalSection({ practical }: Props) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Card>
        <Text className="text-white font-bold mb-4">📋 Travel Essentials</Text>
        <View className="gap-3">
          <InfoRow
            icon="document-text-outline"
            title="Visa Info"
            content={practical.visa_info}
            iconColor="#38BDF8"
          />
          <InfoRow
            icon="bus-outline"
            title="Getting Around"
            content={practical.transport}
          />
          <InfoRow
            icon="airplane-outline"
            title="Airport Transfer"
            content={practical.airport_transfer}
            iconColor="#A78BFA"
          />
          <InfoRow
            icon="phone-portrait-outline"
            title="SIM Card"
            content={practical.sim_card}
            iconColor="#34D399"
          />
        </View>
      </Card>

      <Card>
        <Text className="text-white font-bold mb-4">💡 Good to Know</Text>
        <View className="gap-3">
          <InfoRow
            icon="wallet-outline"
            title="Money & Currency"
            content={practical.currency_tips}
          />
          <InfoRow
            icon="restaurant-outline"
            title="Tipping Culture"
            content={practical.tipping_culture}
            iconColor="#F472B6"
          />
          <InfoRow
            icon="medkit-outline"
            title="Health Tips"
            content={practical.health_tips}
            iconColor="#F87171"
          />
          <InfoRow
            icon="call-outline"
            title="Emergency Numbers"
            content={practical.emergency_numbers}
            iconColor="#F87171"
          />
        </View>
      </Card>
    </ScrollView>
  );
}
