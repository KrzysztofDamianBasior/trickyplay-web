import styled from "@emotion/styled";

const GlowingMovingText = styled.h2<{ isDarkMode: boolean }>`
  max-width: 500px;
  max-height: 500px;

  font-size: 6rem;
  font-weight: 500;
  color: #222;
  letter-spacing: 5px;

  cursor: pointer;

  span {
    transition: 2s;
  }
  &:hover span:nth-of-type(1) {
    margin-right: 10px;
  }
  &:hover span:nth-of-type(2) {
    margin-left: 40px;
  }
  &:hover span {
    color: #fff;
    text-shadow: ${(p) =>
      p.isDarkMode
        ? `0 0 10px #fff, 0 0 20px #fff, 0 0 40px #fff, 0 0 80px #fff,
      0 0 120px #fff`
        : `0 0 10px #000, 0 0 20px #000, 0 0 40px #000, 0 0 80px #000,
      0 0 120px #000`};
  }
`;
export default GlowingMovingText;
