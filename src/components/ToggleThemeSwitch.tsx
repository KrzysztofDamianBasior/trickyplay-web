import React from "react";
import styled from "styled-components";
import { IoBulbOutline } from "react-icons/io5";
type Props = {};

const ToggleThemeSwitch = (props: Props) => {
  return (
    <ToggleThemeSwitchContainer>
      <input type="checkbox" />
      <span>
        <IoBulbOutline className="icon" />
      </span>
    </ToggleThemeSwitchContainer>
  );
};
export default ToggleThemeSwitch;

const ToggleThemeSwitchContainer = styled.div`
  position: relative;
  display: block;
  height: 50px;
  width: 100px;
  background: #212121;
  border-radius: 10px;
  input {
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0;
  }
  input:checked ~ span {
    left: 50px;
    .icon {
      color: rgba(255, 255, 255, 1);
      filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #fff)
        drop-shadow(0 0 15px #fff);
    }
  }
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background: #333;
    border: 6px solid #212121;
    border-radius: 14px;
    cursor: pointer;
    transition: 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      color: rgba(255, 255, 255, 0.25);
      font-size: 2em;
      transition: 0.5s;
    }
  }
`;
