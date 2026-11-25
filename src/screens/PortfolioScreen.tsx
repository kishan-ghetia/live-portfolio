import { FlatList, type ListRenderItemInfo, StyleSheet, View } from "react-native";
import { getStockRowLayout, StockRow } from "../components/StockRow";
import { SummaryHeader } from "../components/SummaryHeader";
import { AppText } from "../components/ui/AppText";
import { AppTextInput } from "../components/ui/AppTextInput";
import { type PillOption, Pills } from "../components/ui/Pills";
import { usePortfolioViewModel } from "../hooks/usePortfolioViewModel";
import { space } from "../theme";
import type { SortKey } from "../utils/sortHoldings";

const SORT_OPTIONS: PillOption<SortKey>[] = [
  { value: "name", label: "Name" },
  { value: "value", label: "Value" },
  { value: "pnl", label: "P&L" },
];

const keyBySymbol = (symbol: string) => symbol;

const renderHolding = ({ item }: ListRenderItemInfo<string>) => (
  <StockRow symbol={item} mode="holding" />
);

export function PortfolioScreen() {
  const { state, query, setQuery, sortBy, setSortBy } = usePortfolioViewModel();

  if (state.status === "loading") {
    return (
      <View style={styles.centered}>
        <AppText tone="muted">Loading prices…</AppText>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.centered}>
        <AppText tone="loss">{state.message}</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={state.symbols}
      keyExtractor={keyBySymbol}
      renderItem={renderHolding}
      getItemLayout={getStockRowLayout}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.header}>
          <SummaryHeader />
          <AppTextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search symbol…"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <Pills options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
        </View>
      }
      ListEmptyComponent={
        <AppText tone="muted" style={styles.empty}>
          {query ? `No holdings match "${query}"` : "No holdings yet"}
        </AppText>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.lg },
  header: { padding: space.lg, gap: space.md },
  empty: { textAlign: "center", padding: space.xl },
});
