import styled from "@emotion/styled";

const GameWrapper = styled.div`
  position: relative;
  background: linear-gradient(0deg, black, grey);

  width: fit-content;
  /* width: auto;
  min-width: min-content;
  max-width: max-content; */

  :focus {
    outline: none;
  }

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
    animation: glowing-container__animation 40s linear infinite;
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
export default GameWrapper;
