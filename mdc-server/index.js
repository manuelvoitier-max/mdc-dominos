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

// --- VARIABLES GLOBALES ---
let players = [];
let board = [];
let ends = null;
let turnIndex = 0;
let gameStarted = false;
let lastWinnerId = null;
let passCount = 0;

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

const donnerLaMain = () => {
    const currentPlayer = players[turnIndex];
    if (currentPlayer) {
        console.log(`👉 C'est au tour de ${currentPlayer.name} (Index ${turnIndex})`);
        io.emit('your_turn', { playerIndex: turnIndex });
    }
};

const appliquerCoup = (tile, side, playerId) => {
    if (board.find(d => d.id === tile.id)) return;
    
    passCount = 0; // Reset boudé

    let orientation = (tile.v1 === tile.v2) ? 'vertical' : 'horizontal';
    let placed = { ...tile, orientation, placedAt: Date.now(), sourcePlayerId: playerId };

    // Logique de placement (inchangée car elle fonctionnait)
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
    
    if (players[playerId]) {
        players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    }
    
    io.emit('board_update', { board, ends, turnIndex, lastMoveBy: playerId });

    // Victoire et Relance
    if (players[playerId] && players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE : ${players[playerId].name}`);
        lastWinnerId = playerId;
        
        const allHands = players.map(p => ({ serverIndex: players.indexOf(p), hand: p.hand }));

        // Délai pour voir le coup gagnant
        setTimeout(() => {
            io.emit('round_won', { winnerId: playerId, winningTile: tile, allHands: allHands });
            
            // RELANCE AUTOMATIQUE POUR LA 2EME PARTIE (Correction sécurisée)
            console.log("⏳ Relance dans 10s...");
            setTimeout(() => { lancerManche(); }, 10000);
        }, 500);

    } else {
        turnIndex = (turnIndex + 2) % 3;
        donnerLaMain();
    }
};

const lancerManche = () => {
    console.log("🎲 DISTRIBUTION...");
    
    // RESET TOTAL DU PLATEAU (C'est ça qui bloquait la 2ème partie)
    board = [];
    ends = null;
    passCount = 0;

    const deck = generateDominoes();
    players[0].hand = deck.slice(0, 7);
    players[1].hand = deck.slice(7, 14);
    players[2].hand = deck.slice(14, 21);

    const playersPublicInfo = players.map(p => ({ id: p.id, name: p.name, handSize: 7 }));

    let starterIndex = -1;
    let startTile = null;
    let autoPlay = false;

    if (lastWinnerId !== null && players[lastWinnerId]) {
        starterIndex = lastWinnerId;
        autoPlay = false;
        console.log("👑 Le gagnant commence.");
    } else {
        // Logique du Double 6 (Cochon)
        let maxVal = -1;
        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                let val = (tile.v1 === tile.v2) ? (tile.v1 + 100) : (tile.v1 + tile.v2);
                if (val > maxVal) { maxVal = val; starterIndex = index; startTile = tile; }
            });
        });
        autoPlay = true;
        console.log("🐷 Cochon détecté.");
    }

    // IMPORTANT : On fixe le tour AVANT d'envoyer quoi que ce soit
    turnIndex = starterIndex;

    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: starterIndex, 
            myIndex: index,
            players: playersPublicInfo 
        });
    });

    if (autoPlay && startTile) {
        setTimeout(() => { appliquerCoup(startTile, 'start', starterIndex); }, 1500);
    } else {
        setTimeout(donnerLaMain, 1000); 
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté: ${socket.id}`);

    socket.on('request_lobby_info', () => {
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        socket.emit('update_players', publicList);
    });

    socket.on('join_game', (pseudo) => {
        const existingPlayer = players.find(p => p.name === pseudo);
        if (existingPlayer) {
            existingPlayer.id = socket.id;
        } else if (players.length < 3) {
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
        } else {
            socket.emit('game_full');
            return;
        }
        
        io.emit('update_players', players.map(p => ({ name: p.name, id: p.id })));

        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ START !");
            setTimeout(lancerManche, 2000);
        }
    });

    socket.on('play_move', (data) => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });

    // Gestion Boudé + Victoire aux points
    socket.on('player_pass', () => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            console.log(`🛑 ${players[turnIndex].name} boude.`);
            passCount++;
            io.emit('player_passed', { playerIndex: turnIndex });

            if (passCount >= 3) {
                // Calcul victoire aux points
                const scores = players.map((p, idx) => ({ index: idx, points: p.hand.reduce((a,b)=>a+b.v1+b.v2,0) }));
                const min = Math.min(...scores.map(s => s.points));
                const winners = scores.filter(s => s.points === min);

                if (winners.length === 1) {
                    lastWinnerId = winners[0].index;
                    const allHands = players.map(p => ({ serverIndex: players.indexOf(p), hand: p.hand }));
                    const lastTile = board[board.length-1] || {v1:0,v2:0};
                    
                    io.emit('round_won', { winnerId: lastWinnerId, winningTile: lastTile, allHands });
                    setTimeout(lancerManche, 10000);
                } else {
                    io.emit('round_draw', {}); // Vraie égalité
                    setTimeout(lancerManche, 10000); // On relance quand même
                }
                passCount = 0;
            } else {
                turnIndex = (turnIndex + 2) % 3;
                donnerLaMain();
            }
        }
    });

    socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log(`⚡ SERVEUR RESTAURÉ ET PRÊT`); });