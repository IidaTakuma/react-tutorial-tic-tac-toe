import { useState } from 'react';
import './App.css'

type Player = 'X' | 'O';
type SquareValue = Player | null;
type Winner = Player | null;

type SquareProps = {
  value: SquareValue,
  isHighlight: boolean,
  onPlay: () => void
}

type BoardValue = SquareValue[];
type History = BoardValue[];

type GameStatusProps = {
  winner: Winner,
  turnPlayer: Player,
  isDraw: boolean
}

type BoardProps = {
  currentBoard: BoardValue,
  winner: Winner,
  turnPlayer: Player,
  setNextBoard: (board: BoardValue) => void
}

type HistorianProps = {
  history: History,
  jumpTo: (move: number) => void
}

export default function App() {
  return (
    <>
      <Game></Game>
    </>
  )
};

function Game() {
  function setNextBoard(nextBoard: BoardValue) {
    setHistory(history.concat([nextBoard]));
  }

  function jumpTo(i: number) {
    setHistory(history.slice(0, i + 1));
  }

  const [history, setHistory] = useState<History>(Array(1).fill(Array(9).fill(null)));
  const FIRST_PLAYER: Player = 'X';

  const currentBoard = history[history.length - 1];
  const winner = calculateWinner(currentBoard);
  const turnPlayer = (FIRST_PLAYER === 'X' ? history.length % 2 === 0 : history.length % 2 !== 0) ? 'O' : 'X';
  const isDraw = calculateIsDraw(currentBoard);

  return (
    <div>
      <div className="game">
        <div className="game-board">
          <GameStatus winner={ winner } turnPlayer={ turnPlayer } isDraw={ isDraw }></GameStatus>
          <Board currentBoard={ currentBoard } winner={ winner } turnPlayer={ turnPlayer } setNextBoard={(nextBoard: BoardValue) => setNextBoard(nextBoard)}></Board>
        </div>
        <div className="game-info">
          <Historian history={ history } jumpTo={(i: number) => jumpTo(i)}></Historian>
        </div>
      </div>
    </div>
  )
}

function GameStatus( { winner, turnPlayer, isDraw }: GameStatusProps ) {

  return (
    <div>{winner ? `Winner is ${winner}!` : (isDraw ? 'Draw!' : `TurnPlayer is ${turnPlayer}!`)}</div>
  )
};

function Board( { currentBoard, winner, turnPlayer, setNextBoard }: BoardProps ) {

  function handlePlay(i: number) {
    const nextBoard = currentBoard.slice();
    if (winner || !!nextBoard[i]) return;

    nextBoard[i] = turnPlayer;
    setNextBoard(nextBoard);
  }

  const highlights: boolean[] = calculateHighlight(currentBoard);

  return (
    Array(3).fill(null).map((_, i) => (
      <div className="board-row" key={i}>
        {
          Array(3).fill(null).map((_, j) => {
            const index = i * 3 + j;
            const value = currentBoard[index];
            const isHighlight = highlights[index];

            return (
              <Square key={ index } value={ value } isHighlight={ isHighlight }　onPlay={ () => handlePlay(index) } ></Square>
            );
          })
        }
      </div>
    ))
  )
};

// onPlayで、クリックされたことを親コンポーネントに通知する
function Square( { value, isHighlight, onPlay }: SquareProps ) {
  return (
    <button className={`square ${isHighlight ? 'highlight' : ''}`} onClick={onPlay} >{ value || '' }</button>
  )
};

function Historian( { history, jumpTo }: HistorianProps ) {
  const [isReverse, setIsReverse] = useState(false);

  const historyList = history.map((step: BoardValue, move: number) => {
    if (move === 0) {
      return (
        <li key={ move }>
          <button onClick={() => jumpTo(0)}>Go to game start</button>
        </li>
      );
    } else {
      const [player, row, col] = findPlayerMove(step, history[move - 1]);
      return (
        <li key={ move }>
          <button onClick={() => jumpTo(move)} >{ `#${ move } ${ player }:(${ row }, ${ col })` }</button>
        </li>
      )
    }
  })

  return (
    <>
      { isReverse ? historyList.reverse() : historyList}
      <input type="checkbox" onClick={() => setIsReverse(!isReverse)}></input>
      <label>Reverse Button</label>
    </>
  )
};

function calculateWinner(board: BoardValue): Winner  {
  const WINNING_COMBINATIONS = [
    [0, 1, 2], // Horizontal
    [3, 4, 5], // Horizontal
    [6, 7, 8], // Horizontal
    [0, 3, 6], // Vertical
    [1, 4, 7], // Vertical
    [2, 5, 8], // Vertical
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Diagonal
  ]

  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function calculateHighlight(board: BoardValue): boolean[] {
  const WINNING_COMBINATIONS = [
    [0, 1, 2], // Horizontal
    [3, 4, 5], // Horizontal
    [6, 7, 8], // Horizontal
    [0, 3, 6], // Vertical
    [1, 4, 7], // Vertical
    [2, 5, 8], // Vertical
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Diagonal
  ]

  const highlight = Array(9).fill(false);
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlight[a] = true;
      highlight[b] = true;
      highlight[c] = true;
    }
  }
  return highlight;
}

function calculateIsDraw(board: BoardValue): boolean {
  return board.every((value) => value !== null) && !calculateWinner(board);
}

function findPlayerMove(step: BoardValue, prevStep: BoardValue): [Player, number, number] {
  for (let i = 0; i < 9; i++) {
    if (step[i] !== prevStep[i]) {
      return [step[i] as Player, Math.floor(i / 3), i % 3];
    }
  }
  throw new Error('Invalid history');
}
