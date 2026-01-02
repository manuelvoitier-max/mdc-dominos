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
let gameStarted = false;

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

const passerAuTourSuivant = () => {
    turnIndex = (turnIndex + 2) % 3; 
    const currentPlayer = players[turnIndex];
    if (!currentPlayer) return;

    if (currentPlayer.type === 'bot') {
        setTimeout(() => jouerBot(turnIndex), 1500);
    } else {
        io.emit('your_turn', { playerIndex: turnIndex });
    }
};

const jouerBot = (botId) => {
    // Logique Bot simplifiée pour le test
    io.emit('player_boude', { playerId: botId });
    passerAuTourSuivant();
};

const appliquerCoup = (tile, side, playerId) => {
    if (board.find(d => d.id === tile.id)) return;
    
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
    console.log(`🔌 Nouveau: ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        if (gameStarted) return; // Trop tard

        // Eviter les doublons
        if (!players.find(p => p.id === socket.id)) {
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} a rejoint. Total Humains: ${players.length}`);
        }
        
        io.emit('update_players', players);

        // Si 2 joueurs sont là
        const humains = players.filter(p => p.type === 'human');
        if (humains.length === 2 && !gameStarted) {
            gameStarted = true;
            console.log("✅ 2 JOUEURS ! LANCEMENT...");
            
            // On ajoute LE SEUL ET UNIQUE BOT
            players.push({ id: 'bot_olivier', name: 'Olivier (Bot)', type: 'bot', hand: [] });

            setTimeout(() => {
                const deck = generateDominoes();
                players[0].hand = deck.slice(0, 7);
                players[1].hand = deck.slice(7, 14);
                players[2].hand = deck.slice(14, 21);

                players.forEach((p, index) => {
                    if (p.type === 'human') {
                        io.to(p.id).emit('game_start', { 
                            hand: p.hand, turnIndex: 0, myIndex: index 
                        });
                    }
                });
            }, 1000);
        }
    });

    socket.on('disconnect', () => {
        if (!gameStarted) {
            players = players.filter(p => p.id !== socket.id);
            io.emit('update_players', players);
        }
    });

    socket.on('play_move', (data) => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`⚡ SERVEUR FINAL V3 (SANS CHATON) PRÊT !`);
});