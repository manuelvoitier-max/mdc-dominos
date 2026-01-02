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

// --- VARIABLES GLOBALES DU JEU ---
let players = [];
let board = [];
let ends = null;
let turnIndex = 0;

// --- FONCTIONS UTILITAIRES (CERVEAU) ---
const generateDominoes = () => {
    const dominoes = [];
    let id = 0;
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) { dominoes.push({ id: id++, v1: i, v2: j }); }
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

// --- GESTION DES TOURS ---
const passerAuTourSuivant = () => {
    // On passe au joueur suivant (0 -> 1 -> 2 -> 0)
    turnIndex = (turnIndex + 1) % 3;
    console.log(`👉 C'est au tour du joueur ${turnIndex}`);

    // Si c'est un BOT (Joueur 1 ou 2), le serveur joue pour lui
    if (turnIndex !== 0) {
        setTimeout(() => jouerBot(turnIndex), 1500); // Délai de réflexion 1.5s
    } else {
        // C'est au joueur HUMAIN (Toi), on attend ton clic
        console.log("⏳ Attente du joueur humain...");
    }
};

const jouerBot = (botId) => {
    const botHand = players[botId].hand;
    const moves = getValidMoves(botHand, ends);

    if (moves.length > 0) {
        // Le bot joue le premier coup valide (IA Simple)
        const move = moves[0];
        console.log(`🤖 Bot ${botId} joue [${move.tile.v1}|${move.tile.v2}]`);
        
        // On applique le coup
        appliquerCoup(move.tile, move.side, botId);
    } else {
        // Le bot est boudé
        console.log(`🛑 Bot ${botId} BOUDE !`);
        io.emit('player_boude', { playerId: botId });
        passerAuTourSuivant();
    }
};

const appliquerCoup = (tile, side, playerId) => {
    // 1. Mise à jour du plateau (Logique serveur)
    let placed = { ...tile, placedAt: Date.now(), sourcePlayerId: playerId };
    
    if (board.length === 0) {
        board = [placed];
        ends = { left: tile.v1, right: tile.v2 };
    } else {
        if (side === 'left') {
            if (placed.v1 !== ends.left) { let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; }
            ends.left = placed.v1;
            board.unshift(placed);
        } else {
            if (placed.v1 !== ends.right) { let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; }
            ends.right = placed.v2;
            board.push(placed);
        }
    }

    // 2. Enlever le domino de la main du joueur (Serveur)
    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);

    // 3. Envoyer la mise à jour à tout le monde
    io.emit('board_update', { 
        board, 
        ends, 
        turnIndex: (turnIndex + 1) % 3 // On envoie déjà qui sera le prochain pour l'affichage
    });

    // 4. Continuer la partie
    passerAuTourSuivant();
};


// --- CONNEXION SOCKET ---
io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        // RESET COMPLET pour le test
        players = []; board = []; ends = null; turnIndex = 0;

        // Joueur 0 (Toi)
        players.push({ id: socket.id, name: pseudo, hand: [] });
        // Joueur 1 (Bot)
        players.push({ id: 'bot1', name: 'Chaton', hand: [] });
        // Joueur 2 (Bot)
        players.push({ id: 'bot2', name: 'Olivier', hand: [] });

        socket.emit('update_players', players);

        setTimeout(() => {
            const deck = generateDominoes();
            // Distribution
            players[0].hand = deck.slice(0, 7);
            players[1].hand = deck.slice(7, 14);
            players[2].hand = deck.slice(14, 21);

            // Envoi au client (on cache les mains adverses)
            io.emit('game_start', { 
                hand: players[0].hand, 
                turnIndex: 0 
            });
        }, 500);
    });

    // QUAND TU CLIQUES SUR UN DOMINO
    socket.on('play_move', (data) => {
        // On vérifie que c'est bien à toi de jouer
        if (turnIndex === 0) {
            console.log(`👤 Joueur Humain joue [${data.tile.v1}|${data.tile.v2}]`);
            appliquerCoup(data.tile, data.side, 0);
        }
    });
});

server.listen(3001, () => {
    console.log('⚡ MAÎTRE DU JEU PRÊT SUR LE PORT 3001');
});