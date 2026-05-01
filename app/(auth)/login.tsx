import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmail, signInWithGoogle } from '../../lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmail = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

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
          {/* Logo */}
          <View className="items-center mb-10">
            <View className="bg-amber-500 rounded-2xl w-16 h-16 items-center justify-center mb-4">
              <Ionicons name="airplane" size={32} color="black" />
            </View>
            <Text className="text-white text-3xl font-black tracking-tight">Travell</Text>
            <Text className="text-slate-400 text-sm mt-1">AI-powered travel planning</Text>
          </View>

          {/* Error */}
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
              autoComplete="email"
            />
          </View>

          {/* Password */}
          <View className="bg-[#1A2540] rounded-2xl flex-row items-center px-4 h-14 mb-5">
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <TextInput
              className="flex-1 ml-3 text-white text-base"
              placeholder="Password"
              placeholderTextColor="#475569"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              autoComplete="password"
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Sign in */}
          <TouchableOpacity
            className={`h-14 rounded-2xl items-center justify-center mb-3 ${loading ? 'bg-amber-500/50' : 'bg-amber-500'}`}
            onPress={handleEmail}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="black" />
              : <Text className="text-black font-bold text-base">Sign In</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-2">
            <View className="flex-1 h-px bg-white/10" />
            <Text className="text-slate-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-white/10" />
          </View>

          {/* Google */}
          <TouchableOpacity
            className="h-14 rounded-2xl items-center justify-center border border-white/20 bg-white/5 flex-row gap-3 mt-2"
            onPress={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading
              ? <ActivityIndicator color="white" />
              : <>
                  <Text className="text-xl">🔵</Text>
                  <Text className="text-white font-semibold text-base">Continue with Google</Text>
                </>
            }
          </TouchableOpacity>

          {/* Register link */}
          <View className="flex-row justify-center mt-8 gap-1">
            <Text className="text-slate-400 text-sm">Don't have an account?</Text>
            <Link href="/(auth)/register">
              <Text className="text-amber-400 font-semibold text-sm">Sign up</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
