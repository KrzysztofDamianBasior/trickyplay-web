import { styled } from "@mui/material";

type Props = {
  time: number;
};

const Stopwatch = ({ time }: Props) => {
  return (
    <StopwatchContainer>
      <div className="timer">
        <span className="digits">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span className="digits">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
        </span>
        <span className="digits mili-sec">
          {("0" + ((time / 10) % 100)).slice(-2)}
        </span>
      </div>
    </StopwatchContainer>
  );
};

export default Stopwatch;

const StopwatchContainer = styled("div")`
  margin-left: 5px;

  /* .digits {
    color: #f5f5f5;
  } */

  .mili-sec {
    color: #04f230;
  }
`;
