export interface ThemeType {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  quaternaryColor: string;
  quinaryColor: string;
  scrollbarThumbColor: string;
}

export const lightTheme: ThemeType = {
  backgroundColor: "#fff",
  primaryColor: "#000",
  secondaryColor: "#000",
  tertiaryColor: "#d400d4",
  quaternaryColor: "#d400d4",
  quinaryColor: "#d400d4",
  scrollbarThumbColor: `-webkit-gradient(linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122,153,217)),
    color-stop(0.72, rgb(73,125,189)),
    color-stop(0.86, rgb(28,58,148)));`,
};

export const darkTheme: ThemeType = {
  backgroundColor: "#000",
  primaryColor: "#21ebff",
  secondaryColor: "#fff",
  tertiaryColor: "#d400d4",
  quaternaryColor: "#d400d4",
  quinaryColor: "#d400d4",
  scrollbarThumbColor: `-webkit-gradient(linear,
    40% 0%,
    75% 84%,
    from(#4D9C41),
    to(#19911D),
    color-stop(.6,#54DE5D))`,
};
