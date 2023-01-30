const playerFactory = (team) => {
  let isTurn = false;

  return {
    team,
    isTurn,
  }
}

let playerX = playerFactory('X');
let playerO = playerFactory('O');

const Gameboard = (() => {
  let gameboard = [null, null, null, null, null, null, null, null, null];

  // cache DOM
  const gamespaces = document.getElementsByClassName('gamespace');

  // bind events
  for (let el = 0; el < gameboard.length; el++) {
    gamespaces[el].addEventListener('click', function() {
      if (playerX.isTurn && !gameboard[el]) {
        makeMove('X', el);
        GameController.swapTurn();
      } else if (playerO.isTurn && !gameboard[el]) {
        makeMove('O', el);
        GameController.swapTurn();
      }
    });
  }

  function _render() {
    // console.log(gameboard);
    for (space in gameboard) {
      if (gameboard[space]) { // if gamespace value exists
        gamespaces[space].querySelector('p').innerText = gameboard[space]; // draw board
      } else {
        gamespaces[space].querySelector('p').innerText = "";
      }
    }
    // console.log(gamespaces);
    // console.log(playerXText);
  }

  function _init() {
    _render();
  }

  function makeMove(team, pos) {
    gameboard.splice(pos, 1, team);
    _render();
  }

  function resetBoard() {
    for (let i = 0; i < gameboard.length; i++) {
      gameboard[i] = null;
    }
    _render();
  }

  _init();

  return {
    makeMove,
    resetBoard,
  }
})();

const GameController = (() => {

  // cache DOM
  const playerXText = document.getElementById('player-x-text');
  const playerOText = document.getElementById('player-o-text');

  function newGame() {
    let _goesFirst = (Math.round(Math.random())); // 0 or 1, coinflip
    if (_goesFirst) {
      playerX.isTurn = true;
      playerO.isTurn = false;
    } else {
      playerX.isTurn = false;
      playerO.isTurn = true;
    }
    _consoleTurns();
    Gameboard.resetBoard();
  }

  function swapTurn() {
    playerX.isTurn = (playerX.isTurn) ? false : true;
    playerO.isTurn = (playerO.isTurn) ? false : true;
    _consoleTurns();
  }

  function _consoleTurns() {
    console.log("playerX's turn: " + playerX.isTurn + "\n")
    console.log("playerO's turn: " + playerO.isTurn)

    if (playerX.isTurn) {
      playerXText.innerText = "turn";
      playerOText.innerText = "";
    } else {
      playerXText.innerText = "";
      playerOText.innerText = "turn";
    }
  }

  return {
    newGame,
    swapTurn,
  }
})();

const newGameBtn = document.getElementsByTagName('button');
newGameBtn[0].addEventListener('click', GameController.newGame);
