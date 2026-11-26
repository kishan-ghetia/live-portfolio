import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { SYMBOLS } from "./src/constants/symbols";
import { startLiveFeed } from "./src/feed/liveFeed";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { loadQuotes, usePriceStore } from "./src/store/priceStore";
import { navigationThemes, useAppTheme } from "./src/theme";

export default function App() {
  const theme = useAppTheme();
  const { dark, light } = navigationThemes;
  const status = usePriceStore((s) => s.status);
  const refreshing = usePriceStore((s) => s.refreshing);

  useEffect(() => {
    loadQuotes(SYMBOLS);
  }, []);

  useEffect(() => {
    if (status !== "ready" || refreshing) return;
    return startLiveFeed();
  }, [status, refreshing]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer theme={theme.dark ? dark : light}>
            <RootNavigator />
          </NavigationContainer>
        </ErrorBoundary>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
