import styled from "@emotion/styled";

const GameWrapper = styled.div`
  position: relative;

  background: linear-gradient(0deg, black, grey);

  display: flex;
  align-items: center;
  justify-content: center;

  width: fit-content;
  /* width: auto;
  min-width: min-content;
  max-width: max-content; */

  :focus {
    outline: none;
  }

  &::before,
  &::after {
    content: '""';
    position: absolute;
    left: -1px;
    top: -1px;

    width: calc(100% + 2px);
    height: calc(100% + 2px);

    z-index: -1;

    background: linear-gradient(45deg, red, blue, green, orange, red);
    filter: blur(40px);
    background-size: 400%;
    animation: glowing-container__animation 40s linear infinite;
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
