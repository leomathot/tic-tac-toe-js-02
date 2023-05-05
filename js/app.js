import Store from "./store.js";
import View from "./view.js"

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "green",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
    const view = new View();
    const store = new Store(players);

    view.bindGameResetEvent(event => {
        view.closeAll();
        store.reset();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScoreboard(
          store.stats.playerWithStats[0].wins,
          store.stats.playerWithStats[1].wins,
          store.stats.ties,
          store.game.whoStarts
        );

    })

    view.bindNewRoundEvent(event => {
        store.newRound();
        view.closeAll();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScoreboard(
          store.stats.playerWithStats[0].wins,
          store.stats.playerWithStats[1].wins,
          store.stats.ties,
          store.game.whoStarts
        );
    })

    view.bindPlayerMoveEvent((square) => {

        const existingMove = store.game.moves.find((move) => move.squareId === square.id);

        if (existingMove) {
          return
        }

        // PLace an icon of the current player in a square
        view.handlePlayerMove(square, store.game.currentPlayer);

        // Advance to the next state by pushing a move to the moves array
        store.playerMove(square.id);

        // Open modal
        if (store.game.status.isComplete) {

          view.openModal(
            store.game.status.winner 
              ? `${store.game.status.winner.name} wins!` 
              : "Tie!"
            ,store.game.status.winner?.colorClass);

          return;
        }

        // Set the next player's turn indicator
        view.setTurnIndicator(store.game.currentPlayer);
    })
    
}

window.addEventListener("load", init);