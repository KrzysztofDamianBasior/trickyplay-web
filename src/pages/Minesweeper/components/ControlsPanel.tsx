import { Box, styled } from "@mui/material";

import ActionButton from "../../../shared/components/ActionButton";
import Banner from "../../../shared/components/Banner";

import Stopwatch from "./../components/Stopwatch";

type Props = {
  time: number;
  gameStatus: string;
  openModal: () => void;
};

const ControlsPanel = ({ time, openModal, gameStatus }: Props) => {
  return (
    <MinesweeperControls>
      <Banner text="Minesweeper" />
      <Box
        sx={{
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1800" fill="%23000000"><path d="M1386.57 181.4c160.9 73.74 328.5 149.72 424.59 281.57 96.09 129.61 118.44 315.09 98.33 487.16-20.11 172.07-84.92 332.97-187.71 446.94-105.03 116.2-250.29 185.48-391.07 243.58-138.55 60.34-272.63 109.5-393.31 91.62-122.91-17.88-234.64-102.8-377.66-160.9-143.02-58.1-317.33-87.15-406.71-183.24-89.39-96.09-96.09-261.46 2.23-368.72 98.33-109.5 301.68-160.9 384.37-270.4 82.68-111.73 42.46-283.81 84.92-422.36C669.24 188.1 798.86 80.83 937.41 60.72c140.79-20.11 290.51 49.16 449.17 120.67Z"></path></svg>')`
              : "",
          backgroundRepeat: "no-repeat",
          backgroundSize: "70%",
          backgroundPosition: "center",

          padding: { xs: "70px", sm: "100px", md: "120px" },

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <ActionButton onClick={() => openModal()}>Start a game</ActionButton>
        <Box
          sx={{
            backgroundColor: ({ palette }) =>
              palette.mode === "dark" ? "secondary.dark" : "secondary.light",

            borderRadius: "16px",

            p: 1,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",

            minWidth: "80%",
          }}
        >
          <Box
            sx={{
              width: "100%",

              fontSize: { xs: "12px", sm: "20px", md: "20px", lg: "25px" },
              textTransform: "uppercase",
              textAlign: "center",

              m: 1,
            }}
          >
            game status: <Box>{gameStatus}</Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",

              fontSize: { xs: "8px", sm: "15px", md: "15px", lg: "20px" },
            }}
          >
            timer:
            <Stopwatch time={time} />
          </Box>
        </Box>
      </Box>
    </MinesweeperControls>
  );
};
export default ControlsPanel;

const MinesweeperControls = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 50vh;
`;
