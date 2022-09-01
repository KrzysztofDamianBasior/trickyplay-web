import React from "react";
import AnimatedPage from "../components/AnimatedPage";
import GlowingBlock from "../components/GlowingBlock";

type Props = {};

const TicTacToe = (props: Props) => {
  return (
    <AnimatedPage>
      <div>tic tac toe</div>
    </AnimatedPage>
  );
};

export default TicTacToe;
// function Square({value}) => <button>{value}</button>

// function Board =>
// 	Square value={ squaresState[0] }  onClick={ () => handleClick(0) }

// const horizontalWinningPatterns = [
// 	[0,1,2],
// 	[3,4,5],
// 	[6,7,8]
// ]
// const verticalWinningPatterns = [
// 	[0,3,6],
// 	[1,4,7],
// 	[2,5,8],
// ]
// const diagnoalWinningPatterns = [
// 	[0,4,8],
// 	[2,4,6]
// ]

// for(let i=0; i<winningPatterns.length; i++){
// 	const [a,b,c] = winningPatterns[i]
// }

// const TicTacToe = () => {
// 	const Cell = () => <button> </button>

// 	return <div>

// 	</div>
// }

// let combos = {
// 	across: [...],
// 	down:
// 	diagnol
// }

// for (let combo in combos){
// 	combos[combo].forEach(   (pattern)=>
// 		if squares[patern[0]  squares[pattern[1]
// }

// choose if u are x or o
