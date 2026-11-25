import { ScrollView, StyleSheet, View } from "react-native";
import { SummaryHeader } from "../components/SummaryHeader";
import { AppText } from "../components/ui/AppText";
import { usePortfolioViewModel } from "../hooks/usePortfolioViewModel";
import { space } from "../theme";

export function PortfolioScreen() {
  const state = usePortfolioViewModel();

  return (
    <View style={styles.container}>
      {state.status === "loading" && <AppText tone="muted">Loading prices…</AppText>}
      {state.status === "error" && <AppText tone="loss">{state.message}</AppText>}
      {state.status === "ready" && (
        <ScrollView>
          <SummaryHeader summary={state.summary} />
          <AppText variant="caption" tone="muted" style={styles.json}>
            {JSON.stringify(state.rows, null, 2)}
          </AppText>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: space.lg },
  json: { fontFamily: "monospace", marginTop: space.lg },
});
