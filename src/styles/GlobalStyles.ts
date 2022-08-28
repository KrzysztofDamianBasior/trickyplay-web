import { createGlobalStyle } from "styled-components";
import { ThemeType } from "./themes";

export default createGlobalStyle<{ theme: ThemeType }>`

  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    color: ${(props) => props.theme.primaryColor};
    background-color: ${(props) => props.theme.backgroundColor};
  }
 
    
  body::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.9);
    background-color: #F5F5F5;
    border-radius: 10px;
  }

  body::-webkit-scrollbar
  {
    width: 15px;
    background-color: ${(props) => props.theme.backgroundColor};
  }

  body::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    background-color: ${(props) => props.theme.primaryColor};
    background-image: ${(props) => props.theme.scrollbar};
  } 
  
`;
