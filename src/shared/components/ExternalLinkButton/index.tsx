import { styled } from "@mui/system";
// from mui docs:
// All the MUI components are styled with this styled() utility. This utility is built on top of the styled() module of @mui/styled-engine and provides additional features.
// You can use the utility coming from the @mui/system package, or if you are using @mui/material, you can import it from @mui/material/styles. The difference is in the default theme that is used (if no theme is available in the React context).
// The utility can be used as a replacement for emotion's or styled-components' styled() utility. It aims to solve the same problem, but also provides the following benefits:
// It uses MUI's default theme if no theme is available in React context.
// It supports the theme's styleOverrides and variants to be applied, based on the name applied in the options (can be skipped).
// It adds support for the the sx prop (can be skipped).
// It adds by default shouldForwardProp option that is taking into account all props used internally in the MUI components (can be overridden).

type Props = { url: string; children: React.ReactNode };

const ExternalLinkButton = ({ url, children }: Props) => {
  return (
    <SpecialLink href={url} data-testid="external-link-button">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      {children}
    </SpecialLink>
  );
};

export default ExternalLinkButton;

const SpecialLink = styled("a")`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  padding: 15px 30px;
  color: #21ebff;
  letter-spacing: 2px;
  text-decoration: none;
  /* font-size: 1rem; */

  width: 10vw;
  overflow: hidden;

  cursor: "pointer";

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
