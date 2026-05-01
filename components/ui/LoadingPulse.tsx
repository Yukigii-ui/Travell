import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface PulseBoxProps {
  width?: number;
  widthPct?: `${number}%`;
  height?: number;
  rounded?: boolean;
  className?: string;
}

function PulseBox({ width, widthPct = '100%', height = 16, rounded = false, className = '' }: PulseBoxProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width: width ?? widthPct, height, opacity, borderRadius: rounded ? 999 : 8 }}
      className={`bg-white/20 ${className}`}
    />
  );
}

export function LoadingPulse() {
  return (
    <View className="p-4 gap-4">
      {[1, 2, 3].map((i) => (
        <View key={i} className="bg-[#131D2E] rounded-2xl p-4 gap-3">
          <PulseBox widthPct="60%" height={18} />
          <PulseBox widthPct="100%" height={12} />
          <PulseBox widthPct="80%" height={12} />
          <View className="flex-row gap-2 mt-1">
            <PulseBox width={80} height={26} rounded />
            <PulseBox width={60} height={26} rounded />
          </View>
        </View>
      ))}
    </View>
  );
}
