import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Portfolio: undefined;
  Watchlist: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
