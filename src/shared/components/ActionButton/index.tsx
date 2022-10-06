import styled from "styled-components";
import * as palette from "../../../styles/variables";

//neon button
export default styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  background-color: rgba(0, 0, 0, 0);
  border: none;
  position: relative;
  padding: 10px 30px;
  margin: 0 15px;
  color: ${(p) => p.theme.primaryColor};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: ${palette.FONTSIZE_MEDIUM};
  transition: 0.5s;
  overflow: hidden;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);
  &:hover {
    background: ${(p) => p.theme.primaryColor};
    color: ${(p) => p.theme.backgroundColor};
    box-shadow: ${(p) => `0 0 50px ${p.theme.primaryColor}`};
    transition-delay: 0.5s;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-top: ${(p) => `2px solid ${p.theme.primaryColor}`};
    border-left: ${(p) => `2px solid ${p.theme.primaryColor}`};
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
    border-bottom: ${(p) => `2px solid ${p.theme.primaryColor}`};
    border-right: ${(p) => `2px solid ${p.theme.primaryColor}`};
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
