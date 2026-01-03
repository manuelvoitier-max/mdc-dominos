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
    
    // Mise à jour de la main du joueur sur le serveur
    if (players[playerId]) {
        players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    }
    
    io.emit('board_update', { board, ends, turnIndex: (turnIndex + 2) % 3 });

    if (players[playerId] && players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE de ${players[playerId].name}`);
        lastWinnerId = playerId;
    } else {
        passerAuTourSuivant();
    }
};

const lancerManche = () => {
    console.log("🎲 DISTRIBUTION...");
    const deck = generateDominoes();
    
    // 1. On remplit les mains
    players[0].hand = deck.slice(0, 7);
    players[1].hand = deck.slice(7, 14);
    players[2].hand = deck.slice(14, 21);

    // 2. On prépare la liste des joueurs (juste noms et ID) pour l'envoyer à tout le monde
    const playersPublicInfo = players.map(p => ({
        id: p.id,
        name: p.name,
        handSize: 7 // Au début tout le monde a 7
    }));

    let starterIndex = -1;
    let startTile = null;
    let autoPlay = false;

    // Logique de démarrage (Cochon ou Gagnant)
    if (lastWinnerId !== null && players[lastWinnerId]) {
        starterIndex = lastWinnerId;
        autoPlay = false;
        board = [];
        ends = null;
    } else {
        let maxVal = -1;
        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                let val = (tile.v1 === tile.v2) ? (tile.v1 + 100) : (tile.v1 + tile.v2);
                if (val > maxVal) { maxVal = val; starterIndex = index; startTile = tile; }
            });
        });
        autoPlay = true;
    }

    // 3. IMPORTANT : On envoie les mains AVANT de jouer le premier coup !
    // Comme ça les joueurs ont leurs dominos quand le plateau bouge.
    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: starterIndex, // On dit qui commence (sera mis à jour si autoplay)
            myIndex: index,
            players: playersPublicInfo // ON ENVOIE BIEN LES NOMS ICI
        });
    });

    // 4. Si c'est un démarrage automatique (Cochon), on attend 1 seconde que les clients soient prêts
    // Puis on joue le coup.
    if (autoPlay && startTile) {
        console.log(`🐷 COCHON AUTO : ${players[starterIndex].name} joue le [${startTile.v1}|${startTile.v2}]`);
        
        setTimeout(() => {
            // On joue le coup sur le serveur
            appliquerCoup(startTile, 'start', starterIndex);
        }, 1500); // Délai pour laisser l'animation de distribution se faire
    } else {
        // Si ce n'est pas auto (gagnant précédent), on initialise juste le tour
        board = [];
        ends = null;
        turnIndex = starterIndex;
        // On ne fait rien, on attend que le joueur joue.
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté: ${socket.id}`);

    // Demande d'infos du Lobby (Nouveau code Client)
    socket.on('request_lobby_info', () => {
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        socket.emit('update_players', publicList);
    });

    socket.on('join_game', (pseudo) => {
        // Si le joueur est déjà là (reconnexion rapide), on met à jour le socket
        const existingPlayer = players.find(p => p.name === pseudo);
        if (existingPlayer) {
            existingPlayer.id = socket.id; // Mise à jour ID
            console.log(`🔄 ${pseudo} reconnecté.`);
        } else if (players.length < 3) {
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} rejoint (${players.length}/3)`);
        }
        
        // On diffuse la liste mise à jour au Lobby
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        io.emit('update_players', publicList);

        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ 3 JOUEURS - START dans 2s...");
            setTimeout(lancerManche, 2000);
        }
    });

    socket.on('play_move', (data) => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });

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
    console.log(`⚡ SERVEUR V6 (FIX DISTRIBUTION + NOMS) PRÊT`);
});