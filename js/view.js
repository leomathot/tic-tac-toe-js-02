export default class View {

$ = {}
$$ = {}

    constructor() {
        this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
        this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
        this.$.ties = this.#qs('[data-id="ties"]');
        this.$.circle1 = this.#qs('[data-id="circle-1"]');
        this.$.circle2 = this.#qs('[data-id="circle-2"]');
        this.$.turn = this.#qs('[data-id="turn"]');
        this.$.menu = this.#qs('[data-id="menu"]');
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
        this.$.menuBtnChevronDown = this.#qs('[data-id="menu-btn-chevron-down"]');
        this.$.menuItems = this.#qs('[data-id="menu-items"]');
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
        this.$.modal = this.#qs('[data-id="modal"]');
        this.$.modalText = this.#qs('[data-id="modal-text"]');
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]');

        // Element lists
        this.$$.squares = this.#qsAll('[data-id="square"]');

        // UI-only event listeners
        this.$.menuBtn.addEventListener("click", event => {
            this.#toggleMenu()
        })
    }

    // Register all the event listeners

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener("click", handler);
        this.$.modalBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMoveEvent(handler) {
        this.$$.squares.forEach(square => {
            square.addEventListener("click", () => handler(square))
        });
    }

    // DOM helper methods

    updateScoreboard(p1Wins, p2Wins, ties, starts) {
        this.$.p1Wins.innerText = `${p1Wins} ${p1Wins === 1 ? "win" : "wins"}`;
        this.$.p2Wins.innerText = `${p2Wins} ${p2Wins === 1 ? "win" : "wins"}`;
        this.$.ties.innerText = ties;

        if (starts.id === 1) {
            this.$.circle1.classList.add("white");
            this.$.circle1.classList.remove("gray");
            this.$.circle2.classList.add("gray");
            this.$.circle2.classList.remove("white");
        } else {
            this.$.circle1.classList.add("gray");
            this.$.circle1.classList.remove("white");
            this.$.circle2.classList.add("white");
            this.$.circle2.classList.remove("gray");
        }
    }

    openModal(message, color) {
        this.$.modal.classList.remove("hidden");
        this.$.modalText.classList = color;
        this.$.modalText.innerText = message;
    }

    closeAll() {
        this.#closeModal();
        this.#closeMenu();
    }

    #closeModal() {
        this.$.modal.classList.add("hidden");
    }

    clearMoves() {
        this.$$.squares.forEach(sq => {
            sq.replaceChildren();
        });
    }

    #closeMenu() {
        this.$.menuItems.classList.add("hidden");
        
        this.$.menuBtn.classList.remove("light-blue");

        const icon = this.$.menuBtn.querySelector("i");
        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");
    }

    #toggleMenu() {
        this.$.menuBtn.classList.toggle("light-blue");
        this.$.menuItems.classList.toggle("hidden");

        const icon = this.$.menuBtn.querySelector("i");
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    handlePlayerMove(squareEl, player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        squareEl.replaceChildren(icon);
    }

    setTurnIndicator(player) {

        const icon = document.createElement("i");
        const label = document.createElement("p");
        
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);

        label.classList.add(player.colorClass);
        label.innerText = `${player.name}!`;

        this.$.turn.replaceChildren(icon, label);
    }

    #qs(selector, parent) {
        const el = parent 
            ? parent.querySelector(selector) 
            : document.querySelector(selector)
        if(!el) throw new Error("Could not find elements")
        return el
    }

    #qsAll(selector) {
        const elList = document.querySelectorAll(selector)
        if(!elList) throw new Error("Could not find elements")
        return elList
    }

}