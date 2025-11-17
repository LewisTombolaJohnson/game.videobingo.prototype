import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BingoGame } from './BingoGame';
const app = new Application();
const appDiv = document.getElementById('app');
(async () => {
    await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });
    // Ensure crisp scaling when iframe is scaled by browser
    app.renderer.canvas.style.imageRendering = 'auto';
    appDiv.appendChild(app.canvas);
})();
const game = new BingoGame();
// Layout constants tuned for 526x372 iframe
const ticketWidth = 180;
const ticketHeight = 180;
const margin = 0; // removed spacing between tickets
const gridSize = 4; // 4x4
const cellSize = (ticketWidth - 36) / gridSize; // adjusted padding
const ticketsContainer = new Container();
app.stage.addChild(ticketsContainer);
function renderTickets() {
    ticketsContainer.removeChildren();
    const tickets = game.tickets;
    for (let t = 0; t < tickets.length; t++) {
        const ticket = tickets[t];
        const ticketContainer = new Container();
        ticketContainer.x = t * ticketWidth; // no margin spacing
        ticketContainer.y = 60;
        const frame = new Graphics()
            .roundRect(0, 0, ticketWidth, ticketHeight, 16)
            .fill({ color: 0x12002a })
            .stroke({ width: 3, color: 0xff00e6 });
        ticketContainer.addChild(frame);
        // Title
        const title = new Text({ text: `TICKET ${t + 1}`, style: new TextStyle({ fontFamily: 'Press Start 2P', fontSize: 12, fill: 0xffffff }) });
        title.x = 12;
        title.y = 8;
        ticketContainer.addChild(title);
        // numbers grid
        for (let i = 0; i < ticket.length; i++) {
            const n = ticket[i];
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = 20 + col * cellSize;
            const y = 40 + row * cellSize;
            const numG = new Graphics()
                .roundRect(x, y, cellSize - 4, cellSize - 4, 8)
                .fill({ color: 0x1f0040 })
                .stroke({ width: 2, color: 0x00ffff });
            const isHit = game.calls.includes(n);
            if (isHit) {
                numG.tint = 0x00ffff;
            }
            ticketContainer.addChild(numG);
            const numText = new Text({ text: n.toString(), style: new TextStyle({ fontFamily: 'Press Start 2P', fontSize: 12, fill: isHit ? 0x000000 : 0xffffff }) });
            numText.anchor.set(0.5);
            numText.x = x + (cellSize - 4) / 2;
            numText.y = y + (cellSize - 4) / 2;
            ticketContainer.addChild(numText);
        }
        ticketsContainer.addChild(ticketContainer);
    }
}
function resize() {
    const iframeWidth = window.innerWidth; // actual canvas space inside iframe
    const iframeHeight = window.innerHeight;
    const totalWidth = game.tickets.length * ticketWidth; // no outer margins when margin=0
    const contentHeight = ticketHeight + 140; // tickets plus space for calls grid overlay below
    const scaleX = iframeWidth / totalWidth;
    const scaleY = iframeHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    ticketsContainer.scale.set(scale);
    ticketsContainer.x = (iframeWidth - totalWidth * scale) / 2; // centered without margin
    ticketsContainer.y = 40 * scale;
    positionCallsGrid(scale, iframeWidth, iframeHeight);
}
function positionCallsGrid(scale, iframeWidth, iframeHeight) {
    const callsDiv = document.getElementById('calls');
    if (!callsDiv)
        return;
    // We switch to a smaller cell size via CSS variable maybe later; for now rely on existing CSS.
    // Could adjust font-size dynamically if desired.
}
window.addEventListener('resize', resize);
renderTickets();
resize();
// Buttons
const regenBtn = document.getElementById('regen');
const buyInBtn = document.getElementById('buyin');
regenBtn.addEventListener('click', () => {
    game.regenerateTickets();
    renderTickets();
});
buyInBtn.addEventListener('click', () => {
    game.buyInOrNewGame();
    updateCallsGrid();
    renderTickets();
    buyInBtn.textContent = game.phase === 'idle' ? 'Buy In' : 'New Game';
});
const callsDiv = document.getElementById('calls');
function updateCallsGrid() {
    callsDiv.innerHTML = '';
    for (const n of game.calls) {
        const cell = document.createElement('div');
        cell.className = 'call-cell';
        cell.textContent = n.toString();
        callsDiv.appendChild(cell);
    }
}
updateCallsGrid();
//# sourceMappingURL=main.js.map