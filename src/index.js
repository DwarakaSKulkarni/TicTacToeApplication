import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
// get API implementation
const getSymbol = async () => {
    const response = await fetch('http://localhost:3000/state?gameID=124&userID=109')
    const data = await response.json();
    console.log('getSymbol: ', data);
};

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: {},
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      xIsNext: !this.state.xIsNext,
    });
    //Post Api implementation
    /*const userId = new URLSearchParams(window.location.search).get('userId');
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    fetch('http://localhost:3000/move', {
        method: 'POST',
        body: JSON.stringify({
          state: squares,
          userId: userId,
          gameId: gameId,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(data => {this.setState({squares: data['state']})})
        .catch(err => {
          console.log('postSymbol', err.message);
        }); */
        getSymbol();
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }


  render() {
   // console.log('render: ', JSON.stringify({state: this.state.squares}));
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
            <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
