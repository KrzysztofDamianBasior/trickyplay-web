import React from "react";
import styled from "styled-components";

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

const PointsTable = styled.table`
  border-spacing: 1px;
  border-collapse: collapse;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  position: relative;

  thead,
  tbody {
    background: ${(p) => p.theme.secondaryColor};
    color: ${(p) => p.theme.backgroundColor};
    th,
    td {
      padding: 12px 15px;
      text-align: center;
    }
  }

  thead tr {
    background-color: #009879;
    color: #ffffff;
  }

  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  tbody tr:nth-of-type(even) {
    background-color: #868484;
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tfoot {
    background: transparent;
    transition: all 1s ease;

    .points-container__reset-button {
      width: 100%;
      height: 100%;

      cursor: pointer;
      display: flex;

      align-items: center;
      justify-content: center;

      font-family: "Cookie", cursive;
      background-color: white;
      border-radius: 6px;
      transition: all 1s ease;

      &:hover {
        text-shadow: 0 0 10px #fff, 0 0 10px #fff, 0 0 20px #82bedc,
          0 0 30px #82bedc, 0 0 40px #82bedc, 0 0 50px #82bedc, 0 0 60px #82bedc;
        background-color: black;
      }
    }
  }
`;
