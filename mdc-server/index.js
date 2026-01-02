const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// --- VARIABLES ---
let players = [];
let board = [];
let ends = null;
let turnIndex = 0;
let gameStarted = false; // Nouvelle variable pour savoir si on joue déjà

// --- FONCTIONS ---
const generateDominoes = () => {
    const dominoes = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) { 
            dominoes.push({ id: `${i}-${j}`, v1: i, v2: j }); 
        }
    }
    return dominoes.sort(() => Math.random() - 0.5);
};

const getValidMoves = (hand, ends) => {
    if (!ends) return hand.map(d => ({ tile: d, side: 'start' }));
    const moves = [];
    hand.forEach(d => {
        if (d.v1 === ends.left || d.v2 === ends.left) moves.push({ tile: d, side: 'left' });
        if (d.v1 === ends.right || d.v2 === ends.right) moves.push({ tile: d, side: 'right' });
    });
    return moves;
};

const passerAuTourSuivant = () => {
    turnIndex = (turnIndex + 2) % 3; 
    const currentPlayer = players[turnIndex];

    console.log(`👉 Tour de ${currentPlayer.name} (${currentPlayer.type})`);

    if (currentPlayer.type === 'bot') {
        setTimeout(() => jouerBot(turnIndex), 1500);
    } else {
        io.emit('your_turn', { playerIndex: turnIndex });
    }
};

const jouerBot = (botId) => {
    const botHand = players[botId].hand;
    const moves = getValidMoves(botHand, ends);

    if (moves.length > 0) {
        const move = moves[0];
        console.log(`🤖 Bot joue [${move.tile.v1}|${move.tile.v2}]`);
        appliquerCoup(move.tile, move.side, botId);
    } else {
        console.log(`🛑 Bot BOUDE`);
        io.emit('player_boude', { playerId: botId });
        passerAuTourSuivant();
    }
};

const appliquerCoup = (tile, side, playerId) => {
    const isAlreadyPlayed = board.find(d => d.id === tile.id);
    if (isAlreadyPlayed) return;

    let placed = { ...tile, placedAt: Date.now(), sourcePlayerId: playerId };

    if (board.length === 0) {
        board = [placed];
        ends = { left: tile.v1, right: tile.v2 };
    } else {
        if (side === 'left') {
            if (placed.v2 !== ends.left) { let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; }
            ends.left = placed.v1;
            board.unshift(placed);
        } else {
            if (placed.v1 !== ends.right) { let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; }
            ends.right = placed.v2;
            board.push(placed);
        }
    }

    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);

    io.emit('board_update', { board, ends, turnIndex: (turnIndex + 2) % 3 });
    passerAuTourSuivant();
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        // Si la partie est déjà lancée, on refuse les nouveaux (sauf reconnexion future)
        if (gameStarted) return;

        // On vérifie si le joueur est déjà là pour éviter les doublons
        const existingPlayer = players.find(p => p.id === socket.id);
        if (!existingPlayer) {
             // On ajoute le joueur
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`➕ ${pseudo} a rejoint. Total: ${players.length}/2 Humains requis.`);
        }

        io.emit('update_players', players);

        // --- DÉMARRAGE ---
        const humains = players.filter(p => p.type === 'human');
        
        if (humains.length === 2 && !gameStarted) {
            console.log("✅ 2 JOUEURS PRÊTS ! LANCEMENT DANS 2 SECONDES...");
            gameStarted = true; // On verrouille le démarrage

            // Ajout du Bot
            players.push({ id: 'bot_olivier', name: 'Olivier (Bot)', type: 'bot', hand: [] });

            setTimeout(() => {
                const deck = generateDominoes();
                players[0].hand = deck.slice(0, 7);
                players[1].hand = deck.slice(7, 14);
                players[2].hand = deck.slice(14, 21);

                players.forEach((p, index) => {
                    if (p.type === 'human') {
                        io.to(p.id).emit('game_start', { 
                            hand: p.hand, 
                            turnIndex: 0,
                            myIndex: index
                        });
                    }
                });
                console.log("🎮 PARTIE EN COURS !");
            }, 2000);
        }
    });

    socket.on('play_move', (data) => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });
    
    // GESTION DOUCE DE LA DÉCONNEXION
    socket.on('disconnect', () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        
        // Si la partie n'a PAS commencé, on retire le joueur pour laisser la place
        if (!gameStarted) {
            players = players.filter(p => p.id !== socket.id);
            console.log(`➖ Un joueur est parti. Reste : ${players.length}`);
            io.emit('update_players', players);
        } else {
            // Si la partie a commencé, on ne touche à rien (pour l'instant), 
            // sinon ça plante tout le monde. On verra la reconnexion plus tard.
            console.log("⚠️ Un joueur s'est déconnecté en pleine partie !");
        }
    });
});

server.listen(3001, () => {
    console.log('⚡ SERVEUR ROBUSTE PRÊT (Port 3001)');
});