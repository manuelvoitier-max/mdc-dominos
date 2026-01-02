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
    // Sens du jeu : Anti-horaire (Antilles)
    turnIndex = (turnIndex + 2) % 3; 
    
    const currentPlayer = players[turnIndex];
    if (!currentPlayer) return;

    console.log(`👉 C'est au tour de ${currentPlayer.name} (Joueur ${turnIndex})`);

    // On prévient tout le monde de qui doit jouer
    // Le frontend de celui qui doit jouer débloquera ses dominos
    io.emit('your_turn', { playerIndex: turnIndex });
};

const appliquerCoup = (tile, side, playerId) => {
    // Sécurité : Est-ce que ce domino est déjà posé ?
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
    
    // Retirer le domino de la main du joueur
    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    
    // Mise à jour du plateau pour tout le monde
    io.emit('board_update', { board, ends, turnIndex: (turnIndex + 2) % 3 });
    
    passerAuTourSuivant();
};

io.on('connection', (socket) => {
    console.log(`🔌 Nouveau client connecté : ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        if (gameStarted) {
            console.log(`⛔ Refus connexion ${pseudo} : Partie déjà en cours.`);
            return; 
        }

        // On évite les doublons (si le joueur clique deux fois)
        if (!players.find(p => p.id === socket.id)) {
            // On ajoute un HUMAIN
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} a rejoint. Total: ${players.length}/3`);
        }
        
        // On envoie la liste des joueurs en salle d'attente
        io.emit('update_players', players);

        // --- DÉMARRAGE À 3 JOUEURS ---
        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ 3 JOUEURS PRÉSENTS ! DISTRIBUTION...");
            
            // On attend 1 seconde pour que tout le monde voie "3/3 joueurs"
            setTimeout(() => {
                const deck = generateDominoes();
                
                // Distribution aux 3 Humains
                players[0].hand = deck.slice(0, 7);
                players[1].hand = deck.slice(7, 14);
                players[2].hand = deck.slice(14, 21);
                // Le reste (pioche) est ignoré pour l'instant

                // Envoi des mains à chaque joueur personnellement
                players.forEach((p, index) => {
                    io.to(p.id).emit('game_start', { 
                        hand: p.hand, 
                        turnIndex: 0, // Le joueur 0 commence toujours (le premier connecté)
                        myIndex: index 
                    });
                });
                
                console.log("🎮 PARTIE LANCÉE (3 HUMAINS)");
            }, 1000);
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ Départ : ${socket.id}`);
        if (!gameStarted) {
            // Si la partie n'a pas commencé, on libère la place
            players = players.filter(p => p.id !== socket.id);
            io.emit('update_players', players);
        }
        // Si la partie a commencé, on garde le joueur "fantôme" pour ne pas planter le jeu des autres
    });

    socket.on('play_move', (data) => {
        // Vérification : Est-ce bien au tour de ce joueur ?
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            console.log(`🎲 ${players[turnIndex].name} joue [${data.tile.v1}|${data.tile.v2}]`);
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`⚡ SERVEUR 3 JOUEURS PRÊT (Port ${PORT})`);
});