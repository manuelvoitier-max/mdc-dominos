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

// --- FONCTIONS JEU ---
const generateDominoes = () => {
    const dominoes = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) { 
            dominoes.push({ id: `${i}-${j}`, v1: i, v2: j }); 
        }
    }
    return dominoes.sort(() => Math.random() - 0.5);
};

// Fonction pour vérifier si un joueur peut jouer
const peutJouer = (hand, ends) => {
    if (!ends) return true; // Premier tour
    return hand.some(d => d.v1 === ends.left || d.v2 === ends.left || d.v1 === ends.right || d.v2 === ends.right);
};

// Fonction pour vérifier si un joueur peut jouer
const peutJouer = (hand, ends) => {
    if (!ends) return true; // Premier tour
    return hand.some(d => d.v1 === ends.left || d.v2 === ends.left || d.v1 === ends.right || d.v2 === ends.right);
};

const passerAuTourSuivant = () => {
    let nextIndex = (turnIndex + 1) % 3;
    let attempts = 0;

    // On cherche le prochain joueur qui PEUT jouer
    // (Dans la vraie vie au domino, si tu ne peux pas, tu boudes et c'est au suivant)
    
    // Pour l'instant, on passe simplement la main au suivant.
    // C'est le CLIENT qui dira "Je boude" s'il ne peut pas jouer.
    
    turnIndex = nextIndex;
    const currentPlayer = players[turnIndex];

    if (currentPlayer) {
        console.log(`👉 Tour de ${currentPlayer.name} (Index ${turnIndex})`);
        
        // On envoie le tour à tout le monde
        io.emit('your_turn', { playerIndex: turnIndex });
        
        // PETITE AIDE SERVEUR : On vérifie si ce joueur est boudé
        // Si oui, on pourrait automatiser le "Boudé", mais laissons le client le faire pour l'animation.
    }
};

const appliquerCoup = (tile, side, playerId) => {
    if (board.find(d => d.id === tile.id)) return;
    
    // Reset du compteur de "Boudé"
    passCount = 0;

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
    
    if (players[playerId]) {
        players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);
    }
    
    // 1. D'ABORD : On met à jour le plateau pour tout le monde
    io.emit('board_update', { board, ends, turnIndex, lastMoveBy: playerId });

    // 2. ENSUITE : On vérifie la victoire
    if (players[playerId] && players[playerId].hand.length === 0) {
        console.log(`🏆 VICTOIRE : ${players[playerId].name}`);
        lastWinnerId = playerId;
        
        // On prépare les mains de tout le monde pour le calcul des scores (Révélation)
        const allHands = players.map(p => ({ 
            serverIndex: players.indexOf(p), 
            hand: p.hand 
        }));

        // IMPORTANT : On attend 500ms que le plateau soit affiché avant de crier victoire
        setTimeout(() => {
            io.emit('round_won', { 
                winnerId: playerId, 
                winningTile: tile,
                allHands: allHands // On envoie les mains pour que le client calcule les points
            });
        }, 500);

    } else {
        turnIndex = (turnIndex + 2) % 3;
        donnerLaMain();
    }
};

const lancerManche = () => {
    console.log("🎲 DISTRIBUTION DES DOMINOS...");
    const deck = generateDominoes();
    
    // On remplit les mains (Serveur)
    players[0].hand = deck.slice(0, 7);
    players[1].hand = deck.slice(7, 14);
    players[2].hand = deck.slice(14, 21);

    // Info publique (Noms + ID)
    const playersPublicInfo = players.map(p => ({
        id: p.id,
        name: p.name,
        handSize: 7
    }));

    let starterIndex = -1;
    let startTile = null;
    let autoPlay = false;

    if (lastWinnerId !== null && players[lastWinnerId]) {
        starterIndex = lastWinnerId;
        autoPlay = false;
        board = [];
        ends = null;
    } else {
        // Recherche du Cochon
        let maxVal = -1;
        players.forEach((p, index) => {
            p.hand.forEach(tile => {
                let val = (tile.v1 === tile.v2) ? (tile.v1 + 100) : (tile.v1 + tile.v2);
                if (val > maxVal) { maxVal = val; starterIndex = index; startTile = tile; }
            });
        });
        autoPlay = true;
    }

    // ENVOI DES MAINS AUX JOUEURS
    players.forEach((p, index) => {
        io.to(p.id).emit('game_start', { 
            hand: p.hand, 
            turnIndex: starterIndex, 
            myIndex: index,
            players: playersPublicInfo 
        });
    });

    if (autoPlay && startTile) {
        console.log(`🐷 COCHON AUTO : ${players[starterIndex].name}`);
        setTimeout(() => {
            appliquerCoup(startTile, 'start', starterIndex);
        }, 1500);
    } else {
        board = [];
        ends = null;
        turnIndex = starterIndex;
    }
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté: ${socket.id}`);

    // --- RECEPTION DEMANDE D'INFOS (LOBBY) ---
    socket.on('request_lobby_info', () => {
        // On envoie la liste actuelle à celui qui demande
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        socket.emit('update_players', publicList);
    });

    socket.on('join_game', (pseudo) => {
        // 1. Est-ce que ce joueur existe déjà (par pseudo) ?
        const existingPlayer = players.find(p => p.name === pseudo);

        if (existingPlayer) {
            // C'est une RECONNEXION : On met à jour son ID socket
            existingPlayer.id = socket.id;
            console.log(`🔄 ${pseudo} est revenu (Socket mis à jour)`);
        } else {
            // C'est un NOUVEAU (si place dispo)
            if (players.length < 3) {
                players.push({ id: socket.id, name: pseudo, type: 'human', hand: [] });
                console.log(`👤 ${pseudo} a rejoint la table. (${players.length}/3)`);
            } else {
                console.log(`⛔ Table pleine, ${pseudo} rejeté.`);
                socket.emit('game_full');
                return;
            }
        }
        
        // 2. On prévient TOUT LE MONDE de la nouvelle liste
        const publicList = players.map(p => ({ name: p.name, id: p.id }));
        io.emit('update_players', publicList);

        // 3. Si on est 3, on lance (si pas déjà lancé)
        if (players.length === 3 && !gameStarted) {
            gameStarted = true;
            console.log("✅ 3 JOUEURS - LANCEMENT !!");
            setTimeout(lancerManche, 2000);
        } else if (players.length === 3 && gameStarted) {
            // Si le jeu a déjà commencé et que qqn revient, on pourrait lui renvoyer sa main (Bonus futur)
            // Pour l'instant on laisse couler.
        }
    });

    socket.on('play_move', (data) => {
        if (players[turnIndex] && players[turnIndex].id === socket.id) {
            appliquerCoup(data.tile, data.side, turnIndex);
        }
    });

    // --- DECONNEXION ---
    socket.on('disconnect', () => {
         console.log(`⚠️ Perte de connexion : ${socket.id}`);
         // IMPORTANT : ON NE SUPPRIME PLUS LES JOUEURS ICI !
         // Ils restent en mémoire "fantôme" en attendant leur retour.
         // Seul un redémarrage manuel du serveur via Render effacera la liste.
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`⚡ SERVEUR STABLE (Persistant) PRÊT`);
});