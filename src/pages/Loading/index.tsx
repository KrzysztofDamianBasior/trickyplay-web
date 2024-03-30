import { styled } from "@mui/material";
import AnimatedPage from "../../shared/components/AnimatedPage";

const Loading = () => {
  return (
    <AnimatedPage>
      <LoadingContainer>
        <LoadingText>
          <div className="loading-text__lightbar"></div>
          <div className="loading-text__curtain"></div>
          <h2>Loading ...</h2>
        </LoadingText>
      </LoadingContainer>
    </AnimatedPage>
  );
};
export default Loading;

const LoadingContainer = styled("div")`
  min-width: 80vw;
  min-height: 90vh;

  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled("div")(
  ({ theme }) => `
  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  overflow: hidden;

  width: 600px;
  height: 300px;

  h2 {
    color: white;
    font-size: 5rem;
    font-weight: 600;
    letter-spacing: 0.1rem;
    text-shadow: 0 0 10px ${theme.palette.primary.main},
      0 0 20px ${theme.palette.primary.main},
      0 0 40px ${theme.palette.primary.main},
      0 0 80px ${theme.palette.primary.main},
      0 0 120px ${theme.palette.primary.main};
  }

  @media (max-width: ${theme.breakpoints.values.md}px) {
    width: 300px;
    height: 150px;
    h2 {
      font-size: 3rem;
    }
  }
  @media (max-width: ${theme.breakpoints.values.sm}px) {
    width: 200px;
    height: 100px;
    h2 {
      font-size: 1.5rem;
    }
  }

  .loading-text__lightbar {
    position: absolute;
    top: 0;
    left: 0;

    width: 10px;
    height: 100%;
    
    border-radius: 10px;
    background: white;
    
    z-index: 2;
    
    box-shadow: 0 0 10px ${theme.palette.primary.main},
      0 0 20px ${theme.palette.primary.main},
      0 0 40px ${theme.palette.primary.main},
      0 0 80px ${theme.palette.primary.main},
      0 0 120px ${theme.palette.primary.main};
    
    animation: loading-text__animate-lightbar 2.5s linear infinite;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      animation: loading-text__animate-lightbar-md 2.5s linear infinite;
    }
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      animation: loading-text__animate-lightbar-sm 2.5s linear infinite;
    }  
  }

  .loading-text__curtain {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    
    background: ${theme.palette.mode === "dark" ? "black" : "white"};
    
    animation: loading-text__animate-curtain 5s linear infinite;
  }

  @keyframes loading-text__animate-lightbar {
    0%, 5% {
      transform: scaleY(0) translateX(0);
    }
    10% {
      transform: scaleY(1) translateX(0);
    }
    90% {
      transform: scaleY(1) translateX(calc(600px - 10px));
    }
    95%, 100% {
      transform: scaleY(0) translateX(calc(600px - 10px));
    }
  }

  @keyframes loading-text__animate-lightbar-md {
    0%, 5% {
      transform: scaleY(0) translateX(0);
    }
    10% {
      transform: scaleY(1) translateX(0);
    }
    90% {
      transform: scaleY(1) translateX(calc(300px - 10px));
    }
    95%, 100% {
      transform: scaleY(0) translateX(calc(300px - 10px));
    }
  }

  @keyframes loading-text__animate-lightbar-sm {
    0%, 5% {
      transform: scaleY(0) translateX(0);
    }
    10% {
      transform: scaleY(1) translateX(0);
    }
    90% {
      transform: scaleY(1) translateX(calc(200px - 10px));
    }
    95%, 100% {
      transform: scaleY(0) translateX(calc(200px - 10px));
    }
  }

  @keyframes loading-text__animate-curtain {
    0%, 5% {
      transform: translateX(0);
    }
    45%, 50% {
      transform: translateX(100%);
    }
    50.001%, 55% {
      transform: translateX(-100%);
    }
    95%, 100% {
      transform: translateX(0%);
    }
  }
`
);
