import { Box, styled } from "@mui/material";

type Props = {
  text: string;
};

const NeonTextBanner = ({ text }: Props) => {
  return (
    <Box
      sx={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1155" fill="%23000000"><path d="M968.99 1033c-187.45.85-174.59 47.22-449 48-352 1-463-239-463-548 0-273.09 190-474 496-472 277.28 1.81 277.22 60.83 470 57 252-5 217.88-56.12 487-57 305-1 431 290 433 526s-117.08 502.4-432 507c-342 5-322-62-542-61Z"></path></svg>')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "85%",
        backgroundPosition: "center",
        padding: "65px",
        overflow: "visible",
      }}
    >
      <NeonTextEffect>
        <span className="neon-text-effect__text" data-neon-text-effect={text}>
          {text}
        </span>
        <span className="neon-text-effect__gradient"></span>
        <span className="neon-text-effect__dodge"></span>
      </NeonTextEffect>
    </Box>
  );
};
export default NeonTextBanner;

const NeonTextEffect = styled("div", {
  name: "NeonTextEffect",
  slot: "root",
})`
  ${({ theme }) => `
  display: inline-flex;

  filter: brightness(300%);
  
  overflow: hidden;

  .neon-text-effect__text {
    color: #ffffff;
    background: #000000;
    border-color: #000000;

    text-align: center;

    padding: 5px;

    &::before {
      content: attr(data-neon-text-effect);
      position: absolute;
      mix-blend-mode: difference;
      filter: blur(3px);
    }
  }

  .neon-text-effect__gradient {
    background: linear-gradient(
      to right top,
      #d5d8dd,
      #2e6381,
      #008793,
      #00bf72,
      #a8eb12
    );
    
    position: absolute;
    
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    mix-blend-mode: multiply;
  }

  .neon-text-effect__dodge {
    background: radial-gradient(white 30%, #0000 40%);
    background: radial-gradient(circle, white, black 35%) center / 25% 25%;
    background-size: 100px 100px;

    position: absolute;

    top: -100%;
    left: -100%;
    right: 0;
    bottom: 0;
    
    mix-blend-mode: color-dodge;

    animation: neon-text-effect__animation 4s linear infinite;
  }

  @keyframes neon-text-effect__animation {
    to {
      transform: translate(50%, 50%);
    }
  }

  @media (max-width: ${theme.breakpoints.values.xl}px) {
    .neon-text-effect__text {
      font-size: 70px;
    }
  }
  @media (max-width: ${theme.breakpoints.values.lg}px) {
    .neon-text-effect__text {
      font-size: 40px;
    }
  }
  @media (max-width: ${theme.breakpoints.values.md}px) {
    .neon-text-effect__text {
      font-size: 70px;
    }
  }
  @media (max-width: ${theme.breakpoints.values.sm}px) {
    .neon-text-effect__text {
      font-size: 50px;
    }
  }
  @media (max-width: 400px) {
    .neon-text-effect__text {
      font-size: 30px;
    }
  }
  `}
`;
