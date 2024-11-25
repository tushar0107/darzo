import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.frozzydev.connex',
  appName: 'darzo',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: "http"
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
