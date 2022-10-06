import React from "react";
import styled from "styled-components";

type Props = {
  width: string | number;
  height: string | number;
  children: React.ReactNode;
};

//<GlowingBlock width="300px" height="200px">
//Hey Hey
//</GlowingBlock>

const GameWrapper = (props: Props) => {
  return (
    <GlowingContainer>
      <div
        style={{
          width: props.width,
          height: props.height,
        }}
      >
        {props.children}
      </div>
    </GlowingContainer>
  );
};
export default GameWrapper;

const GlowingContainer = styled.div`
  position: relative;
  background: linear-gradient(0deg, black, grey);

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: -2px;
    top: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);

    background: linear-gradient(45deg, red, blue, green, orange, red);
    background-size: 400%;

    z-index: -1;
    animation: glowing-container__animation 20s linear infinite;
  }
  &::after {
    filter: blur(40px);
    /* opacity: 0.9; */
  }
  @keyframes glowing-container__animation {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 400% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;
