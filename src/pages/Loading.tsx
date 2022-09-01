import React from "react";
import styled from "styled-components";
import AnimatedPage from "../components/AnimatedPage";

type Props = {};

const Loading = (props: Props) => {
  return (
    <AnimatedPage>
      <LoadingContainer>
        <LoadingText>
          <div className="loading-text__lightbar"></div>
          <div className="loading-text__curtain"></div>
          <h2>Loading ...</h2>
        </LoadingText>
      </LoadingContainer>
    </AnimatedPage>
  );
};
export default Loading;

const LoadingContainer = styled.div`
  width: 80vw;
  height: 90vh;
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.div`
  position: relative;
  width: 600px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  h2 {
    color: white;
    font-size: 5em;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-shadow: 0 0 10px ${(props) => props.theme.primaryColor},
      0 0 20px ${(props) => props.theme.primaryColor},
      0 0 40px ${(props) => props.theme.primaryColor},
      0 0 80px ${(props) => props.theme.primaryColor},
      0 0 120px ${(props) => props.theme.primaryColor};
  }

  .loading-text__lightbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 100%;
    border-radius: 10px;
    background: white;
    z-index: 2;
    box-shadow: 0 0 10px ${(props) => props.theme.primaryColor},
      0 0 20px ${(props) => props.theme.primaryColor},
      0 0 40px ${(props) => props.theme.primaryColor},
      0 0 80px ${(props) => props.theme.primaryColor},
      0 0 120px ${(props) => props.theme.primaryColor};
    animation: loading-text__animate-lightbar 2.5s linear infinite;
  }

  .loading-text__curtain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    animation: loading-text__animate-curtain 5s linear infinite;
  }

  @keyframes loading-text__animate-lightbar {
    0%,
    5% {
      transform: scaleY(0) translateX(0);
    }
    10% {
      transform: scaleY(1) translateX(0);
    }
    90% {
      transform: scaleY(1) translateX(calc(600px - 10px));
    }
    95%,
    100% {
      transform: scaleY(0) translateX(calc(600px - 10px));
    }
  }

  @keyframes loading-text__animate-curtain {
    0%,
    2.5% {
      transform: translateX(0);
    }
    5% {
      transform: translateX(0);
    }
    45% {
      transform: translateX(100%);
    }
    47.5%,
    50% {
      transform: translateX(100%);
    }
    50.001%,
    52.5% {
      transform: translateX(-100%);
    }
    55% {
      transform: translateX(-100%);
    }
    95% {
      transform: translateX(0%);
    }
    97.5%,
    100% {
      transform: translateX(0%);
    }
  }
`;
