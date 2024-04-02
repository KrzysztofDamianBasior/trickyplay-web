import { styled } from "@mui/material";

const GlowingTubelightText = styled("div", {
  name: "GlowingTubelightText",
  slot: "root",
})`
  ${({ theme }) => `
  position: relative;

  width: 100%;
  margin-left: 15px;
  margin-right: 15px;

  color: inherit;
  line-height: 2.8rem;
  letter-spacing: 0.2rem;
  font-weight: normal;
  text-align: center;
  @media (min-width: ${theme.breakpoints.values.xs}px) {
    font-size: 2rem;
  }
  @media (min-width: ${theme.breakpoints.values.sm}px) {
    font-size: 3rem;
  }
  @media (min-width: ${theme.breakpoints.values.md}px) {
    font-size: 4rem;
  }
  text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
    0 0 80px #03bcf4, 0 0 160px #03bcf4;

  @media (min-width: 400px) {
    -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
  }
  
  outline: none;

  /* the animation below has low performance, so it has been commented out */
  /* will-change: color, text-shadow; */
  /* animation: glowing-tubelight-text__animate 20s linear infinite; */
  /* @keyframes glowing-tubelight-text__animate {
    0%,
    18%,
    18.2%,
    20%,
    30.1%,
    50.1%,
    60%,
    65.1%,
    80%,
    90.1%,
    99% {
      color: #0e3742;
      text-shadow: none;
    }
    18.1%,
    20.1%,
    30%,
    31%,
    50%,
    60.1%,
    65%,
    80.1%,
    90%,
    92.1%,
    100% {
      color: #fff;
      text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
        0 0 80px #03bcf4, 0 0 160px #03bcf4;
    }
  } */
`}
`;

export default GlowingTubelightText;
