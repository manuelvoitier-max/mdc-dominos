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

// --- VARIABLES D'ÉTAT ---
let players = [];
let board = [];
let ends = null;
let turnIndex = 0;
let gameStarted = false;
let lastWinnerId = null; // Mémoire : Qui a gagné la dernière fois ?

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
    // Sens Anti-horaire (Antilles) : +2 modulo 3
    turnIndex = (turnIndex + 2) % 3; 
    const currentPlayer = players[turnIndex];
    if (!currentPlayer) return;

    console.log(`👉 Tour de ${currentPlayer.name}`);
    io.emit('your_turn', { playerIndex: turnIndex });
};

const appliquerCoup = (tile, side, playerId) => {
    // Vérif doublon
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
    
    // Retirer de la main
    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    
    // Mise à jour client
    io.emit('board_update', { board, ends, turnIndex: (turnIndex + 2) % 3 });

    // VERIFICATION VICTOIRE
    if (players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE de ${players[playerId].name} !`);
        lastWinnerId = playerId; // On mémorise le gagnant pour la prochaine partie
        // On laisse le frontend gérer l'affichage de victoire, 
        // mais le serveur sait maintenant qui doit commencer la prochaine.
        
        // On remet gameStarted à false pour permettre de relancer une manche via un bouton "Rejouer" (à implémenter plus tard)
        // Pour l'instant on laisse tourner pour que l'anim se finisse.
    } else {
        passerAuTourSuivant();
    }
};

const lancerManche = () => {
    console.log("🎲 DISTRIBUTION DES DOMINOS...");
    const deck = generateDominoes();
    
    // Distribution
    players[0].hand = deck.slice(0, 7);
    players[1].hand = deck.slice(7, 14);
    players[2].hand = deck.slice(14, 21);

    // --- LOGIQUE DE DÉMARRAGE (Règles Antilles) ---
    
    let starterIndex = -1;
    let startTile = null;
    let autoPlay = false;

    if (lastWinnerId !== null && players[lastWinnerId]) {
        // CAS 2 : IL Y A UN GAGNANT PRÉCÉDENT
        console.log(`👑 Le gagnant précédent (${players[lastWinnerId].name}) commence librement.`);
        starterIndex = lastWinnerId;
        autoPlay = false; // Il choisit son domino
        board = [];       // Le plateau commence vide
        ends = null;
    } else {
        // CAS 1 : PREMIÈRE PARTIE (ou après Reset) -> LE PLUS GROS DOUBLE COMMENCE
        console.log("🐷 Recherche du plus gros double (Cochon)...");
        let maxDouble = -1;

        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                if (tile.v1 === tile.v2 && tile.v1 > maxDouble) {
                    maxDouble = tile.v1;
                    starterIndex = index;
                    startTile = tile;
                }
            });
        });

        // Sécurité si 0 double (très rare à 3 joueurs)
        if (starterIndex === -1) {
            // On prend le plus lourd
             let maxWeight = -1;
             players.forEach((p, index) => {
                p.hand.forEach(tile => {
                    if ((tile.v1 + tile.v2) > maxWeight) {
                        maxWeight = tile.v1 + tile.v2;
                        starterIndex = index;
                        startTile = tile;
                    }
                });
            });
        }

        console.log(`🐷 DÉPART AUTOMATIQUE : ${players[starterIndex].name} avec [${startTile.v1}|${startTile.v2}]`);
        autoPlay = true; // Le serveur joue pour lui
    }

    // APPLICATION DU DÉMARRAGE
    if (autoPlay && startTile) {
        // Le serveur pose le domino
        board = [{ ...startTile, placedAt: Date.now(), sourcePlayerId: starterIndex }];
        ends = { left: startTile.v1, right: startTile.v2 };
        players[starterIndex].hand = players[starterIndex].hand.filter(t => t.id !== startTile.id);
        
        // Tour au suivant
        turnIndex = (starterIndex + 2) % 3;
    } else {
        // Le joueur commence, plateau vide
        board = [];
        ends = null;
        turnIndex = starterIndex;
    }

    // ENVOI AUX JOUEURS
    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: turnIndex, 
            myIndex: index,
            players: players // Noms pour l'affichage
        });
    });

    // Si on a joué automatiquement, on met à jour le plateau tout de suite
    if (autoPlay) {
        setTimeout(() => {
            io.emit('board_update', { board, ends, turnIndex });
        }, 500);
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Nouveau : ${socket.id}`);

    socket.on('join_game', (pseudo) => {
        // Gestion reconnexion simplifiée
        const existing = players.find(p => p.id === socket.id);
        if (!existing && players.length < 3) {
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} rejoint. (${players.length}/3)`);
        }
        
        io.emit('update_players', players);

        // LANCEMENT
        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ 3 JOUEURS - Lancement...");
            setTimeout(lancerManche, 1000);
        }
    });
    
    // NOUVEAU : Pour lancer la partie suivante
    socket.on('next_round', () => {
        // (Sécurité simple : n'importe qui peut relancer pour l'instant)
        console.log("🔄 Demande de nouvelle manche reçue");
        lancerManche();
    });

    socket.on('disconnect', () => {
        console.log(`❌ Départ : ${socket.id}`);
        // En partie, on ne supprime pas le joueur pour ne pas casser la logique du tour
        // Sauf si tout le monde part, on reset
        if (io.engine.clientsCount === 0) {
            console.log("🧹 Reset complet du serveur");
            players = [];
            gameStarted = false;
            lastWinnerId = null;
            board = [];
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
    console.log(`⚡ SERVEUR ANTILLAIS (RÈGLES CORRECTES) PRÊT`);
});