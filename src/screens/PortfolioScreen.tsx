import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { getStockRowLayout, StockRow } from "../components/StockRow";
import { SummaryHeader } from "../components/SummaryHeader";
import { AppText } from "../components/ui/AppText";
import { AppTextInput } from "../components/ui/AppTextInput";
import { type PillOption, Pills } from "../components/ui/Pills";
import { StateView } from "../components/ui/StateView";
import { usePortfolioViewModel } from "../hooks/usePortfolioViewModel";
import { space, useAppTheme } from "../theme";
import type { SortKey } from "../utils/sortHoldings";

const SORT_OPTIONS: PillOption<SortKey>[] = [
  { value: "name", label: "Name" },
  { value: "value", label: "Value" },
  { value: "pnl", label: "P&L" },
];

const keyBySymbol = (symbol: string) => symbol;

export function PortfolioScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const {
    state,
    query,
    setQuery,
    sortBy,
    setSortBy,
    retry,
    refreshing,
    refreshError,
    refresh,
  } = usePortfolioViewModel();

  const openDetail = useCallback(
    (symbol: string) => navigation.navigate("StockDetail", { symbol }),
    [navigation],
  );

  const renderHolding = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <StockRow symbol={item} mode="holding" onPress={openDetail} />
    ),
    [openDetail],
  );

  if (state.status === "loading") {
    return <StateView variant="loading" message="Loading prices…" />;
  }

  if (state.status === "error") {
    return (
      <StateView variant="error" message={state.message} actionLabel="Retry" onAction={retry} />
    );
  }

  return (
    <FlatList
      data={state.symbols}
      keyExtractor={keyBySymbol}
      renderItem={renderHolding}
      getItemLayout={getStockRowLayout}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.textMuted}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          {refreshError && (
            <AppText variant="caption" tone="loss">
              Couldn't refresh: {refreshError}. Showing last prices.
            </AppText>
          )}
          <SummaryHeader />
          <AppTextInput
            value={query}
            onChangeText={setQuery}
            onClear={query ? () => setQuery("") : undefined}
            placeholder="Search symbol…"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <Pills options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
        </View>
      }
      ListEmptyComponent={
        <StateView
          variant="empty"
          message={query ? `No holdings match "${query}"` : "No holdings yet"}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  header: { padding: space.lg, gap: space.md },
});
