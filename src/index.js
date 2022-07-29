import { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const PLAYERS = ["X", "O"];

function normalizeIndex(index, size) {
  if (index > 0) return index;
  return size + index;
}

function slice(values, start, end, step) {
  start = normalizeIndex(start, values.length);
  end = normalizeIndex(end);

  if (start < 1) {
    start = values.length + start;
  }

  let result = [];
  for (let i = start; i < end; i += step) {
    result.push(values[i]);
  }
  return result;
}

function getSectionWinner(items) {
  const set = new Set(items);
  if (set.size !== 1) {
    return null;
  }
  return items[0];
}

function getWinner(values) {
  console.log(values);
  let winner;
  for (let i = 0; i < 3; i++) {
    winner = getSectionWinner(slice(values, i * 3, (i + 1) * 3, 1));
    if (winner !== null) return winner;
    winner = getSectionWinner(slice(values, i, i + 7, 3));
    if (winner !== null) return winner;
  }

  for (let i = 0; i < 3; i += 2) {
    winner = getSectionWinner(slice(values, i, 9 - i, 4 - i));
    if (winner !== null) return winner;
  }

  return null;
}

function Square({ label, onClick }) {
  return (
    <button onClick={onClick} className="square">
      {label}
    </button>
  );
}

function Status({ message }) {
  return <div className="status">{message}</div>;
}

function Board({ values, onClick, winner, next, onUndo }) {
  function renderSquare(i) {
    return <Square onClick={() => onClick(i)} label={values[i]} />;
  }

  console.log(
    winner !== null
      ? `Winner is ${winner}`
      : `Next player is : ${PLAYERS[next]}`
  );

  return (
    <div className="board">
      <Status
        message={
          winner !== null
            ? `Winner is ${winner}`
            : `Next player is : ${PLAYERS[next]}`
        }
      />
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="undo" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([
    {
      values: Array(9).fill(null),
      winner: null,
      next: 0,
    },
  ]);

  function onUndo() {
    if (history.length < 2) return;
    setHistory(history.slice(1));
  }

  function onClick(i) {
    if (history[0].values[i] !== null) {
      return;
    }

    if (history[0].winner !== null) {
      alert(`${history[0].winner} already won the game.`);
      return;
    }

    const values = history[0].values.slice();
    values[i] = PLAYERS[history[0].next];
    const winner = getWinner(values);
    const next = (history[0].next + 1) % PLAYERS.length;

    const temp = history.slice();
    temp.unshift({
      values: values,
      winner: winner,
      next: next,
    });

    setHistory(temp);
  }

  return (
    <div className="game">
      <Board {...history[0]} onClick={onClick} onUndo={onUndo} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Game />);
