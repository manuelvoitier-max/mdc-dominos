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

let players = []; 

io.on('connection', (socket) => {
    console.log(`🔌 Connecté : ${socket.id}`);

    // 1. Un joueur rejoint
    socket.on('join_game', (pseudo) => {
        // Pour l'instant, on nettoie tout pour tester seul
        players = []; 
        
        const newPlayer = { id: socket.id, name: pseudo, hand: [] };
        players.push(newPlayer);
        console.log(`${pseudo} a rejoint la table.`);
        
        // On prévient le joueur qu'il est bien inscrit
        socket.emit('update_players', players);

        // TEST : On lance la partie TOUT DE SUITE avec des bots simulés
        setTimeout(() => {
            console.log("🎮 Lancement de la partie !");
            startGame();
        }, 1000);
    });

    // Fonction pour démarrer et distribuer
    const startGame = () => {
        const deck = generateDominoes();
        
        // On prend le joueur réel (Toi)
        const realPlayer = players[0];
        
        // On découpe le jeu : 7 pour toi
        const hand = deck.slice(0, 7);
        
        // On envoie TA main spécifique
        io.to(realPlayer.id).emit('game_start', {
            hand: hand,
            turnIndex: 0 // C'est au premier joueur de jouer
        });
    };

    socket.on('disconnect', () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        players = players.filter(p => p.id !== socket.id);
    });
});

server.listen(3001, () => {
    console.log('⚡ SERVEUR DOMINO PRÊT SUR LE PORT 3001');
});