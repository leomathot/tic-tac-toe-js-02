
const inicialValue = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: []
    }
}

export default class Store {

    #state = inicialValue

    constructor(players) {
        this.players = players;
    }

    get stats() {

        const state = this.#getState();

        return {
            playerWithStats: this.players.map(player => {
                const wins = state.history.currentRoundGames.filter(game => game.status.winner?.id === player.id).length;

                return {
                    ...player,
                    wins
                }
            }),
            ties: state.history.currentRoundGames.filter(game => game.status.winner === null).length
        }
    }

    get game() {
        const state = this.#getState();

        // take turns to start
        const whoStarts = this.players[state.history.currentRoundGames.length % 2];

        const currentPlayer = state.currentGameMoves.length === 0 // game starts ?
            ?  whoStarts 
            : this.players[(state.currentGameMoves.length + whoStarts.id - 1) % 2];

        const winningPatterns = [
            ["s-1", "s-2", "s-3"],
            ["s-1", "s-5", "s-9"],
            ["s-1", "s-4", "s-7"],
            ["s-2", "s-5", "s-8"],
            ["s-3", "s-5", "s-7"],
            ["s-3", "s-6", "s-9"],
            ["s-4", "s-5", "s-6"],
            ["s-7", "s-8", "s-9"],
          ];

          let winner = null;

          for (const player of this.players) {
            const selectedSquareIds = state.currentGameMoves.filter(move => move.player.id === player.id).map(move => move.squareId)
            
            for (const pattern of winningPatterns) {
                if (pattern.every(val => selectedSquareIds.includes(val))) {
                    winner = player
                }
            }
          }

        return {
            moves: state.currentGameMoves,
            whoStarts,
            currentPlayer,
            status: {
                isComplete: winner != null || state.currentGameMoves.length === 9 ,
                winner
            }
        }
    }

    playerMove(squareId) {
        const stateClone = structuredClone(this.#getState());
        
        stateClone.currentGameMoves.push({
            squareId,
            player: this.game.currentPlayer
        })

        this.#saveState(stateClone);
    }

    reset() {

        const stateClone = structuredClone(this.#getState());

        const {status, moves} = this.game;

        if (status.isComplete) {
            stateClone.history.currentRoundGames.push({
                moves, 
                status
            })
        }

        stateClone.currentGameMoves = [];

        this.#saveState(stateClone);
    }

    newRound() {
        this.reset();

        const stateClone = structuredClone(this.#getState());
        stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];

        this.#saveState(stateClone);
    }

    #getState() {
        return this.#state;
    }

    #saveState(stateOrFn) {
        const prevState = this.#getState()

        let newState

        switch (typeof stateOrFn) {
            case "function":
                newState = stateOrFn(prevState);
                break;
            case "object":
                newState = stateOrFn;
                break;
        
            default:
                throw new Error("Invalid argument passed to saveState");
        }

        this.#state = newState;
    }
}