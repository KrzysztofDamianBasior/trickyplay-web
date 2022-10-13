import React from "react";
import styled from "styled-components";

type OptionButtonProps = {
  active: boolean;
};

const StatefulButton = styled.button<OptionButtonProps>`
  width: 10vw;
  height: 5vh;

  color: ${(p) => p.theme.secondaryColor};

  background: transparent;
  text-decoration: none;
  border: ${(p) => (p.active ? "1px solid rgb(146, 148, 248);" : "none")};
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 1px 1px 25px 10px rgba(146, 148, 248, 0.4);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
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
