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
let lastWinnerId = null;

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
    if (currentPlayer) {
        console.log(`👉 Tour de ${currentPlayer.name}`);
        io.emit('your_turn', { playerIndex: turnIndex });
    }
};

const appliquerCoup = (tile, side, playerId) => {
    if (board.find(d => d.id === tile.id)) return;
    
    // 1. DÉTERMINER L'ORIENTATION VISUELLE
    // Par défaut, un domino est horizontal. Sauf si c'est un double (Vertical).
    let orientation = (tile.v1 === tile.v2) ? 'vertical' : 'horizontal';

    let placed = { 
        ...tile, 
        orientation: orientation, // <--- C'EST ÇA QUI MANQUAIT !
        placedAt: Date.now(), 
        sourcePlayerId: playerId 
    };

    if (board.length === 0) {
        board = [placed];
        ends = { left: tile.v1, right: tile.v2 };
    } else {
        if (side === 'left') {
            // Si on joue à gauche, le v2 du domino doit toucher le ends.left du plateau
            if (placed.v2 !== ends.left) { 
                // Si ça ne matche pas, on inverse le domino
                let tmp = placed.v1; placed.v1 = placed.v2; placed.v2 = tmp; 
            }
            ends.left = placed.v1; // La nouvelle extrémité gauche est le v1 du domino
            board.unshift(placed);
        } else {
            // Si on joue à droite, le v1 du domino doit toucher le ends.right du plateau
            if (placed.v1 !== ends.right) { 
                let tmp = placed.v1; placed.v1 = placed.v2; placed.v2 = tmp; 
            }
            ends.right = placed.v2; // La nouvelle extrémité droite est le v2 du domino
            board.push(placed);
        }
    }
    
    // Retirer de la main
    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    
    // Mise à jour client
    io.emit('board_update', { board, ends, turnIndex: (turnIndex + 2) % 3 });

    // Victoire ?
    if (players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE de ${players[playerId].name}`);
        lastWinnerId = playerId;
        // On pourrait réinitialiser ici, mais on laisse les joueurs voir le résultat
    } else {
        passerAuTourSuivant();
    }
};

const lancerManche = () => {
    console.log("🎲 DISTRIBUTION...");
    const deck = generateDominoes();
    
    players[0].hand = deck.slice(0, 7);
    players[1].hand = deck.slice(7, 14);
    players[2].hand = deck.slice(14, 21);

    let starterIndex = -1;
    let startTile = null;
    let autoPlay = false;

    if (lastWinnerId !== null && players[lastWinnerId]) {
        // Le gagnant d'avant commence
        starterIndex = lastWinnerId;
        autoPlay = false;
        board = [];
        ends = null;
        console.log(`👑 ${players[starterIndex].name} a la main.`);
    } else {
        // Premier tour : Gros Cochon
        console.log("🐷 Recherche du Cochon...");
        let maxVal = -1;
        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                // Priorité aux doubles
                let val = (tile.v1 === tile.v2) ? (tile.v1 + 100) : (tile.v1 + tile.v2);
                if (val > maxVal) {
                    maxVal = val;
                    starterIndex = index;
                    startTile = tile;
                }
            });
        });
        console.log(`🐷 DÉPART AUTO : ${players[starterIndex].name}`);
        autoPlay = true;
    }

    // SI DÉPART AUTO (COCHON)
    if (autoPlay && startTile) {
        let orientation = (startTile.v1 === startTile.v2) ? 'vertical' : 'horizontal';
        
        board = [{ 
            ...startTile, 
            orientation: orientation, // <--- ICI AUSSI
            placedAt: Date.now(), 
            sourcePlayerId: starterIndex 
        }];
        ends = { left: startTile.v1, right: startTile.v2 };
        players[starterIndex].hand = players[starterIndex].hand.filter(t => t.id !== startTile.id);
        turnIndex = (starterIndex + 2) % 3;
    } else {
        board = [];
        ends = null;
        turnIndex = starterIndex;
    }

    // ENVOI
    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: turnIndex, 
            myIndex: index,
            players: players
        });
    });

    if (autoPlay) {
        setTimeout(() => {
            io.emit('board_update', { board, ends, turnIndex });
        }, 500);
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté: ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        // Si le joueur est déjà là, on ne fait rien
        if (players.find(p => p.id === socket.id)) return;

        if (players.length < 3) {
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} rejoint (${players.length}/3)`);
            io.emit('update_players', players);
        }

        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ 3 JOUEURS - START");
            setTimeout(lancerManche, 1000);
        }
    });

    socket.on('play_move', (data) => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });
    
    // Gestion propre de la déconnexion pour éviter les blocages
    socket.on('disconnect', () => {
         console.log(`❌ Départ : ${socket.id}`);
         if (io.engine.clientsCount === 0) {
             console.log("🧹 Reset Serveur");
             players = [];
             gameStarted = false;
             lastWinnerId = null;
             board = [];
         }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`⚡ SERVEUR CORRIGÉ (ORIENTATION + COCHON)`);
});