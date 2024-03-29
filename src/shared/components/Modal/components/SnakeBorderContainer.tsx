import styled from "@emotion/styled";
import { motion } from "framer-motion";

const SnakeBorderContainer = styled(motion.div)<{
  theme: "light" | "dark";
  size: "sm" | "md" | "lg";
}>`
  width: ${(props) => {
    return props.size === "sm" ? "95vw" : props.size === "md" ? "80vw" : "60vw";
  }};
  height: 80vh;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgb(0, 0, 0, 0.5);

  overflow: hidden;

  border-radius: 20px;

  .modal__content {
    z-index: 1;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    height: 72vh;
  }

  .modal__title {
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 10px;
  }

  .modal__body {
    height: 50vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .modal__footer {
    /* flex: 20%; */
    margin-bottom: 15px;

    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
  }

  &::before {
    content: "";
    position: absolute;

    width: 20vw;
    height: 220%;

    background: linear-gradient(#21ebff, #d400d4);

    animation: animated-border-container__animate 8s linear infinite;
  }

  &::after {
    content: "";

    position: absolute;

    inset: 4px;

    background: ${(props) => {
      return props.theme === "light" ? "#F2ECFF" : "#101C2D";
    }};

    border-radius: 16px;
  }

  @keyframes animated-border-container__animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default SnakeBorderContainer;
