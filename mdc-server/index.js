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
let passCount = 0; // Compteur pour gérer les blocages

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

// Fonction simple pour passer la main (Le serveur ne réfléchit pas, il désigne)
const donnerLaMain = () => {
    const currentPlayer = players[turnIndex];
    if (currentPlayer) {
        console.log(`👉 C'est au tour de ${currentPlayer.name} (Index ${turnIndex})`);
        io.emit('your_turn', { playerIndex: turnIndex });
    }
};

const appliquerCoup = (tile, side, playerId) => {
    // ... (tout le début de la fonction reste identique) ...
    // ... (board.find, logique de placement, retrait de la main...)

    if (players[playerId]) {
        players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    }
    
    io.emit('board_update', { 
        board, 
        ends, 
        turnIndex, 
        lastMoveBy: playerId 
    });

    // --- CORRECTION ICI : GESTION DE LA SUITE DE LA PARTIE ---
    if (players[playerId] && players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE : ${players[playerId].name}`);
        lastWinnerId = playerId;
        
        const allHands = players.map(p => ({ 
            serverIndex: players.indexOf(p), 
            hand: p.hand 
        }));

        setTimeout(() => {
            io.emit('round_won', { 
                winnerId: playerId, 
                winningTile: tile,
                allHands: allHands
            });

            // ICI : ON RELANCE AUTOMATIQUEMENT LA MANCHE APRÈS 10 SECONDES
            console.log("⏳ Nouvelle manche dans 10s...");
            setTimeout(() => {
                lancerManche(); 
            }, 10000); // 10 secondes pour laisser le temps de voir le tableau des scores

        }, 500);

    } else {
        turnIndex = (turnIndex + 2) % 3;
        donnerLaMain();
    }
};

const lancerManche = () => {
    console.log("🎲 DISTRIBUTION (NOUVELLE MANCHE)...");
    
    // 1. Nettoyage absolu du plateau
    board = [];
    ends = null;
    passCount = 0;

    const deck = generateDominoes();
    
    // 2. Distribution des mains
    players[0].hand = deck.slice(0, 7);
    players[1].hand = deck.slice(7, 14);
    players[2].hand = deck.slice(14, 21);

    const playersPublicInfo = players.map(p => ({
        id: p.id,
        name: p.name,
        handSize: 7
    }));

    let starterIndex = -1;
    let startTile = null;
    let autoPlay = false;

    // 3. Qui commence ?
    if (lastWinnerId !== null && players[lastWinnerId]) {
        console.log(`👑 Le gagnant précédent (${players[lastWinnerId].name}) garde la main.`);
        starterIndex = lastWinnerId;
        autoPlay = false; // Le gagnant joue ce qu'il veut
    } else {
        console.log("🔍 Recherche du plus gros domino (Double 6 ou + lourd)...");
        let maxVal = -1;
        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                // Poids : Double = Valeur + 100, Simple = v1 + v2
                let val = (tile.v1 === tile.v2) ? (tile.v1 + 100) : (tile.v1 + tile.v2);
                if (val > maxVal) { maxVal = val; starterIndex = index; startTile = tile; }
            });
        });
        autoPlay = true; // Le Double 6 est posé automatiquement
    }

    // --- CORRECTION MAJEURE ICI ---
    // On met à jour le tour officiel MAINTENANT, avant de jouer
    turnIndex = starterIndex;
    // ------------------------------

    // 4. Envoi des infos aux clients
    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: starterIndex, 
            myIndex: index,
            players: playersPublicInfo 
        });
    });

    // 5. Action !
    if (autoPlay && startTile) {
        console.log(`🐷 COCHON AUTO : ${players[starterIndex].name} pose [${startTile.v1}|${startTile.v2}]`);
        // On attend un peu que les joueurs voient leur main
        setTimeout(() => {
            appliquerCoup(startTile, 'start', starterIndex);
        }, 1500);
    } else {
        // Mode manuel (Gagnant précédent)
        setTimeout(donnerLaMain, 1000); 
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté: ${socket.id}`);

    // Si un joueur refresh la page, il redemande qui est là
    socket.on('request_lobby_info', () => {
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        socket.emit('update_players', publicList);
    });

    socket.on('join_game', (pseudo) => {
        // Gestion reconnexion (Même pseudo = même place)
        const existingPlayer = players.find(p => p.name === pseudo);

        if (existingPlayer) {
            existingPlayer.id = socket.id;
            console.log(`🔄 ${pseudo} est de retour.`);
        } else if (players.length < 3) {
            players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
            console.log(`👤 ${pseudo} rejoint la table (${players.length}/3)`);
        } else {
            socket.emit('game_full');
            return;
        }
        
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        io.emit('update_players', publicList);

        // Lancement automatique à 3
        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ TABLE COMPLÈTE - START !");
            setTimeout(lancerManche, 2000);
        }
    });

    socket.on('play_move', (data) => {
        // Sécurité : on vérifie que c'est bien à lui de jouer
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });

    // Gestion du "Je boude" envoyé par le Client
    // Gestion du "Je boude" (CORRIGÉ : Calcul des points en cas de blocage)
    socket.on('player_pass', () => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            console.log(`🛑 ${players[turnIndex].name} passe son tour.`);
            passCount++;
            
            // On prévient les autres pour l'affichage
            io.emit('player_passed', { playerIndex: turnIndex });

            if (passCount >= 3) {
                console.log("🚫 JEU BLOQUÉ (3 boudés) -> CALCUL DU VAINQUEUR...");
                
                // 1. On calcule les points de chaque joueur restant
                const scores = players.map((p, idx) => {
                    const points = p.hand.reduce((sum, tile) => sum + tile.v1 + tile.v2, 0);
                    return { index: idx, points: points, id: p.id };
                });

                // 2. On trouve le score le plus bas
                const minPoints = Math.min(...scores.map(s => s.points));
                const winners = scores.filter(s => s.points === minPoints);

                if (winners.length === 1) {
                    // --- UN SEUL VAINQUEUR (Le plus petit score) ---
                    const winner = winners[0];
                    console.log(`🏆 VICTOIRE AUX POINTS : ${players[winner.index].name} avec ${winner.points} points.`);
                    
                    lastWinnerId = winner.index;

                    // On prépare les mains pour l'affichage client
                    const allHands = players.map(p => ({ 
                        serverIndex: players.indexOf(p), 
                        hand: p.hand 
                    }));

                    // On envoie 'round_won' comme une victoire normale !
                    // Astuce : Pour 'winningTile', on prend le dernier domino du plateau (celui qui a bloqué)
                    // pour éviter que le client ne plante sur un domino null.
                    const blockingTile = board.length > 0 ? board[board.length - 1] : {v1:0, v2:0};

                    io.emit('round_won', { 
                        winnerId: winner.index, 
                        winningTile: blockingTile, // Visuel seulement
                        allHands: allHands,
                        reason: 'blocked' // Info bonus
                    });

                } else {
                    // --- VRAIE ÉGALITÉ (Plusieurs joueurs ont le même score minimum) ---
                    console.log("⚖️ ÉGALITÉ PARFAITE aux points.");
                    io.emit('round_draw', {}); 
                }
                
                passCount = 0;
            } else {
                // Au suivant
                turnIndex = (turnIndex + 2) % 3;
                donnerLaMain();
            }
        }
    });

    socket.on('disconnect', () => {
         console.log(`⚠️ Perte de connexion : ${socket.id}`);
         // On ne supprime PAS le joueur pour qu'il puisse revenir
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`⚡ SERVEUR V7 (CLEAN) PRÊT`);
});