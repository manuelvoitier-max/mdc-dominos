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

// --- FONCTIONS CERVEAU ---
const generateDominoes = () => {
    const dominoes = [];
    let id = 0;
    // On génère les 28 dominos uniques
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) { 
            // On crée un ID unique "v1-v2" pour éviter les confusions
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

// --- GESTION DES TOURS (SENS ANTI-HORAIRE : 0 -> 2 -> 1 -> 0) ---
const passerAuTourSuivant = () => {
    // Formule magique pour aller dans l'autre sens (Reculer de 1)
    turnIndex = (turnIndex + 2) % 3;
    
    console.log(`👉 C'est au tour du joueur ${turnIndex} (SENS ANTI-HORAIRE)`);

    // Si c'est un BOT (Joueur 1 ou 2)
    if (turnIndex !== 0) {
        setTimeout(() => jouerBot(turnIndex), 2000); // 2 secondes de réflexion pour bien voir
    } else {
        console.log("⏳ Attente du joueur humain...");
        io.emit('your_turn'); // On prévient le client que c'est à lui
    }
};

const jouerBot = (botId) => {
    const botHand = players[botId].hand;
    const moves = getValidMoves(botHand, ends);

    if (moves.length > 0) {
        const move = moves[0];
        console.log(`🤖 Bot ${botId} joue [${move.tile.v1}|${move.tile.v2}]`);
        appliquerCoup(move.tile, move.side, botId);
    } else {
        console.log(`🛑 Bot ${botId} BOUDE !`);
        // On envoie l'info "Boudé" (tu peux ajouter un son côté client plus tard)
        io.emit('player_boude', { playerId: botId });
        passerAuTourSuivant();
    }
};

const appliquerCoup = (tile, side, playerId) => {
    // SECURITÉ ANTI-DOUBLON : Est-ce que ce domino est déjà sur la table ?
    const isAlreadyPlayed = board.find(d => d.v1 === tile.v1 && d.v2 === tile.v2);
    if (isAlreadyPlayed) {
        console.log("⚠️ ALERTE : Tentative de jouer un domino déjà posé ! Annulation.");
        return; 
    }

    // 1. Mise à jour du plateau
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

    // 2. Enlever le domino de la main (Serveur)
    // On utilise l'ID unique string qu'on a créé au début
    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);

    // 3. Envoyer la mise à jour
    io.emit('board_update', { 
        board, 
        ends, 
        turnIndex: (turnIndex + 2) % 3 // On envoie déjà l'index du SUIVANT pour l'affichage
    });

    // 4. Suite
    passerAuTourSuivant();
};

// --- CONNEXION ---
io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        players = []; board = []; ends = null; turnIndex = 0;

        // Joueur 0 (Toi)
        players.push({ id: socket.id, name: pseudo, hand: [] });
        // Joueur 1 (Bot Gauche - Sera le dernier à jouer)
        players.push({ id: 'bot1', name: 'Chaton', hand: [] });
        // Joueur 2 (Bot Droite - Sera le premier à jouer après toi)
        players.push({ id: 'bot2', name: 'Olivier', hand: [] });

        socket.emit('update_players', players);

        setTimeout(() => {
            const deck = generateDominoes();
            players[0].hand = deck.slice(0, 7);
            players[1].hand = deck.slice(7, 14);
            players[2].hand = deck.slice(14, 21);

            console.log("🎮 Partie lancée !");
            
            // On envoie la main au joueur
            io.emit('game_start', { 
                hand: players[0].hand, 
                turnIndex: 0 
            });
        }, 500);
    });

    socket.on('play_move', (data) => {
        // Sécurité : Est-ce vraiment ton tour ?
        if (turnIndex !== 0) {
            console.log("⛔ Ce n'est pas ton tour !");
            return;
        }
        console.log(`👤 Joueur Humain joue [${data.tile.v1}|${data.tile.v2}]`);
        appliquerCoup(data.tile, data.side, 0);
    });
});

server.listen(3001, () => {
    console.log('⚡ MAÎTRE DU JEU (SENS INVERSE) PRÊT SUR LE PORT 3001');
});