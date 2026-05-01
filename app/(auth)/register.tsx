import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signUpWithEmail } from '../../lib/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message ?? 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <LinearGradient colors={['#0B1120', '#131D2E', '#0B1120']} className="flex-1 items-center justify-center px-6">
        <View className="bg-emerald-500/20 rounded-full w-20 h-20 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={40} color="#34D399" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2 text-center">Check your email</Text>
        <Text className="text-slate-400 text-base text-center mb-8">
          We sent a confirmation link to {email}. Click it to activate your account.
        </Text>
        <TouchableOpacity
          className="bg-amber-500 h-14 rounded-2xl items-center justify-center px-8 w-full"
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text className="text-black font-bold text-base">Back to Sign In</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0B1120', '#131D2E', '#0B1120']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity className="mb-8" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#94A3B8" />
          </TouchableOpacity>

          <Text className="text-white text-3xl font-black mb-1">Create account</Text>
          <Text className="text-slate-400 text-sm mb-8">Start planning your next adventure</Text>

          {error ? (
            <View className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 mb-4 flex-row items-center gap-2">
              <Ionicons name="alert-circle-outline" size={16} color="#F87171" />
              <Text className="text-red-400 text-sm flex-1">{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View className="bg-[#1A2540] rounded-2xl flex-row items-center px-4 h-14 mb-3">
            <Ionicons name="mail-outline" size={20} color="#64748B" />
            <TextInput
              className="flex-1 ml-3 text-white text-base"
              placeholder="Email address"
              placeholderTextColor="#475569"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View className="bg-[#1A2540] rounded-2xl flex-row items-center px-4 h-14 mb-3">
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <TextInput
              className="flex-1 ml-3 text-white text-base"
              placeholder="Password (min. 6 chars)"
              placeholderTextColor="#475569"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Confirm */}
          <View className="bg-[#1A2540] rounded-2xl flex-row items-center px-4 h-14 mb-6">
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <TextInput
              className="flex-1 ml-3 text-white text-base"
              placeholder="Confirm password"
              placeholderTextColor="#475569"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPass}
            />
          </View>

          <TouchableOpacity
            className={`h-14 rounded-2xl items-center justify-center ${loading ? 'bg-amber-500/50' : 'bg-amber-500'}`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="black" />
              : <Text className="text-black font-bold text-base">Create Account</Text>
            }
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8 gap-1">
            <Text className="text-slate-400 text-sm">Already have an account?</Text>
            <Link href="/(auth)/login">
              <Text className="text-amber-400 font-semibold text-sm">Sign in</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
