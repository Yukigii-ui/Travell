import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface SearchFormProps {
  onSearch: (destination: string, start: Date, end: Date, days: number) => void;
  loading?: boolean;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const days = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const handleSearch = () => {
    if (!destination.trim()) return;
    onSearch(destination.trim(), startDate, endDate, days);
  };

  return (
    <View className="gap-4">
      {/* Destination */}
      <View className="bg-[#1A2540] rounded-2xl flex-row items-center px-4 h-14">
        <Ionicons name="search" size={20} color="#F59E0B" />
        <TextInput
          className="flex-1 ml-3 text-white text-base"
          placeholder="Where to? (e.g. Japan, Bali, Paris)"
          placeholderTextColor="#64748B"
          value={destination}
          onChangeText={setDestination}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {destination.length > 0 && (
          <TouchableOpacity onPress={() => setDestination('')}>
            <Ionicons name="close-circle" size={20} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Dates row */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 bg-[#1A2540] rounded-2xl px-4 h-14 justify-center"
          onPress={() => setShowStart(true)}
        >
          <Text className="text-slate-500 text-xs mb-0.5">Departure</Text>
          <Text className="text-white text-sm font-medium">{fmtDate(startDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-[#1A2540] rounded-2xl px-4 h-14 justify-center"
          onPress={() => setShowEnd(true)}
        >
          <Text className="text-slate-500 text-xs mb-0.5">Return</Text>
          <Text className="text-white text-sm font-medium">{fmtDate(endDate)}</Text>
        </TouchableOpacity>
      </View>

      {/* Trip length indicator */}
      <View className="flex-row items-center justify-center gap-2">
        <Ionicons name="time-outline" size={16} color="#F59E0B" />
        <Text className="text-amber-400 text-sm font-semibold">{days}-day trip</Text>
      </View>

      {showStart && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={(_, date) => {
            setShowStart(false);
            if (date) {
              setStartDate(date);
              if (date >= endDate) {
                const newEnd = new Date(date);
                newEnd.setDate(newEnd.getDate() + 7);
                setEndDate(newEnd);
              }
            }
          }}
        />
      )}

      {showEnd && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={startDate}
          onChange={(_, date) => {
            setShowEnd(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Generate button */}
      <TouchableOpacity
        className={`h-14 rounded-2xl items-center justify-center ${
          loading || !destination.trim() ? 'bg-amber-500/40' : 'bg-amber-500'
        }`}
        onPress={handleSearch}
        disabled={loading || !destination.trim()}
      >
        {loading ? (
          <Text className="text-black font-bold text-base">Planning your trip...</Text>
        ) : (
          <View className="flex-row items-center gap-2">
            <Ionicons name="sparkles" size={20} color="black" />
            <Text className="text-black font-bold text-base">Generate Itinerary</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
