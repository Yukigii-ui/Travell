import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Phrase } from '../../types/travel';

const CATEGORIES = ['all', 'greeting', 'direction', 'food', 'emergency', 'transport', 'shopping'];
const CAT_EMOJI: Record<string, string> = {
  all: '🌐',
  greeting: '👋',
  direction: '🗺️',
  food: '🍜',
  emergency: '🚨',
  transport: '🚌',
  shopping: '🛍️',
};

interface Props {
  phrases: Phrase[];
  language: string;
}

export function TranslateSection({ phrases, language }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<{ translation: string; pronunciation: string; notes: string } | null>(null);
  const [translating, setTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const visible = activeCategory === 'all'
    ? phrases
    : phrases.filter((p) => p.category === activeCategory);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setTranslating(true);
    setTranslation(null);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text: inputText.trim(), to_language: language },
      });
      if (error) throw error;
      setTranslation(data);
    } catch {
      setTranslation({ translation: 'Translation failed', pronunciation: '', notes: '' });
    } finally {
      setTranslating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Live translator */}
        <Card elevated>
          <Text className="text-amber-400 font-bold mb-3">🔤 Translate to {language}</Text>
          <View className="bg-[#0B1120] rounded-xl p-3 flex-row gap-2 items-start">
            <TextInput
              className="flex-1 text-white text-sm"
              placeholder="Type any phrase in English..."
              placeholderTextColor="#475569"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={2}
              onSubmitEditing={handleTranslate}
            />
            <TouchableOpacity
              onPress={handleTranslate}
              disabled={translating || !inputText.trim()}
              className={`rounded-xl p-2 ${translating || !inputText.trim() ? 'bg-amber-500/30' : 'bg-amber-500'}`}
            >
              {translating
                ? <ActivityIndicator size="small" color="black" />
                : <Ionicons name="arrow-forward" size={18} color="black" />
              }
            </TouchableOpacity>
          </View>

          {translation && (
            <View className="mt-3 bg-[#0B1120] rounded-xl p-4 gap-2">
              <View className="flex-row items-start justify-between">
                <Text className="text-white font-bold text-lg flex-1">{translation.translation}</Text>
                <TouchableOpacity onPress={() => copyToClipboard(translation.translation)}>
                  <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color="#F59E0B" />
                </TouchableOpacity>
              </View>
              {translation.pronunciation ? (
                <Text className="text-slate-400 text-sm italic">/{translation.pronunciation}/</Text>
              ) : null}
              {translation.notes ? (
                <Text className="text-slate-500 text-xs">{translation.notes}</Text>
              ) : null}
            </View>
          )}
        </Card>

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          className="-mx-4 px-4"
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${
                activeCategory === cat ? 'bg-amber-500' : 'bg-white/10'
              }`}
            >
              <Text>{CAT_EMOJI[cat]}</Text>
              <Text className={`text-sm font-semibold capitalize ${activeCategory === cat ? 'text-black' : 'text-white/70'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Phrase cards */}
        {visible.map((phrase, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => copyToClipboard(phrase.local)}
            className="bg-[#131D2E] rounded-2xl p-4 gap-2"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-slate-400 text-sm">{phrase.english}</Text>
                <Text className="text-white font-bold text-base mt-1">{phrase.local}</Text>
                {phrase.pronunciation && (
                  <Text className="text-amber-400 text-xs italic mt-0.5">/{phrase.pronunciation}/</Text>
                )}
              </View>
              <View className="flex-row items-center gap-2">
                <Badge label={phrase.category} variant="slate" />
                <Ionicons name="copy-outline" size={16} color="#475569" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
