import { createGlobalStyle } from 'styled-components'
import { ThemeType } from './themes'

export default createGlobalStyle<{theme: ThemeType}>`
  body {
    margin: 0;
    padding: 0;
    color: ${props => props.theme.color};
    background-color: ${props => props.theme.backgroundColor};
  }
`