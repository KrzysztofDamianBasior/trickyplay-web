import { Box } from "@mui/material";

type Props = { onClick: () => void; children: React.ReactNode };

const ActionButton = ({ onClick, children }: Props) => {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        cursor: "pointer",

        backgroundColor: "rgba(0, 0, 0, 0)",

        border: "none",

        position: "relative",

        padding: "10px 30px",
        margin: "10px 15px",

        color: "primary.main",
        textDecoration: "none",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontSize: { xs: "10px", sm: "20px", md: "25px", lg: "30px" },

        transition: "0.4s",

        overflow: "hidden",

        "&:hover": {
          backgroundColor: "primary.main",
          color: "#000000",
          boxShadow: "0 0 50px primary.main",
          transitionDelay: "0.5s",
        },

        "&::before": {
          content: '""',

          position: "absolute",
          top: 0,
          left: 0,

          width: "10px",
          height: "10px",

          // borderTop: "2px solid primary.main",
          // borderLeft: "2px solid primary.main",
          borderLeftStyle: "solid",
          borderLeftWidth: "2",
          borderLeftColor: "primary.main",
          borderTopStyle: "solid",
          borderTopWidth: "2",
          borderTopColor: "primary.main",

          transition: "0.5s",
          transitionDelay: "0.5s",
        },
        "&::after": {
          content: '""',

          position: "absolute",
          bottom: 0,
          right: 0,

          width: "10px",
          height: "10px",

          // borderBottom: `2px solid primary.main`,
          // borderRight: `2px solid primary.main`,
          borderBottomStyle: "solid",
          borderBottomWidth: "2",
          borderBottomColor: "primary.main",
          borderRightStyle: "solid",
          borderRightWidth: "2",
          borderRightColor: "primary.main",

          transition: "0.5s",
          transitionDelay: "0.5s",
        },

        "&:hover::before": {
          width: "100%",
          height: "100%",
          transitionDelay: "0s",
        },
        "&:hover::after": {
          width: "100%",
          height: "100%",
          transitionDelay: "0s",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default ActionButton;
