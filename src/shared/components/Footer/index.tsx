import CloudIcon from "@mui/icons-material/Cloud";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import HandshakeIcon from "@mui/icons-material/Handshake";

import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const linksList: {
    url: string;
    icon: JSX.Element;
  }[] = [
    {
      url: "https://www.linkedin.com/",
      icon: <LinkedInIcon fontSize="large" />,
    },
    {
      url: "https://www.wikiwand.com/en/API",
      icon: <CloudIcon fontSize="large" />,
    },
    { url: "https://github.com/", icon: <GitHubIcon fontSize="large" /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "#111",
        height: "auto",
        width: "100%",
        paddingTop: "40px",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "2rem",
            fontWeight: 400,
            textTransform: "capitalize",
            lineHeight: "3rem",
          }}
        >
          TrickyPlay
        </h3>
        <p
          style={{
            margin: "10px auto",
            lineHeight: "28px",
            fontSize: "1rem",
          }}
        >
          Application that provides you with simple 2d games
        </p>
        <Box
          component="ul"
          sx={{
            padding: 0,
            boxSizing: "border-box",
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "1rem 0 3rem 0",
          }}
        >
          {linksList.map((link) => (
            <Box
              component="li"
              key={link.url}
              sx={{
                margin: "0 10px",
                textDecoration: "none",
                color: "#fff",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "primary.main",
                },
                cursor: "pointer",
              }}
            >
              <a href={link.url} style={{ color: "inherit" }}>
                {link.icon}
              </a>
            </Box>
          ))}
          <Box
            component="li"
            role="link"
            sx={{
              margin: "0 10px",
              textDecoration: "none",
              color: "#fff",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "primary.main",
              },
              cursor: "pointer",
            }}
            onClick={() => navigate("/attribution")}
          >
            <HandshakeIcon fontSize="large" />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "background.default",
          width: "100%",
          padding: "20px 0",
          textAlign: "center",
          color: "text.primary",
        }}
      >
        copyright &copy;2024 TrickyPlay
      </Box>
    </Box>
  );
};

export default Footer;
