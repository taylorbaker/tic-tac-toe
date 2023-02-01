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
  for (let el in gameboard) {
    gamespaces[el].addEventListener('click', function() {
      if (playerX.isTurn && !gameboard[el]) {
        makeMove('X', el);
        GameController.swapTurn();
        GameController.endGameCheck();
      } else if (playerO.isTurn && !gameboard[el]) {
        makeMove('O', el);
        GameController.swapTurn();
        GameController.endGameCheck();
      }
    });
  }

  function _render() {
    for (let space in gameboard) {
      if (gameboard[space]) { // if gamespace value exists
        gamespaces[space].querySelector('p').innerText = gameboard[space]; // draw board
      } else {
        gamespaces[space].querySelector('p').innerText = "";
      }
    }
  }

  function _init() {
    _render();
  }

  function makeMove(team, pos) {
    gameboard.splice(pos, 1, team);
    _render();
  }

  function gameWinner() {
    // check diagonals
    if (gameboard[2] && gameboard[4] == gameboard[2] && gameboard[6] == gameboard[4]) {
      return gameboard[2];
    } else if (gameboard[0] && gameboard[0] == gameboard[4] && gameboard[4] == gameboard[8]) {
      return gameboard[0];
    }

    // check rows 
    for (let i = 0; i < 3; i++) {
      if (gameboard[3 * i] && gameboard[3 * i] == gameboard[3 * i + 1] && gameboard[3 * i] == gameboard[3 * i + 2]) {
        return gameboard[3 * i];
      }
    }

    // check columns
    for (let j = 0; j < 3; j++) {
      if (gameboard[j] && gameboard[j] == gameboard[j + 3] && gameboard[j] == gameboard[j + 6]) {
        return gameboard[j];
      }
    }

    return false;
  }

  function resetBoard() {
    for (let index = 0; index < gameboard.length; index++) {
      gameboard[index] = null;
    }
    _render();
  }

  _init();

  return {
    makeMove,
    gameWinner,
    resetBoard,
  }
})();

const GameController = (() => {

  // cache DOM
  const playerXText = document.getElementById('player-x-text');
  const playerOText = document.getElementById('player-o-text');
  const newGameBtn = document.getElementsByTagName('button');

  newGameBtn[0].addEventListener('click', newGame);

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

  function endGameCheck() {
    if (Gameboard.gameWinner() == 'X') {
      playerXText.innerText = "wins!";
      playerOText.innerText = "";
    } else if (Gameboard.gameWinner() == 'O') {
      playerXText.innerText = "";
      playerOText.innerText = "wins!";
    }
  }

  function _consoleTurns() {
    console.log("playerX's turn: " + playerX.isTurn + "\n");
    console.log("playerO's turn: " + playerO.isTurn + "\n");
    if (!Gameboard.gameWinner()) {
      console.log("game continues\n")
    } else {
      console.log("winner: Player \'" + Gameboard.gameWinner() + "\'\n");
    }

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
    endGameCheck,
  }
})();

