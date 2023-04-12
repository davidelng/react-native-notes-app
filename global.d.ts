import "@react-navigation/native";
// Override the theme in react native navigation to accept our custom theme props.
declare module "@react-navigation/native" {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      backgroundLighter: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      button: string;
      red: string;
      orange: string;
      yellow: string;
      green: string;
      blue: string;
      purple: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}
