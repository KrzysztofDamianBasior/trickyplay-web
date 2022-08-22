import { createSlice } from '@reduxjs/toolkit'

export interface ThemeState {
  theme: | 'light' | 'dark'
}

const initialState: ThemeState = {
  theme: 'dark',
}

export const appThemeSlice = createSlice({
  name: 'appTheme',
  initialState,
  reducers: {
    setLightTheme: (state) => {
        state.theme = 'light'
    },
    setDarkTheme: (state) => {
        state.theme = 'dark'
    },
    toggleTheme: (state) => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDarkTheme, setLightTheme, toggleTheme } = appThemeSlice.actions

export default appThemeSlice.reducer
