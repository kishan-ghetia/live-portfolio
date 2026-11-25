import { Component, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { type Palette, space, useThemedStyles } from "../theme";
import { AppButton } from "./ui/AppButton";
import { AppText } from "./ui/AppText";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) return <ErrorFallback onRetry={this.reset} />;
    return this.props.children;
  }
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <AppText variant="title">Something went wrong</AppText>
      <AppText tone="muted" style={styles.message}>
        The app hit an unexpected error. Try again to reload the screen.
      </AppText>
      <AppButton label="Try again" onPress={onRetry} />
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: space.md,
      padding: space.xl,
      backgroundColor: colors.background,
    },
    message: { textAlign: "center" },
  });
