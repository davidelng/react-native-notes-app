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

// BLUE = #427DDE
// TEAL = #00CAB1
// TOMATO = #FF6347
// ROSE = #F43F5E
// AMBER = #F59E0B
// LIME = #84CC16
// PINK = #A855F7
// PURPLE = #7C3AED
// STONE = #78716C
