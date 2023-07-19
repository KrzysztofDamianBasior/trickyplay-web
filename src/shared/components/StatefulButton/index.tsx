import styled from "@emotion/styled";

type OptionButtonProps = {
  isActive: boolean;
  isDarkMode: boolean;
};

const StatefulButton = styled.button<OptionButtonProps>`
  position: relative;
  overflow: hidden;

  background: transparent;
  border: ${(p) => (p.isActive ? "1px solid rgb(146, 148, 248);" : "none")};

  width: 7rem;
  height: 3.5rem;

  color: ${(p) => (p.isDarkMode ? "#fff" : "000")};
  text-decoration: none;

  &:hover {
    box-shadow: 1px 1px 25px 10px rgba(146, 148, 248, 0.4);
  }

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;

    top: 0;
    left: -100%;

    background: linear-gradient(
      120deg,
      transparent,
      rgba(146, 148, 248, 0.4),
      transparent
    );

    transition: all 650ms;
  }

  &:hover:before {
    left: 100%;
  }
`;

export default StatefulButton;
