export interface ThemeType {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  scrollbar: string;
  tertiaryColor: string;
}

export const lightTheme: ThemeType = {
  backgroundColor: "#fff",
  primaryColor: "#000",
  secondaryColor: "#000",
  tertiaryColor: "#000",
  scrollbar: `-webkit-gradient(linear,
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
  tertiaryColor: "#fff",
  scrollbar: `-webkit-gradient(linear,
    40% 0%,
    75% 84%,
    from(#4D9C41),
    to(#19911D),
    color-stop(.6,#54DE5D))`,
};
