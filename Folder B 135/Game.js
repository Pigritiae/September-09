// --- COMENTÁRIO: Renomeando o arquivo para algo mais descritivo e sem espaços. ---
// O nome do arquivo foi corrigido no HTML para refletir a melhor prática.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cellSize = 20;
// --- CORREÇÃO: Assegurando que a largura e altura do labirinto sejam ímpares para um algoritmo de geração de labirinto mais robusto. ---
// Isso evita bordas em alguns lados e garante que todos os caminhos tenham uma célula vizinha para "destruir" a parede.
const mazeWidth = Math.floor(canvas.width / cellSize) % 2 === 0 ? Math.floor(canvas.width / cellSize) - 1 : Math.floor(canvas.width / cellSize);
const mazeHeight = Math.floor(canvas.height / cellSize) % 2 === 0 ? Math.floor(canvas.height / cellSize) - 1 : Math.floor(canvas.height / cellSize);
const viewRadius = 3;

function generateMaze() {
    // --- CORREÇÃO: Corrigindo a inicialização do labirinto para garantir que todas as células sejam consideradas paredes inicialmente. ---
    // A variável 'fill' estava faltando, o que tornava a matriz um array de referências.
    const maze = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill(1));
    const stack = [];
    let current = { x: 1, y: 1 }; // --- CORREÇÃO: Iniciar a geração do labirinto a partir de uma posição ímpar. ---
    // Isso é crucial para o algoritmo de 'Recursive Backtracker' funcionar corretamente, já que ele pula de 2 em 2.
    maze[current.y][current.x] = 0;
    stack.push(current);

    while (stack.length > 0) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -2 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: -2, y: 0 }
        ];

        directions.forEach(dir => {
            const newX = current.x + dir.x;
            const newY = current.y + dir.y;
            // --- CORREÇÃO: A lógica para verificar vizinhos válidos foi simplificada. ---
            // A verificação `maze[midY][midX] === 0` dentro do loop `forEach` não é necessária e estava incorreta. A lógica de quebrar a parede entre as células será feita mais tarde.
            if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && maze[newY][newX] === 1) {
                neighbors.push({ x: newX, y: newY });
            }
        });

        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const midX = current.x + (next.x - current.x) / 2;
            const midY = current.y + (next.y - current.y) / 2;
            maze[next.y][next.x] = 0;
            maze[midY][midX] = 0;
            stack.push(current);
            current = next;
        } else {
            current = stack.pop();
        }
    }
    // --- CORREÇÃO: Ajustando a posição de saída para garantir que seja uma célula de caminho (`0`) e não uma parede. ---
    // A posição da saída deve ser uma célula de caminho. A posição `[mazeHeight - 2][mazeWidth - 1]` pode ser uma parede dependendo da geração.
    // É mais seguro garantir que a saída e a entrada estejam em posições de caminho. A entrada já é `(1, 1)`.
    maze[mazeHeight - 2][mazeWidth - 2] = 0; // Garantindo que a saída seja acessível.
    return maze;
}

let maze = generateMaze();
// --- CORREÇÃO: A posição inicial do jogador foi ajustada para (1, 1), que é uma célula de caminho no labirinto gerado. ---
let player = { x: 1, y: 1 };
// --- CORREÇÃO: A posição da saída foi ajustada para (mazeWidth - 2, mazeHeight - 2), que é uma célula de caminho. ---
let exitPos = { x: mazeWidth - 2, y: mazeHeight - 2 };
let showHint = false;
let hintParticles = [];
let hintStart = 0;
const hintDuration = 2000;
const fadeDuration = 1000;
let gameWon = false;
let showFullMap = false;
let fullMapStart = 0;
const fullMapDuration = 500;

function generateHintParticles() {
    hintParticles = [];
    const qtd = 40;
    for (let i = 0; i < qtd; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * (cellSize * 0.8);
        hintParticles.push({
            x: exitPos.x * cellSize + cellSize / 2 + Math.cos(ang) * dist,
            y: exitPos.y * cellSize + cellSize / 2 + Math.sin(ang) * dist,
            r: Math.random() * 2 + 1,
            a: Math.random() * 0.5 + 0.5
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- CORREÇÃO: Adicionando a renderização do mapa completo quando `showFullMap` é verdadeiro. ---
    // Isso garante que o labirinto seja renderizado para o jogador.
    if (showFullMap) {
        // Renderizar o mapa completo em uma cor opaca
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < mazeHeight; y++) {
            for (let x = 0; x < mazeWidth; x++) {
                if (maze[y][x] === 0) {
                    ctx.fillStyle = '#111';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    } else {
        // --- CORREÇÃO: A lógica de visão limitada foi ajustada para exibir apenas a área visível do jogador. ---
        // Isso melhora a experiência de jogo e o desempenho.
        for (let y = 0; y < mazeHeight; y++) {
            for (let x = 0; x < mazeWidth; x++) {
                const dx = x - player.x;
                const dy = y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= viewRadius) {
                    ctx.fillStyle = maze[y][x] === 1 ? '#333' : '#000';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }
    
    // --- CORREÇÃO: O gradiente de "visão" foi ajustado para cobrir toda a tela, dando a ilusão de neblina e luz. ---
    const gradient = ctx.createRadialGradient(
        player.x * cellSize + cellSize / 2,
        player.y * cellSize + cellSize / 2,
        0,
        player.x * cellSize + cellSize / 2,
        player.y * cellSize + cellSize / 2,
        viewRadius * cellSize
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- CORREÇÃO: A lógica de temporização do mapa completo foi ajustada. ---
    // O temporizador agora inicia quando o botão é clicado e desativa a visualização do mapa após a duração.
    if (showFullMap && (Date.now() - fullMapStart > fullMapDuration)) {
        showFullMap = false;
    }

    // --- CORREÇÃO: Renderizando a posição da saída apenas quando o mapa completo está ativo ou em outros estados específicos. ---
    // Isso evita que a saída seja visível em tempo integral.
    if (showFullMap) {
        ctx.fillStyle = 'lime';
        ctx.fillRect(exitPos.x * cellSize, exitPos.y * cellSize, cellSize, cellSize);
    }
    
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    if (showHint) {
        const elapsed = Date.now() - hintStart;
        if (elapsed < hintDuration + fadeDuration) {
            const alphaFactor = elapsed < hintDuration ? 1 : 1 - (elapsed - hintDuration) / fadeDuration;
            hintParticles.forEach(p => {
                ctx.fillStyle = `rgba(255,255,150, ${p.a * alphaFactor})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
        } else {
            showHint = false;
        }
    }

    if (gameWon) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('You Won!', canvas.width / 2, canvas.height / 2);
    }
}

document.addEventListener('keydown', (event) => {
    let newX = player.x;
    let newY = player.y;

    // --- CORREÇÃO: O tratamento de eventos de teclado foi reescrito para ser mais claro e robusto. ---
    // Isso evita problemas com a lógica de movimento do jogador.
    switch (event.key) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
    }

    if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        // --- CORREÇÃO: A lógica de vitória foi ajustada para ser mais precisa. ---
        if (player.x === exitPos.x && player.y === exitPos.y && !gameWon) {
            gameWon = true;
            // --- CORREÇÃO: A lógica de reinicialização do jogo foi ajustada para ser mais consistente. ---
            setTimeout(() => {
                maze = generateMaze();
                player = { x: 1, y: 1 };
                exitPos = { x: mazeWidth - 2, y: mazeHeight - 2 };
                gameWon = false;
            }, 3000);
        }
    }
});

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

const hintBtn = document.getElementById('hintButton');
hintBtn.addEventListener('click', () => {
    // --- CORREÇÃO: Adicionando uma verificação para evitar que a dica seja ativada se o jogo já foi vencido. ---
    if (!gameWon) {
        showHint = true;
        hintStart = Date.now();
        generateHintParticles();
    }
});

const revealBtn = document.getElementById('revealButton');
revealBtn.addEventListener('click', () => {
    // --- CORREÇÃO: Adicionando uma verificação para evitar que o mapa seja ativado se o jogo já foi vencido. ---
    if (!gameWon) {
        showFullMap = true;
        fullMapStart = Date.now();
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // --- CORREÇÃO: Recalculando as dimensões do labirinto após o redimensionamento. ---
    const newMazeWidth = Math.floor(canvas.width / cellSize) % 2 === 0 ? Math.floor(canvas.width / cellSize) - 1 : Math.floor(canvas.width / cellSize);
    const newMazeHeight = Math.floor(canvas.height / cellSize) % 2 === 0 ? Math.floor(canvas.height / cellSize) - 1 : Math.floor(canvas.height / cellSize);
    
    // --- CORREÇÃO: Atualizando as variáveis globais de largura e altura do labirinto. ---
    mazeWidth = newMazeWidth;
    mazeHeight = newMazeHeight;
    
    maze = generateMaze();
    player = { x: 1, y: 1 };
    exitPos = { x: mazeWidth - 2, y: mazeHeight - 2 };
    draw();
});
/* Código Corrigido pela IA Gemini */ 