import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BingoGame } from './BingoGame';

const app = new Application();
const appDiv = document.getElementById('app')!;

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
const ticketWidth = 160;
const ticketHeight = 160;
const margin = 8; // spacing between tickets in grid
const gridSize = 4; // 4x4
// Remove internal padding: make grid fill ticket area (minus tiny gap between cells)
const cellGap = 2;
const cellSize = (ticketWidth - cellGap * (gridSize + 1)) / gridSize;

const ticketsContainer = new Container();
app.stage.addChild(ticketsContainer);

// Track disabled tickets
const disabledTickets = new Set<number>();
// Incremental call reveal
let revealTimer: number | null = null;
let revealedCalls: number[] = [];

function toggleTicketDisabled(index: number) {
  if (disabledTickets.has(index)) {
    disabledTickets.delete(index);
  } else {
    disabledTickets.add(index);
  }
  renderTickets();
}

function renderTickets() {
  ticketsContainer.removeChildren();
  const tickets = game.tickets;
  for (let t = 0; t < tickets.length; t++) {
    const ticket = tickets[t];
    const ticketContainer = new Container();
  const col = t % 2;
  const row = Math.floor(t / 2);
  ticketContainer.x = col * (ticketWidth + margin);
    ticketContainer.y = 32 + row * (ticketHeight + margin); // nudged upward slightly

    // Frame removed per request (hide pink box)

    // Title
    // Title removed to eliminate vertical padding

    // numbers grid
    for (let i = 0; i < ticket.length; i++) {
      const n = ticket[i];
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
  // New compact grid coordinates (tight to top-left with gap)
  const x = cellGap + col * (cellSize + cellGap);
  const y = cellGap + row * (cellSize + cellGap);

      const numG = new Graphics()
        .roundRect(x, y, cellSize, cellSize, 6)
        .fill({ color: 0x1f0040 })
        .stroke({ width: 1, color: 0x00ffff });

  const isHit = revealedCalls.includes(n) && !disabledTickets.has(t);
      if (isHit) {
        numG.tint = 0x00ffff;
      }

      ticketContainer.addChild(numG);
      const numText = new Text({ text: n.toString(), style: new TextStyle({ fontFamily: 'Press Start 2P', fontSize: 16, fill: isHit ? 0x000000 : 0xffffff, dropShadow: false }) });
      numText.anchor.set(0.5);
  numText.x = x + cellSize / 2; numText.y = y + cellSize / 2;
      ticketContainer.addChild(numText);
    }

    // Disable/Enable control button
    const control = new Graphics();
    const controlSize = 18;
    const isDisabled = disabledTickets.has(t);
    control.roundRect(0, 0, controlSize, controlSize, 4)
      .fill({ color: isDisabled ? 0x333333 : 0x550055 })
      .stroke({ width: 1, color: 0xffffff });
    const ctrlText = new Text({ text: isDisabled ? '+' : 'X', style: new TextStyle({ fontFamily: 'Press Start 2P', fontSize: 12, fill: 0xffffff }) });
    ctrlText.anchor.set(0.5);
    ctrlText.x = controlSize / 2;
    ctrlText.y = controlSize / 2 + 1;
    control.addChild(ctrlText);
    control.eventMode = 'static';
    control.cursor = 'pointer';
    control.on('pointertap', () => toggleTicketDisabled(t));

    if (t % 2 === 0) { // left column -> place control on left outside
      control.x = -controlSize - 4;
    } else { // right column -> place control on right
      control.x = ticketWidth + 4;
    }
    control.y = 4;
    ticketContainer.addChild(control);

    // Overlay when disabled
    if (isDisabled) {
      const overlay = new Graphics()
        .roundRect(0, 0, ticketWidth, ticketHeight, 6)
        .fill({ color: 0x000000, alpha: 1 });
      const overlayText = new Text({ text: 'NOT IN\nPLAY!', style: new TextStyle({ fontFamily: 'Press Start 2P', fontSize: 18, fill: 0xff00e6, align: 'center' }) });
      overlayText.anchor.set(0.5);
      overlayText.x = ticketWidth / 2;
      overlayText.y = ticketHeight / 2;
      ticketContainer.addChild(overlay);
      ticketContainer.addChild(overlayText);
    }

    ticketsContainer.addChild(ticketContainer);
  }
}

function resize() {
  const iframeWidth = window.innerWidth; // actual canvas space inside iframe
  const iframeHeight = window.innerHeight;
  const columns = 2;
  const rows = 2;
  const totalWidth = columns * ticketWidth + (columns - 1) * margin;
  const topOffset = 44;
  const contentHeight = rows * ticketHeight + (rows - 1) * margin + topOffset;
  const scaleX = iframeWidth / totalWidth;
  const scaleY = iframeHeight / contentHeight;
  const scale = Math.min(scaleX, scaleY, 1);
  ticketsContainer.scale.set(scale);
  // Align left; app canvas right side reserved for calls panel (~76px ultra narrow)
  const callsPanelReserve = 76;
  const usableWidth = iframeWidth - callsPanelReserve;
  ticketsContainer.x = 10 * scale + (usableWidth - totalWidth * scale) / 2 - 10; // shifted left by 10px
  ticketsContainer.y = 10 * scale;
  positionCallsGrid(scale, iframeWidth, iframeHeight);
}

function positionCallsGrid(_scale: number, _iframeWidth: number, _iframeHeight: number) {
  // No-op: calls are now handled by CSS in vertical panel
}
window.addEventListener('resize', resize);

renderTickets();
resize();

// Buttons
const regenBtn = document.getElementById('regen') as HTMLButtonElement;
const buyInBtn = document.getElementById('buyin') as HTMLButtonElement;

regenBtn.addEventListener('click', () => {
  game.regenerateTickets();
  renderTickets();
});

buyInBtn.addEventListener('click', () => {
  const wasShowing = game.phase === 'showing-calls';
  game.buyInOrNewGame();
  if (game.phase === 'showing-calls') {
    // Start reveal sequence
    if (revealTimer) { clearInterval(revealTimer); revealTimer = null; }
    revealedCalls = [];
    updateCallsGrid();
    const calls = [...game.calls];
    let i = 0;
  const counterEl = document.getElementById('callsHeader');
    function updateCounter() {
      if (counterEl) counterEl.textContent = `CALLS ${revealedCalls.length}/${calls.length}`;
    }
    updateCounter();
    revealTimer = window.setInterval(() => {
      revealedCalls.push(calls[i]);
      updateCallsGrid();
      renderTickets();
      i++;
      updateCounter();
      if (i >= calls.length) {
        if (revealTimer) { clearInterval(revealTimer); revealTimer = null; }
      }
    }, 50);
  } else {
    // Returning to idle; clear reveal state
    if (revealTimer) { clearInterval(revealTimer); revealTimer = null; }
    revealedCalls = [];
    updateCallsGrid();
  const counterEl = document.getElementById('callsHeader');
  if (counterEl) counterEl.textContent = 'CALLS 0/40';
  }
  renderTickets();
  buyInBtn.textContent = game.phase === 'idle' ? 'Buy In' : 'New Game';
});

const callsDiv = document.getElementById('calls')!;

function updateCallsGrid() {
  callsDiv.innerHTML = '';
  for (const n of revealedCalls) {
    const cell = document.createElement('div');
    cell.className = 'call-cell';
    cell.textContent = n.toString();
    callsDiv.appendChild(cell);
  }
}

updateCallsGrid();
