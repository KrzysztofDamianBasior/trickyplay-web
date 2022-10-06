import React from "react";
import styled from "styled-components";
import * as palette from "../../../styles/variables";

type Props = {
  text: string;
};

//add box-shadow

const NeonTextBanner = ({ text }: Props) => {
  return (
    <NeonTextEffect>
      <span className="neon-text-effect__text" data-neon-text-effect={text}>
        {text}
      </span>
      <span className="neon-text-effect__gradient"></span>
      <span className="neon-text-effect__dodge"></span>
    </NeonTextEffect>
  );
};
export default NeonTextBanner;

const NeonTextEffect = styled.div`
  display: inline-flex;
  filter: brightness(200%);
  overflow: hidden;
  clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 20%,
    100% 80%,
    80% 100%,
    20% 100%,
    0% 80%,
    0% 20%
  );

  .neon-text-effect__text {
    color: #ffffff;
    background: #000000;
    font-size: ${palette.FONTSIZE_EXTRA_LARGE};
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
