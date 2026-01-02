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
            // IMPORTANT : On force v1 et v2 à être des NOMBRES
            dominoes.push({ id: `${i}-${j}`, v1: Number(i), v2: Number(j) }); 
        }
    }
    return dominoes.sort(() => Math.random() - 0.5);
};

const getValidMoves = (hand, ends) => {
    // Si pas d'extrémités (premier coup), tout est valide
    if (!ends) return hand.map(d => ({ tile: d, side: 'start' }));
    
    const moves = [];
    hand.forEach(d => {
        // DEBUG : On vérifie les types
        const v1 = Number(d.v1);
        const v2 = Number(d.v2);
        const left = Number(ends.left);
        const right = Number(ends.right);

        if (v1 === left || v2 === left) moves.push({ tile: d, side: 'left' });
        else if (v1 === right || v2 === right) moves.push({ tile: d, side: 'right' });
    });
    return moves;
};

// --- TOUR ---
const passerAuTourSuivant = () => {
    turnIndex = (turnIndex + 2) % 3; // Sens Anti-Horaire
    console.log(`👉 Au tour du joueur ${turnIndex}`);

    if (turnIndex !== 0) {
        setTimeout(() => jouerBot(turnIndex), 1500);
    } else {
        io.emit('your_turn');
    }
};

const jouerBot = (botId) => {
    const botHand = players[botId].hand;
    
    // --- MOUCHARD DE DEBUG ---
    console.log(`\n🔍 --- ANALYSE BOT ${botId} ---`);
    console.log(`Main du Bot :`, botHand.map(d => `[${d.v1}|${d.v2}]`).join(', '));
    if (ends) {
        console.log(`Extrémités Plateau : GAUCHE=${ends.left} | DROITE=${ends.right}`);
    } else {
        console.log(`Plateau vide (Etrange si ce n'est pas le 1er tour)`);
    }
    // -------------------------

    const moves = getValidMoves(botHand, ends);

    if (moves.length > 0) {
        const move = moves[0];
        console.log(`✅ COUP TROUVÉ : [${move.tile.v1}|${move.tile.v2}] sur ${move.side}`);
        appliquerCoup(move.tile, move.side, botId);
    } else {
        console.log(`❌ AUCUN COUP VALIDE -> LE BOT BOUDE`);
        io.emit('player_boude', { playerId: botId });
        passerAuTourSuivant();
    }
};

const appliquerCoup = (tile, side, playerId) => {
    // Conversion de sécurité
    let v1 = Number(tile.v1);
    let v2 = Number(tile.v2);
    // On reconstruit l'objet propre pour éviter les formats bizarres venant du client
    let placed = { id: tile.id, v1: v1, v2: v2, placedAt: Date.now(), sourcePlayerId: playerId };

    if (board.length === 0) {
        board = [placed];
        ends = { left: v1, right: v2 };
        console.log(`INIT PLATEAU : [${v1}|${v2}]`);
    } else {
        // Conversion de sécurité pour les bouts actuels
        let currentLeft = Number(ends.left);
        let currentRight = Number(ends.right);

        if (side === 'left') {
            // On veut coller à GAUCHE.
            // Si le domino est [1|6] et Gauche est 6.
            // v1=1, v2=6. Left=6.
            // v2 (6) === Left (6) ? OUI.
            // Donc ça marche sans inverser. Nouveau bout = v1 (1).
            
            // Si le domino est [6|1] (v1=6, v2=1) et Left=6.
            // v2 (1) !== Left (6).
            // Donc on INVERSE -> [1|6].
            if (placed.v2 !== currentLeft) { 
                console.log(`🔄 Inversion domino pour coller à gauche`);
                let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp; 
            }
            ends.left = placed.v1;
            board.unshift(placed);
        } else {
            // DROITE
            if (placed.v1 !== currentRight) {
                console.log(`🔄 Inversion domino pour coller à droite`);
                let tmp=placed.v1; placed.v1=placed.v2; placed.v2=tmp;
            }
            ends.right = placed.v2;
            board.push(placed);
        }
    }
    
    console.log(`📌 Bouts mis à jour : G=${ends.left} | D=${ends.right}`);

    players[playerId].hand = players[playerId].hand.filter(d => d.id !== tile.id);

    io.emit('board_update', { 
        board, 
        ends, 
        turnIndex: (turnIndex + 2) % 3 
    });

    passerAuTourSuivant();
};

io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);
    socket.on('join_game', (pseudo) => {
        players = []; board = []; ends = null; turnIndex = 0;
        
        players.push({ id: socket.id, name: pseudo, hand: [] });
        players.push({ id: 'bot1', name: 'Chaton', hand: [] });
        players.push({ id: 'bot2', name: 'Olivier', hand: [] });

        socket.emit('update_players', players);

        setTimeout(() => {
            const deck = generateDominoes();
            players[0].hand = deck.slice(0, 7);
            players[1].hand = deck.slice(7, 14);
            players[2].hand = deck.slice(14, 21);
            io.emit('game_start', { hand: players[0].hand, turnIndex: 0 });
            console.log("🎮 Distribution terminée.");
        }, 500);
    });

    socket.on('play_move', (data) => {
        if (turnIndex === 0) {
            console.log(`\n👤 JOUEUR HUMAIN POSE : [${data.tile.v1}|${data.tile.v2}]`);
            appliquerCoup(data.tile, data.side, 0);
        }
    });
});

server.listen(3001, () => {
    console.log('⚡ SERVEUR MOUCHARD PRÊT');
});