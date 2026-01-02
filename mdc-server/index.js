const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuration : On accepte ton jeu React sur le port 5173 (Vite)
const io = new Server(server, {
    cors: {
        origin: "*", // On ouvre les vannes pour éviter les bugs de connexion
        methods: ["GET", "POST"]
    }
});

// --- LOGIQUE DU JEU (Cerveau) ---
const generateDominoes = () => {
    const dominoes = [];
    let id = 0;
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            dominoes.push({ id: id++, v1: i, v2: j });
        }
    }
    return dominoes.sort(() => Math.random() - 0.5);
};

// --- MÉMOIRE DU JEU ---
let players = [];
let board = [];      // Le plateau commun
let ends = null;     // Les extrémités { left, right }
let turnIndex = 0;   // À qui le tour ?

io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);

    // 1. REJOINDRE
    socket.on('join_game', (pseudo) => {
        // Reset pour le test (on efface tout quand qqn arrive)
        players = []; board = []; ends = null; turnIndex = 0;

        const newPlayer = { id: socket.id, name: pseudo, hand: [] };
        players.push(newPlayer);
        
        socket.emit('update_players', players);

        // Lancement immédiat pour le test
        setTimeout(() => startGame(), 500);
    });

    const startGame = () => {
        const deck = generateDominoes();
        const hand = deck.slice(0, 7); // 7 dominos pour le joueur
        // On envoie la main et le plateau vide
        io.emit('game_start', { hand: hand, turnIndex: 0, board: [] });
    };

    // 2. JOUER UN COUP (Le cœur du jeu)
    socket.on('play_move', (data) => {
        // data = { tile, side, playerId }
        console.log(`Coup reçu : [${data.tile.v1}|${data.tile.v2}] côté ${data.side}`);

        // --- LOGIQUE DE POSE (Simplifiée pour le test) ---
        // On prépare le domino (orientation, etc.)
        let placed = { ...data.tile, placedAt: Date.now(), sourcePlayerId: 0 }; // 0 car tu es le seul vrai joueur
        
        // Mise à jour des extrémités (Server Side Logic)
        if (board.length === 0) {
            board = [placed];
            ends = { left: data.tile.v1, right: data.tile.v2 };
        } else {
            if (data.side === 'left') {
                // On inverse si besoin pour que ça colle
                if (placed.v1 !== ends.left) { let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; } 
                ends.left = placed.v1; // La nouvelle extrémité gauche est le bout libre du domino
                board.unshift(placed); // Ajout au début
            } else {
                if (placed.v1 !== ends.right) { let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; }
                ends.right = placed.v2;
                board.push(placed); // Ajout à la fin
            }
        }

        // On renvoie le NOUVEAU plateau à tout le monde
        io.emit('board_update', { board, ends, turnIndex: 1 }); // On passe le tour au bot (fictif)
    });
});

server.listen(3001, () => {
    console.log('⚡ SERVEUR DOMINO PRÊT SUR LE PORT 3001');
});