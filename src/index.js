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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySymbol:null,
      squares: {},
      nextTurn: null,
    };
  }

  componentDidMount() {
    const userId = new URLSearchParams(window.location.search).get('userId');
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    const url = 'http://localhost:3000/state?gameId='+gameId+'&userId='+userId;
    console.log("Get query--",url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let mySymbol = data['playerOneId'] === userId ? 'X' : 'O';
        this.setState({mySymbol: mySymbol,squares: data['state'], nextTurn: data['nextTurn']});
        console.log("componentDidMount data: ", data);
        console.log("componentDidMount nextTurn: ", data['nextTurn']);
      })
      .catch(err => {
        console.log('getSymbol', err.message);
      });
  }

  handleClick(i) {
   const userId = new URLSearchParams(window.location.search).get('userId');
   const gameId = new URLSearchParams(window.location.search).get('gameId');
   if(this.state.nextTurn!==this.state.mySymbol){
      console.log("Wrong move");
      return;
   }
    const squares = this.state.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //Post Api implementation

    fetch('http://localhost:3000/move', {
        method: 'POST',
        body: JSON.stringify({
          gameId: gameId,
          userId: userId,
          cellIndex: i,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(data => {this.setState({squares: data['state'], nextTurn: data['nextTurn']})})
        .catch(err => {
          console.log('postSymbol', err.message);
        });
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
      status = 'Next player: ' + (this.state.nextTurn);
    }
    let mySymbolStatus = 'Your symbol: ' + this.state.mySymbol;

    return (
      <div>
        <div className="status">{status}</div>
        <div className="status">{mySymbolStatus}</div>
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
    console.log("render: ", this.state);
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
