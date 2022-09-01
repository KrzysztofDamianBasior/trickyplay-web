import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ToggleThemeSwitch from "./ToggleThemeSwitch";
import { GoHome } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <NavbarHeader>
      <nav>
        <div className="left-content">
          <div>
            <ToggleThemeSwitch />
          </div>
        </div>

        <div className="center-content">
          <NavbarLink to="/">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <GoHome /> home
          </NavbarLink>
          {/* <NavbarLink to="/">
            <span></span>
            <span></span>
            <span></span>
            <span></span>Profile
          </NavbarLink> */}
          <NavbarLink to="/">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <IoGameControllerOutline /> games
          </NavbarLink>
          <div>
            <span className="input">
              <input type="text" placeholder="Find a game" />
              <span></span>
            </span>
          </div>
        </div>

        <div className="right-content">
          {/* <NavbarLink to="/">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </NavbarLink> */}
        </div>
      </nav>
    </NavbarHeader>
  );
};
export default Navbar;

const NavbarHeader = styled.header`
  display: block;
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 12vh;

  color: ${(props) => props.theme.primaryColor};
  -webkit-box-shadow: 0px 0px 55px 0px rgba(134, 102, 12, 1);
  -moz-box-shadow: 0px 0px 55px 0px rgba(134, 102, 12, 1);
  box-shadow: 0px 0px 55px 0px rgba(134, 102, 12, 1);
  nav {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    img {
      height: 8vh;
    }
    div {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
    .right-content {
      margin: 2%;
      width: 10%;
    }
    .left-content {
      margin: 2%;
      width: 10%;
    }
    .center-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 40%;
    }
  }

  ::placeholder {
    color: #cbd0d5;
  }
  .input {
    position: relative;
    font-size: 1.5em;
    background: linear-gradient(21deg, #10abff, #1beabd);
    padding: 3px;
    display: inline-block;
    border-radius: 9999em;

    *:not(span) {
      position: relative;
      display: inherit;
      border-radius: inherit;
      margin: 0;
      border: none;
      outline: none;
      padding: 0 0.325em;
      z-index: 1;

      &:focus + span {
        opacity: 1;
        transform: scale(1);
      }
    }
    span {
      transform: scale(0.993, 0.94);
      transition: transform 0.5s, opacity 0.25s;
      opacity: 0;
      position: absolute;
      z-index: 0;
      margin: 4px;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: inset 0 0 0 3px #fff, 0 0 0 4px #fff, 3px -3px 30px #1beabd,
        -3px 3px 30px #10abff;
    }
  }
`;

const NavbarLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  padding: 15px 30px;
  color: #21ebff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  font-size: 20px;

  overflow: hidden;
  transition: 0.2s;

  &:hover {
    color: #111;
    background: #21ebff;
    box-shadow: 0 0 50px #21ebff;
    transition-delay: 1.5s;
    transition-duration: 1s;
    span:nth-child(1) {
      left: 100%;
      transition: 1s;
    }
    span:nth-child(2) {
      top: 100%;
      transition: 1s;
      transition-delay: 0.25s;
    }
    span:nth-child(3) {
      right: 100%;
      transition: 1s;
      transition-delay: 0.5s;
    }
    span:nth-child(4) {
      bottom: 100%;
      transition: 1s;
      transition-delay: 0.75s;
    }
  }

  span {
    position: absolute;
    display: block;
  }
  span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #21ebff);
  }
  span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #21ebff);
  }
  span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #21ebff);
  }
  span:nth-child(4) {
    bottom: -100%;
    left: 0px;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #21ebff);
  }
`;
