export default {
  expo: {
    name: "medication-management",
    slug: "medica",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.neli.medica",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "7c70f95e-ace4-4625-99a6-c5a9caf3e2ae",
      },
    },
    owner: "amante",
  },
};
