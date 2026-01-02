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
    
    let orientation = (tile.v1 === tile.v2) ? 'vertical' : 'horizontal';
    let placed = { ...tile, orientation, placedAt: Date.now(), sourcePlayerId: playerId };

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

    if (players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE de ${players[playerId].name}`);
        lastWinnerId = playerId;
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
        starterIndex = lastWinnerId;
        autoPlay = false;
        board = [];
        ends = null;
    } else {
        // Premier tour : Gros Cochon
        let maxVal = -1;
        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                let val = (tile.v1 === tile.v2) ? (tile.v1 + 100) : (tile.v1 + tile.v2);
                if (val > maxVal) { maxVal = val; starterIndex = index; startTile = tile; }
            });
        });
        autoPlay = true;
    }

    if (autoPlay && startTile) {
        let orientation = (startTile.v1 === startTile.v2) ? 'vertical' : 'horizontal';
        board = [{ ...startTile, orientation, placedAt: Date.now(), sourcePlayerId: starterIndex }];
        ends = { left: startTile.v1, right: startTile.v2 };
        players[starterIndex].hand = players[starterIndex].hand.filter(t => t.id !== startTile.id);
        turnIndex = (starterIndex + 2) % 3;
    } else {
        board = [];
        ends = null;
        turnIndex = starterIndex;
    }

    // ENVOI SÉCURISÉ
    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: turnIndex, 
            myIndex: index,
            players: players // On envoie la liste complète
        });
    });

    if (autoPlay) {
        setTimeout(() => { io.emit('board_update', { board, ends, turnIndex }); }, 500);
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté: ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        // Nettoyage des doublons (Même ID socket)
        const existingIdx = players.findIndex(p => p.id === socket.id);
        if (existingIdx !== -1) {
             // Si le joueur est déjà là, on met juste à jour son pseudo
             players[existingIdx].name = pseudo;
        } else if (players.length < 3) {
            // Sinon on l'ajoute
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} rejoint (${players.length}/3)`);
        } else {
            // Si c'est plein
            socket.emit('game_full');
            return;
        }
        
        // IMPORTANT : On prévient TOUT LE MONDE qu'il y a un changement
        io.emit('update_players', players);

        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ START !");
            setTimeout(lancerManche, 1000);
        }
    });

    // NOUVEAU : Permet au client de demander qui est là sans rejoindre
    socket.on('request_lobby_info', () => {
        socket.emit('update_players', players);
    });

    socket.on('disconnect', () => {
         console.log(`❌ Départ : ${socket.id}`);
         // Reset si plus personne
         if (io.engine.clientsCount === 0) {
             console.log("🧹 Reset Serveur");
             players = [];
             gameStarted = false;
             lastWinnerId = null;
             board = [];
         } else if (!gameStarted) {
             // Si la partie n'a pas commencé, on enlève le joueur de la liste
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
    console.log(`⚡ SERVEUR V5 (LOBBY FIX) PRÊT`);
});