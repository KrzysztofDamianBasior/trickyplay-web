import { styled } from "@mui/material/styles";

type Props = {
  title: string;
  headers: string[];
  points: number[];
  reset: () => void;
};

const PointsContainer = (props: Props) => {
  return (
    <PointsTable>
      <thead>
        <tr>
          <th colSpan={props.headers.length}>{props.title}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {props.headers.map((header, index) => (
            <th key={"headers" + header + index.toString()}>{header}</th>
          ))}
        </tr>
        <tr>
          {props.points.map((point, idx) => (
            <td key={"points" + idx.toString() + point.toString()}>{point}</td>
          ))}
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={props.headers.length}>
            <button
              className="points-container__reset-button"
              onClick={() => props.reset()}
            >
              RESET
            </button>
          </th>
        </tr>
      </tfoot>
    </PointsTable>
  );
};

export default PointsContainer;

const PointsTable = styled("table")(
  ({ theme }) => `
  border-spacing: 1px;
  border-collapse: collapse;
  border-radius: 5px;
  overflow: hidden;

  width: 100%;

  margin: 0 auto;
  padding: 0;
  
  position: relative;

  thead,
  tbody {
    th,
    td {
      padding: 12px 15px;
      text-align: center;
    }
  }

  thead tr {
    background-color: ${
      theme.palette.mode === "light"
        ? theme.palette.primary.light
        : theme.palette.primary.dark
    };
    color: ${theme.palette.text.primary};
  }

  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  thead th, tbody th {
    background-color:  ${
      theme.palette.mode === "light"
        ? theme.palette.secondary.light
        : theme.palette.secondary.dark
    }
  }
  td {
    background-color:  ${theme.palette.secondary.main}
  }

  tfoot {
    background: transparent;
    transition: all 0.5s ease;

    .points-container__reset-button {
      width: 100%;
      height: 100%;
      margin-top: 5px;

      cursor: pointer;
      display: flex;

      align-items: center;
      justify-content: center;

      font-family: "Cookie", cursive;
      background-color: white;
      border-radius: 6px;
      transition: all 0.4s ease;

      border: thick double ${theme.palette.secondary.main};

      &:hover {
        text-shadow: 0 0 10px #fff, 0 0 10px #fff, 0 0 20px #82bedc,
          0 0 30px #82bedc, 0 0 40px #82bedc, 0 0 50px #82bedc, 0 0 60px #82bedc;
        background-color: black;
      }
    }
  }
`
);
