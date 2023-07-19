import styled from "@emotion/styled";
import { motion } from "framer-motion";

const SnakeBorderContainer = styled(motion.div)`
  position: relative;
  width: 70vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(0, 0, 0, 0.5);
  overflow: hidden;
  border-radius: 20px;

  .modal__title {
    z-index: 501;
    text-align: center;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 10px;
    font-weight: 600;
    font-size: 2rem;
  }
  .modal__content {
    z-index: 501;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 72vh;
  }
  .modal__body {
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .modal__footer {
    z-index: 501;
    /* flex: 20%; */
    margin-bottom: 5%;

    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 150px;
      height: 45px;
    }
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
    background: #0e1538;
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
