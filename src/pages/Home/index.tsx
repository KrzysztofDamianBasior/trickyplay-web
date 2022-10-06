import React from "react";
import AnimatedPage from "../../shared/components/AnimatedPage";
import styled from "styled-components";
import Navbar from "../../shared/components/Navbar";
import Logo from "../../shared/assets/logo.png";
import SitePromotion from "./components/SitePromotion";

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
  height: 200vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
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
