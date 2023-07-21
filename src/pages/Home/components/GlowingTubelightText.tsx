import styled from "@emotion/styled";

const GlowingTubelightText = styled.div`
  position: relative;
  width: 100%;

  font-size: 4rem;
  line-height: 2.8rem;
  letter-spacing: 0.2rem;
  font-weight: normal;
  text-align: center;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
  outline: none;
  /* color: #0e3742; */
  color: inherit;
  text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
    0 0 80px #03bcf4, 0 0 160px #03bcf4;

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
`;

export default GlowingTubelightText;
