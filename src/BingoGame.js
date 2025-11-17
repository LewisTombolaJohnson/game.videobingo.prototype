export class BingoGame {
    constructor(maxNumber = 80) {
        Object.defineProperty(this, "ticketCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "numbersPerTicket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 16
        }); // 4x4 grid
        Object.defineProperty(this, "callsPerGame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 40
        });
        Object.defineProperty(this, "_tickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_calls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_phase", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'idle'
        });
        Object.defineProperty(this, "numberPoolMax", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 80
        }); // bingo universe 1-80
        this.numberPoolMax = maxNumber;
        this.generateTickets();
    }
    get phase() { return this._phase; }
    get tickets() { return this._tickets; }
    get calls() { return this._calls; }
    regenerateTickets() {
        if (this._phase !== 'idle') {
            // Keep existing numbers while in showing phase
            return;
        }
        this.generateTickets();
    }
    generateTickets() {
        const pool = this.shuffle(Array.from({ length: this.numberPoolMax }, (_, i) => i + 1));
        this._tickets = [];
        let index = 0;
        for (let t = 0; t < this.ticketCount; t++) {
            const ticketNumbers = pool.slice(index, index + this.numbersPerTicket).sort((a, b) => a - b);
            index += this.numbersPerTicket;
            this._tickets.push(ticketNumbers);
        }
    }
    buyInOrNewGame() {
        if (this._phase === 'idle') {
            // generate calls
            const pool = this.shuffle(Array.from({ length: this.numberPoolMax }, (_, i) => i + 1));
            // Avoid picking more calls than remaining pool after tickets, but spec just wants uniqueness globally or not? It says tickets must not cross over; they are unique per ticket, but can calls include numbers from tickets? We'll allow any numbers (including hits) typical bingo.
            this._calls = pool.slice(0, this.callsPerGame).sort((a, b) => a - b);
            this._phase = 'showing-calls';
        }
        else {
            // clear calls keep tickets
            this._calls = [];
            this._phase = 'idle';
        }
        return this.snapshot();
    }
    snapshot() {
        return { tickets: this.tickets.map(t => [...t]), calls: [...this.calls], phase: this.phase };
    }
    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}
//# sourceMappingURL=BingoGame.js.map