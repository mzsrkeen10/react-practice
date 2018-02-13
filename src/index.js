import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: props.color}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                color={this.props.winLine.includes(i) ? 'yellow' : 'white'}
            />
        );
    }

    render() {
        var squares = [];

        for(let i=0;i<3;i++){
            var row = [];
            for(let j=0;j<3;j++){
                row.push(this.renderSquare(i + 3*j));
            }
            squares.push(<div className="board-row" key={i}>{row}</div>);
        }
        return (<div>
            {squares}
        </div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: [],
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            console.log();
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: [i%3, Math.floor(i/3)],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseOrder() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const win_line = calculateWinner(current.squares);
        const winner = win_line ? current.squares[win_line[0]] : null;
        const current_step = this.state.stepNumber;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';
            const loc = move ?
                '(' + step.location[0] + ',' + step.location[1] + ')':
                '';
            const item = (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                    {loc}
                </li>
            );
            return (
                move === current_step ?
                    <b key={move}>
                        {item}
                    </b>:
                    item
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (current_step === 9) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (<div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    winLine={win_line ? win_line : []}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                {this.state.isAscending ?
                    <ol>
                        {moves}
                    </ol>:
                    <ol reversed>
                        {moves.reverse()}
                    </ol>
                }
            </div>
            <div className="reverse-button">
                <button onClick={() => this.reverseOrder()}>
                    reverse
                </button>
            </div>
        </div>);
    }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById('root'));

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
            return lines[i];
        }
    }
    return null;
}
