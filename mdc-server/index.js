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

// --- TOUR ---
const passerAuTourSuivant = () => {
    turnIndex = (turnIndex + 2) % 3; // Sens Anti-Horaire (0 -> 2 -> 1 -> 0)
    console.log(`👉 Au tour du joueur ${turnIndex}`);

    const currentPlayer = players[turnIndex];

    if (currentPlayer.type === 'bot') {
        // Si c'est le Bot (Joueur 2), il joue auto
        setTimeout(() => jouerBot(turnIndex), 1500);
    } else {
        // Si c'est un Humain (Toi ou Ton Ami), on prévient TOUT LE MONDE
        // Mais seul le client concerné débloquera ses dominos
        console.log(`⏳ Attente de ${currentPlayer.name} (${currentPlayer.id})...`);
        io.emit('your_turn', { playerIndex: turnIndex });
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

    io.emit('board_update', { 
        board, ends, turnIndex: (turnIndex + 2) % 3 
    });

    passerAuTourSuivant();
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        // Si la partie est déjà pleine (3 joueurs dont le bot), on refuse
        if (players.length >= 3) return;

        console.log(`👤 ${pseudo} rejoint la table.`);
        
        // On ajoute le joueur réel
        players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
        
        // On prévient tout le monde de qui est là
        io.emit('update_players', players);

        // --- CONDITIONS DE DÉMARRAGE ---
        // Si on a 2 Humains, on ajoute 1 Bot et on lance !
        if (players.filter(p => p.type === 'human').length === 2) {
            
            console.log("✅ 2 Joueurs présents ! Ajout du Bot et Lancement...");
            
            // Ajout du Bot (Joueur 2)
            players.push({ id: 'bot_olivier', name: 'Olivier (Bot)', type: 'bot', hand: [] });

            // Lancement
            setTimeout(() => {
                const deck = generateDominoes();
                players[0].hand = deck.slice(0, 7);
                players[1].hand = deck.slice(7, 14);
                players[2].hand = deck.slice(14, 21); // Main du Bot

                // On envoie à CHAQUE joueur sa propre main
                players.forEach((p, index) => {
                    if (p.type === 'human') {
                        io.to(p.id).emit('game_start', { 
                            hand: p.hand, 
                            turnIndex: 0,
                            myIndex: index // On dit au joueur "Tu es le numéro X"
                        });
                    }
                });
                
                console.log("🎮 Partie démarrée !");
            }, 1000);
        }
    });

    socket.on('play_move', (data) => {
        // On vérifie que c'est bien au joueur qui a cliqué de jouer
        if (players[turnIndex].id === socket.id) {
            console.log(`👤 ${players[turnIndex].name} joue [${data.tile.v1}|${data.tile.v2}]`);
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });
    
    // Gérer la déconnexion pour éviter de bloquer le serveur
    socket.on('disconnect', () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        // Pour faire simple : si quelqu'un part, on reset tout
        if (players.find(p => p.id === socket.id)) {
            players = []; board = []; ends = null; turnIndex = 0;
            console.log("🔄 Reset du serveur (un joueur est parti).");
        }
    });
});

server.listen(3001, () => {
    console.log('⚡ SALON MULTIJOUEUR (2 HUMAINS + 1 BOT) PRÊT');
});