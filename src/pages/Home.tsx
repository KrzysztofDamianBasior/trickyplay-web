import React from "react";
import AnimatedPage from "../components/AnimatedPage";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Logo from "../assets/logo.png";

type Props = {};

const Home = (props: Props) => {
  return (
    <AnimatedPage>
      <Navbar />
      <LargeDiv>
        <StyledButton>Button</StyledButton>
      </LargeDiv>
    </AnimatedPage>
  );
};
export default Home;

const LargeDiv = styled.div`
  height: 300vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled.a`
  position: relative;
  padding: 10px 30px;
  margin: 0 15px;
  color: #21ebff;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 20px;
  transition: 0.5s;
  overflow: hidden;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);
  &:hover {
    background: #21ebff;
    color: #111;
    box-shadow: 0 0 50px #21ebff;
    transition-delay: 0.5s;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-top: 2px solid #21ebff;
    border-left: 2px solid #21ebff;
    transition: 0.5s;
    transition-delay: 0.5s;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-bottom: 2px solid #21ebff;
    border-right: 2px solid #21ebff;
    transition: 0.5s;

    transition-delay: 0.5s;
  }
  &:hover::before {
    width: 100%;
    height: 100%;
    transition-delay: 0s;
  }
  &:hover::after {
    width: 100%;
    height: 100%;
    transition-delay: 0s;
  }
`;
