import React from "react";
import styled from "styled-components";

type Props = {
  onClick: (label: string) => void;
  defaultOption: string;
  optionLabels: string[];
};

const ToggleSwitch = ({ optionLabels, defaultOption, onClick }: Props) => {
  return (
    <ToggleSwitchContainer>
      {optionLabels.map((label) => (
        <OptionButton
          active={label === defaultOption}
          onClick={() => onClick(label)}
          key={label}
        >
          {label}
        </OptionButton>
      ))}
    </ToggleSwitchContainer>
  );
};
export default ToggleSwitch;

const ToggleSwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

type OptionButtonProps = {
  active: boolean;
};

const OptionButton = styled.button<OptionButtonProps>`
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
