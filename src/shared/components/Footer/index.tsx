import CloudIcon from "@mui/icons-material/Cloud";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";

const Footer = () => {
  const linksList: {
    url: string;
    icon: JSX.Element;
  }[] = [
    { url: "/", icon: <LinkedInIcon fontSize="large" /> },
    { url: "/", icon: <CloudIcon fontSize="large" /> },
    { url: "/", icon: <GitHubIcon fontSize="large" /> },
  ];

  return (
    <footer>
      <Box
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
            Application that provides you with simple 2d games like snake or
            minesweeper
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
                  transition: "color 1s ease",
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
          copyright &copy;2023 TrickyPlay
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
