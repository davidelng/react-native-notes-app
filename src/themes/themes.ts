import { ExtendedTheme } from "@react-navigation/native";

export const DarkDefault: ExtendedTheme = {
  dark: true,
  colors: {
    primary: "#427DDE",
    background: "#000000",
    backgroundLighter: "#181818",
    card: "#000000",
    text: "#E0E0E0",
    border: "#151515",
    notification: "#9F9F9F",
    button: "#E0E0E0",
  },
};

export const LightDefault: ExtendedTheme = {
  dark: false,
  colors: {
    primary: "#427DDE",
    background: "#E0E0E0",
    backgroundLighter: "#B8B8B8",
    card: "#E0E0E0",
    text: "#404040",
    border: "#D6D6D6",
    notification: "#9F9F9F",
    button: "#E0E0E0",
  },
};

// export const DarkOled: ExtendedTheme = {}
// export const TokyoNight: ExtendedTheme = {}
// export const Solarized: ExtendedTheme = {}
// export const RosePine: ExtendedTheme = {}
// export const Gruvbox: ExtendedTheme = {}
// export const Nord: ExtendedTheme = {}
