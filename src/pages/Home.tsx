import React from "react";
import AnimatedPage from "../components/AnimatedPage";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Logo from "../assets/logo.png";
import SitePromotion from "../components/SitePromotion";

type Props = {};

const Home = (props: Props) => {
  return (
    <AnimatedPage>
      <Navbar />
      <HomeContainer>
        <HomeBanner>
          <img src={Logo} alt="project logo" />
          <blockquote>
            <GlowingTubelightText>
              The obvious objective of video games is to entertain people by
              surprising them with new experiences.
            </GlowingTubelightText>
            <footer>—Shigeru Miyamoto</footer>
          </blockquote>
        </HomeBanner>
        <SitePromotion />

        <HomeBanner>
          <AnimatedBorderContainer>
            <h2>
              <NeonLink>Button</NeonLink>
            </h2>
          </AnimatedBorderContainer>
          <NeonTextEffect>
            <span
              className="neon-text-effect__text"
              data-neon-text-effect="hey"
            >
              hey
            </span>
            <span className="neon-text-effect__gradient"></span>
            <span className="neon-text-effect__dodge"></span>
          </NeonTextEffect>
        </HomeBanner>
      </HomeContainer>
    </AnimatedPage>
  );
};
export default Home;

const HomeBanner = styled.article`
  height: 100vh;
  width: 95%;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  img {
    max-width: 30vw;
    height: auto;
  }
  blockquote {
    margin-top: 15vh;
    footer {
      float: right;
      font-size: 3em;
      margin-top: 2em;
      color: ${(props) => props.theme.secondaryColor};
    }
  }
`;

const HomeContainer = styled.main`
  height: 300vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const NeonLink = styled.a`
  z-index: 10;
  position: relative;
  padding: 10px 30px;
  margin: 0 15px;
  color: #21ebff;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 20px;
  transition: 0.5s;
  overflow: hidden;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);
  &:hover {
    background: #21ebff;
    color: #111;
    box-shadow: 0 0 50px #21ebff;
    transition-delay: 0.5s;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-top: 2px solid #21ebff;
    border-left: 2px solid #21ebff;
    transition: 0.5s;
    transition-delay: 0.5s;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-bottom: 2px solid #21ebff;
    border-right: 2px solid #21ebff;
    transition: 0.5s;
    transition-delay: 0.5s;
  }
  &:hover::before {
    width: 100%;
    height: 100%;
    transition-delay: 0s;
  }
  &:hover::after {
    width: 100%;
    height: 100%;
    transition-delay: 0s;
  }
`;

const AnimatedBorderContainer = styled.div`
  position: relative;
  width: 70vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(0, 0, 0, 0.5);
  overflow: hidden;
  border-radius: 20px;

  &::before {
    content: "";
    position: absolute;
    width: 20vw;
    height: 220%;
    background: linear-gradient(#00ccff, #d400d4);
    animation: animated-border-container__animate 4s linear infinite;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 4px;
    background: #0e1538;
    border-radius: 16px;
  }

  @keyframes animated-border-container__animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const GlowingTubelightText = styled.h2`
  position: relative;
  font-size: 4em;
  letter-spacing: 15px;
  color: #0e3742;
  width: 100%;
  text-align: center;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
  line-height: 0.7em;
  outline: none;
  animation: glowing-tubelight-text__animate 5s linear infinite;
  @keyframes glowing-tubelight-text__animate {
    0%,
    18%,
    20%,
    50.1%,
    60%,
    65.1%,
    80%,
    90.1%,
    92% {
      color: #0e3742;
      text-shadow: none;
    }
    18.1%,
    20.1%,
    30%,
    50%,
    60.1%,
    65%,
    80.1%,
    90%,
    92.1%,
    100% {
      color: #fff;
      text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
        0 0 80px #03bcf4, 0 0 160px #03bcf4;
    }
  }
`;

const NeonTextEffect = styled.div`
  display: inline-flex;
  filter: brightness(200%);
  overflow: hidden;

  .neon-text-effect__text {
    color: #ffffff;
    background: #000000;
    font-size: 200px;
    &::before {
      content: attr(data-neon-text-effect);
      position: absolute;
      mix-blend-mode: difference;
      filter: blur(3px);
    }
  }

  .neon-text-effect__gradient {
    background: linear-gradient(
      to right top,
      #051937,
      #004d7a,
      #008793,
      #00bf72,
      #a8eb12
    );
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    mix-blend-mode: multiply;
  }
  .neon-text-effect__dodge {
    /* 
    background: radial-gradient(white 30%, #0000 40%);
    background-size: 100px 100px;
    */
    background: radial-gradient(circle, white, black 35%) center / 25% 25%;
    position: absolute;
    top: -100%;
    left: -100%;
    right: 0;
    bottom: 0;
    mix-blend-mode: color-dodge;
    animation: neon-text-effect__animation 3s linear infinite;
  }
  @keyframes neon-text-effect__animation {
    to {
      transform: translate(50%, 50%);
    }
  }
`;
