import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PausedBadge } from "../components/PausedBadge";
import { PortfolioScreen } from "../screens/PortfolioScreen";
import { StockDetailScreen } from "../screens/StockDetailScreen";
import { TradeSheetScreen } from "../screens/TradeSheetScreen";
import { WatchlistScreen } from "../screens/WatchlistScreen";
import type { RootStackParamList, TabParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: { fontSize: 15 },
        headerRight: () => <PausedBadge />,
        freezeOnBlur: true,
      }}
    >
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerRight: () => <PausedBadge />, freezeOnBlur: true }}>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StockDetail"
        component={StockDetailScreen}
        options={({ route }) => ({ title: route.params.symbol })}
      />
      <Stack.Screen
        name="TradeSheet"
        component={TradeSheetScreen}
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: "fitToContents",
          sheetGrabberVisible: true,
          sheetCornerRadius: 20,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
