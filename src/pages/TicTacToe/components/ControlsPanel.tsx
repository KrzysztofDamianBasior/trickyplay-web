import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import ActionButton from "../../../shared/components/ActionButton";
import Banner from "../../../shared/components/Banner";

import PointsContainer from "./PointsContainer";

type Props = {
  points: { o: number; x: number };
  openModal: () => void;
  resetPoints: () => void;
};

const ControlsPanel = ({ points, openModal, resetPoints }: Props) => {
  return (
    <TicTacToeControls>
      <Banner text="Tic Tac Toe" />
      <Box
        sx={{
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" fill="%23000000"><path d="M1912 1209c27-319-72-699-318-882-187-139-462-224-785-204S85 468 84 880c0 455 481 345 636 484s139 514 477 516c386 3 693-420 715-671Z"></path></svg>')`
              : "",
          backgroundRepeat: "no-repeat",
          backgroundSize: "80%",
          backgroundPosition: "center",
          padding: { xs: "80px", sm: "120x", md: "140px" },
        }}
      >
        <ActionButton onClick={() => openModal()}>
          Start a new game
        </ActionButton>

        <PointsContainer
          title="POINTS"
          headers={["O", "X"]}
          points={[points.o, points.x]}
          reset={() => resetPoints()}
        />
      </Box>
    </TicTacToeControls>
  );
};

export default ControlsPanel;

const TicTacToeControls = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;
