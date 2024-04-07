import { createContext } from "react";

export type ThemeContextType = {
  isDarkMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  set: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggle: () => {},
  enable: () => {},
  disable: () => {},
  set: (value: boolean) => {},
});
