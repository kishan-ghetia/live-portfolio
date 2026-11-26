import { useNavigation } from "@react-navigation/native";
import { memo, useCallback } from "react";
import {
  FlatList,
  Keyboard,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { getStockRowLayout, StockRow } from "../components/StockRow";
import { AppText } from "../components/ui/AppText";
import { AppTextInput } from "../components/ui/AppTextInput";
import { StateView } from "../components/ui/StateView";
import { useWatchlistViewModel } from "../hooks/useWatchlistViewModel";
import { addToWatchlist, removeFromWatchlist, useWatchlistStore } from "../store/watchlistStore";
import { type Palette, space, useThemedStyles } from "../theme";

const keyBySymbol = (symbol: string) => symbol;

const renderResult = ({ item }: ListRenderItemInfo<string>) => <SearchResult symbol={item} />;

export function WatchlistScreen() {
  const navigation = useNavigation();
  const { state, retry, query, setQuery, setSearchFocused, showResults, results } =
    useWatchlistViewModel();

  const openDetail = useCallback(
    (symbol: string) => navigation.navigate("StockDetail", { symbol }),
    [navigation],
  );

  const renderQuote = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <SwipeableQuote symbol={item} onPress={openDetail} />
    ),
    [openDetail],
  );

  const cancelSearch = () => {
    setQuery("");
    setSearchFocused(false);
    Keyboard.dismiss();
  };

  if (state.status === "loading") {
    return <StateView variant="loading" message="Loading prices…" />;
  }

  if (state.status === "error") {
    return (
      <StateView variant="error" message={state.message} actionLabel="Retry" onAction={retry} />
    );
  }

  return (
    <View style={styles.screen}>
      <AppText variant="caption" weight="semibold" tone="muted" style={styles.sectionTitle}>
        Find stock to add
      </AppText>
      <View style={styles.search}>
        <AppTextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onClear={showResults ? cancelSearch : undefined}
          placeholder="Search symbol to add…"
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>
      {!showResults && (
        <AppText
          variant="caption"
          weight="semibold"
          tone="muted"
          style={[styles.sectionTitle, styles.listTitle]}
        >
          My watchlist · {state.symbols.length}
        </AppText>
      )}
      {showResults ? (
        <FlatList
          data={results}
          keyExtractor={keyBySymbol}
          renderItem={renderResult}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <StateView variant="empty" message={`No symbol matches "${query.trim()}"`} />
          }
        />
      ) : (
        <FlatList
          data={state.symbols}
          keyExtractor={keyBySymbol}
          renderItem={renderQuote}
          getItemLayout={getStockRowLayout}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <StateView
              variant="empty"
              message="Your watchlist is empty. Search above to add symbols."
            />
          }
        />
      )}
    </View>
  );
}

interface SwipeableQuoteProps {
  symbol: string;
  onPress: (symbol: string) => void;
}

const SwipeableQuote = memo(function SwipeableQuote({ symbol, onPress }: SwipeableQuoteProps) {
  const rowStyles = useThemedStyles(createRowStyles);

  return (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      childrenContainerStyle={rowStyles.front}
      renderRightActions={() => (
        <Pressable
          onPress={() => removeFromWatchlist(symbol)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${symbol} from watchlist`}
          style={rowStyles.remove}
        >
          <AppText weight="semibold" style={rowStyles.removeLabel}>
            Remove
          </AppText>
        </Pressable>
      )}
    >
      <StockRow symbol={symbol} mode="quote" onPress={onPress} />
    </ReanimatedSwipeable>
  );
});

const SearchResult = memo(function SearchResult({ symbol }: { symbol: string }) {
  const resultStyles = useThemedStyles(createResultStyles);
  const added = useWatchlistStore((s) => s.symbols.includes(symbol));

  return (
    <Pressable
      onPress={() => (added ? removeFromWatchlist(symbol) : addToWatchlist(symbol))}
      accessibilityRole="button"
      accessibilityLabel={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      style={({ pressed }) => [resultStyles.row, pressed && resultStyles.pressed]}
    >
      <AppText variant="title">{symbol}</AppText>
      <AppText variant="title" tone={added ? "gain" : "muted"}>
        {added ? "✓" : "+"}
      </AppText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  search: { paddingHorizontal: space.lg },
  sectionTitle: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  listTitle: { paddingTop: space.xl, paddingBottom: 0 },
  content: { flexGrow: 1 },
});

const createRowStyles = (colors: Palette) =>
  StyleSheet.create({
    front: { backgroundColor: colors.background },
    remove: {
      width: 96,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.loss,
    },
    removeLabel: { color: colors.onAccent },
  });

const createResultStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: space.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    pressed: { opacity: 0.6 },
  });
