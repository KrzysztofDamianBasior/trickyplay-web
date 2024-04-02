import { styled } from "@mui/material";

const GlowingMovingText = styled("button")<{ isDarkMode: boolean }>`
  ${({ theme, isDarkMode }) => `
    background: transparent;
  
    border: none;

    margin-left: 30px;

    text-align: start;
    color: ${isDarkMode ? "#767676" : "#222"};
    letter-spacing: 5px;
    font-size: 6rem;
    font-weight: 500;
    
    max-width: 500px;
    max-height: 500px;
    
    @media (max-width: ${theme.breakpoints.values.md}px) {
      letter-spacing: 4px;
      font-size: 4.2rem;
      font-weight: 500;
      
      max-width: 400px;
      max-height: 400px;
    }
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      letter-spacing: 2px;
      font-size: 2.5rem;
      font-weight: 500;
      
      max-width: 250px;
      max-height: 250px;
    }
    
    cursor: pointer;

    span {
      transition: 2s;
      color: #fff;
      text-shadow: ${
        isDarkMode
          ? `0 0 10px #fff, 0 0 20px #fff, 0 0 40px #fff, 0 0 80px #fff,
        0 0 120px #fff`
          : `0 0 10px #000, 0 0 20px #000, 0 0 40px #000, 0 0 80px #000,
        0 0 120px #000`
      };
    }
    &:hover span:nth-of-type(1) {
      margin-right: 15px;
    }
    &:hover span:nth-of-type(2) {
      margin-left: 50px;
    }
  `}
`;

export default GlowingMovingText;
