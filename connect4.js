"use strict";
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const startButton = document.querySelector('#start-button');


const myForm = document.querySelector('#setup-form');
myForm.addEventListener('submit', handleStartGame);

let player1;
let player2;

function handleStartGame (evt){
  evt.preventDefault();
  myForm.classList.add('hidden');

  //Grab colors from input fields, build game using these player colors.
  let p1color = document.querySelector('#p1color').value;
  let p2color = document.querySelector('#p2color').value;
  let myGame = new Game(6, 7, p1color, p2color);
}

class Player {
  constructor(color, num){
    this.num = num;
    this.color = color;
  }
}

class Game {
  constructor(height=6, width=7, p1color='red', p2color='blue'){
    this.height = height;
    this.width = width;

    this.player1 = new Player(p1color, 1);
    this.player2 = new Player(p2color, 2);
    this.currPlayer = this.player1; //this.currPlayer = 1;

    this.gameDone = false;
    this.board = this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    let board = [];
    for (let y = 0; y < this.height; y++) {
      board.push(Array.from({ length: this.width }));
    }
    return board;
  }

  makeHtmlBoard() {
    const boardHtml = document.getElementById('board');

    //clear board. Needed for tests/multiple boards being made
    boardHtml.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      headCell.addEventListener('click', this.handleClick.bind(this));
      top.append(headCell);
    }

    boardHtml.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      boardHtml.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.num} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }




  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    if (this.currPlayer === player1){
      piece.classList.add('p1');
    } else {
      piece.classList.add('p2');
    }
    piece.style.backgroundColor = this.currPlayer.color; //piece.classList.add(`p${this.currPlayer}`);

    const spot = document.getElementById(`c-${y}-${x}`);
    if (!this.gameDone){
      spot.append(piece);
    }
  }


  checkForWin() {
    //DONE: refactor to arrow function. this will be bound to the outer checkForWin
    //(which is the expected Game instance: it's called from handleClick, which has
    //its this explicitly bound to class Game)
    let _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    //If not using arrow functions, would need to use below.
    //let boundWin = _win.bind(this);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];


        /* if (boundWin(horiz) || boundWin(vert) || boundWin(diagDR) || boundWin(diagDL)){
          return true;
        } */
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  /** endGame: announce game end */
  endGame(msg) {
    if (!this.gameDone){
      alert(msg);
      this.gameDone = true;
    }
  }
}
