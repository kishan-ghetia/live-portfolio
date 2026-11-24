import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from "@react-navigation/native";

export interface Palette {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  chip: string;
  gain: string;
  loss: string;
  warning: string;
  primary: string;
  onPrimary: string;
}

export interface AppTheme {
  dark: boolean;
  colors: Palette;
}

const light: Palette = {
  background: "#F5F6F8",
  surface: "#FFFFFF",
  text: "#111318",
  textMuted: "#6B7280",
  border: "#E6E8EC",
  chip: "#EEF0F3",
  gain: "#16A34A",
  loss: "#DC2626",
  warning: "#D97706",
  primary: "#111318",
  onPrimary: "#FFFFFF",
};

const dark: Palette = {
  background: "#050507",
  surface: "#0B0B0F",
  text: "#F2F3F5",
  textMuted: "#8B90A0",
  border: "#1C1E25",
  chip: "#16181F",
  gain: "#22C55E",
  loss: "#F25555",
  warning: "#F59E0B",
  primary: "#F2F3F5",
  onPrimary: "#0B0B0F",
};

const lightTheme: AppTheme = { dark: false, colors: light };
const darkTheme: AppTheme = { dark: true, colors: dark };

export function useAppTheme(): AppTheme {
  return useColorScheme() === "dark" ? darkTheme : lightTheme;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 12, pill: 999 } as const;
export const font = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

function toNavigationTheme(app: AppTheme): NavigationTheme {
  const base = app.dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: app.colors.primary,
      background: app.colors.background,
      card: app.colors.surface,
      text: app.colors.text,
      border: app.colors.border,
      notification: app.colors.loss,
    },
  };
}

export const navigationThemes = {
  light: toNavigationTheme(lightTheme),
  dark: toNavigationTheme(darkTheme),
} as const;
