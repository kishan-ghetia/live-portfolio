import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SYMBOLS } from "./src/constants/symbols";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { loadQuotes } from "./src/store/priceStore";
import { navigationThemes, useAppTheme } from "./src/theme";

export default function App() {
  const theme = useAppTheme();
  const { dark, light } = navigationThemes;

  useEffect(() => {
    loadQuotes(SYMBOLS);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme.dark ? dark : light}>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
