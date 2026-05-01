import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const isWeb = process.env.EXPO_TARGET === 'web' || process.argv.includes('--platform=web') || process.argv.includes('web');

  const plugins: ExpoConfig['plugins'] = [
    'expo-router',
    'expo-secure-store',
  ];

  if (!isWeb) {
    plugins.push([
      'react-native-maps',
      {
        googleMapsApiKey: 'YOUR_ANDROID_GOOGLE_MAPS_API_KEY',
        useGoogleMapsOnIos: false,
      },
    ]);
  }

  return {
    ...config,
    name: 'Travell',
    slug: 'travell',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'travell',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.travell.app',
    },
    android: {
      adaptiveIcon: { backgroundColor: '#0B1120' },
      package: 'com.travell.app',
      config: {
        googleMaps: { apiKey: 'YOUR_ANDROID_GOOGLE_MAPS_API_KEY' },
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
    },
    plugins,
    experiments: { typedRoutes: true },
  };
};
