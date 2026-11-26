import type { NavigatorScreenParams } from "@react-navigation/native";
import type { TradeSide } from "../utils/trade";

export type TabParamList = {
  Portfolio: undefined;
  Watchlist: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  StockDetail: { symbol: string };
  TradeSheet: { symbol: string; side: TradeSide };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
