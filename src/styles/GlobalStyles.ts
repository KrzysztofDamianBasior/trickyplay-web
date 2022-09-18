import { createGlobalStyle } from "styled-components";
import { ThemeType } from "./themes";

export default createGlobalStyle<{ theme: ThemeType }>`
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap');

  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-family: 'Raleway', sans-serif;
    font-weight: 300;
  }
  
  ::placeholder {
      color: #0b1c2d;
  }

  body {
    width: 100%;
    height: 100vh;
    color: ${(props) => props.theme.primaryColor};
    background-color: ${(props) => props.theme.backgroundColor};
  }

  .app{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
  
`;
