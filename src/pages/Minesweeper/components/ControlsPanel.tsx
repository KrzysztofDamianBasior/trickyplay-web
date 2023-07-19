import styled from "styled-components";
import ActionButton from "../../../shared/components/ActionButton";

import Stopwatch from "./../components/Stopwatch";

import Banner from "../../../shared/components/Banner";

type Props = {
  time: number;
  openModal: () => void;
  gameStatus: string;
};

const ControlsPanel = ({ time, openModal, gameStatus }: Props) => {
  return (
    <MinesweeperControls>
      <Banner text="Minesweeper" />
      <ActionButton onClick={() => openModal()}>Start a game</ActionButton>
      <ControlsTable>
        <div>game status</div>
        <div>{gameStatus}</div>

        <div>timer</div>
        <div>
          <Stopwatch time={time} />
        </div>
      </ControlsTable>
    </MinesweeperControls>
  );
};
export default ControlsPanel;

const ControlsTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 10vh;
  width: 15vw;
  div {
    display: flex;
    align-items: center;
  }
`;

const MinesweeperControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 80vh;
  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 50vh;
    section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
`;
