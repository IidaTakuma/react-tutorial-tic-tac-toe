import './App.css'

type Player = 'X' | 'O';
type SquareValue = Player | null;
type Winner = Player | null;

type SquareProps = {
  value: SquareValue,
  isHighlight: boolean
}

type BoardValue = SquareValue[];
type History = BoardValue[];

type GameStatusProps = {
  winner: Winner,
  turnPlayer: Player
}

type BoardProps = {
  board: BoardValue,
  winner: Winner
}

type HistorianProps = {
  history: History
}

export default function App() {
  return (
    <>
      <Game></Game>
    </>
  )
};

function Game() {
  const history: History = [
    [null, null, null, null, null, null, null, null, null],
    ['X', null, null, null, null, null, null, null, null],
    ['X', null, null, 'O', null, null, null, null, null],
    ['X', 'X', null, 'O', null, null, null, null, null],
    ['X', 'X', null, 'O', 'O', null, null, null, null],
    ['X', 'X', 'X', 'O', 'O', null, null, null, null],
  ];
  const FIRST_PLAYER: Player = 'X';

  const currentBoard = history[history.length - 1];
  const winner = calculateWinner(currentBoard);
  const turnPlayer = (FIRST_PLAYER === 'X' ? history.length % 2 === 0 : history.length % 2 !== 0) ? 'O' : 'X';

  return (
    <div>
      <div className="game">
        <div className="game-board">
          <GameStatus winner={ winner } turnPlayer={ turnPlayer }></GameStatus>
          <Board board={ currentBoard } winner={ winner }></Board>
        </div>
        <div className="game-info">
          <Historian history={ history }></Historian>
        </div>
      </div>
    </div>
  )
}

function GameStatus( { winner, turnPlayer }: GameStatusProps ) {

  return (
    <div>{winner ? `Winner is ${winner}!` : `TurnPlayer is ${turnPlayer}!`}</div>
  )
};

function Board( { board, winner }: BoardProps ) {
  return (
    Array(3).fill(null).map((_, i) => (
      <div className="board-row" key={i}>
        {
          Array(3).fill(null).map((_, j) => {
            const index = i * 3 + j;
            const value = board[index];
            const isHighlight = value === winner

            return (
              <Square key={ index } value={ value } isHighlight={ isHighlight } ></Square>
            );
          })
        }
      </div>
    ))
  )
};

function Square( { value, isHighlight }: SquareProps ) {
  return (
    <button className={`square ${isHighlight ? 'highlight' : ''}`}>{ value || '' }</button>
  )
};

function Historian( { history }: HistorianProps ) {
  const isReverse = false;

  const historyList = history.map((step: BoardValue, move: number) => {
    if (move === 0) {
      return (
        <li key={ move }>
          <button onClick={() => console.log('clicked')}>Go to game start</button>
        </li>
      );
    } else {
      const [player, row, col] = findPlayerMove(step, history[move - 1]);
      return (
        <li key={ move }>
          <button onClick={() => console.log('clicked')}>{ `#${ move } ${ player }:(${ row }, ${ col })` }</button>
        </li>
      )
    }
  })

  return (
    <>
      { isReverse ? historyList.reverse() : historyList}
      <input type="checkbox" onClick={() => console.log('clicked')}></input>
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

function findPlayerMove(step: BoardValue, prevStep: BoardValue): [Player, number, number] {
  for (let i = 0; i < 9; i++) {
    if (step[i] !== prevStep[i]) {
      return [step[i] as Player, Math.floor(i / 3), i % 3];
    }
  }
  throw new Error('Invalid history');
}
