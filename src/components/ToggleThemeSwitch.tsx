import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IoBulbOutline } from "react-icons/io5";
import {
  setDarkTheme,
  setLightTheme,
  toggleTheme,
} from "../redux/slices/themeSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../redux/store";

type Props = {};

const ToggleThemeSwitch = (props: Props) => {
  const theme = useAppSelector((state: RootState) => state.appTheme.theme);
  const [checked, setChecked] = useState<boolean>(
    theme === "light" ? true : false
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (checked === true) {
      dispatch(setLightTheme());
    } else {
      dispatch(setDarkTheme());
    }
  }, [checked]);

  return (
    <ToggleThemeSwitchContainer>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked((prev) => !prev)}
      />
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
