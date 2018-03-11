import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + props.activate_square_class} onClick={props.onClick}>
      {props.value}
    </button>
  ); 
}

function calculate_winner(squares) {
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
  for(let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
              activate_square_class={ this.props.activate_squares && this.props.activate_squares.includes(i) ? 'active' : ''} 
      />
    );
  }

  render() {
    return (
      <div>
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
  
  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.current_step];
    const squares = current.squares.slice();
    if (calculate_winner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.is_current_user_X ? 'X': 'O';
    this.setState({
      history: history.concat([{squares: squares}]),
      current_step: history.length,
      is_current_user_X: !this.state.is_current_user_X}
    );
  }

  jumpTo(move) {
    this.setState({
      current_step: move,
      is_current_user_X: move%2 != 0
    })
  }

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      is_current_user_X: true,
      current_step: 0
    };
  }

  render() {
    const history = this.state.history
    const current = history[this.state.current_step]
    const game_status = calculate_winner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start"
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if (game_status) {
      status = "Player with " + current.squares[game_status[0]] + " won";
      
    }
    else{
      status = "Current Turn: " + (this.state.is_current_user_X ? 'X': 'O');
    }

    return(
      <div className="game">
        <div className="game-board">
          <Board squares={ current.squares }
                 onClick={ (i) => this.handleClick(i) }
                 activate_squares={game_status}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// =========================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);