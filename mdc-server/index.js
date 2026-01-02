const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuration de Socket.io pour accepter les connexions de ton jeu React
const io = new Server(server, {
    cors: {
        origin: "*", // L'adresse de ton jeu React en local
        methods: ["GET", "POST"]
    }
});

// --- VARIABLES DU JEU (MÉMOIRE DU SERVEUR) ---
let players = []; // Liste des joueurs connectés
let gameState = {
    board: [],
    turnIndex: 0
};

// Quand quelqu'un se connecte
io.on('connection', (socket) => {
    console.log(`Un joueur est entré au Labo : ${socket.id}`);

    // 1. Un joueur rejoint la table
    socket.on('join_game', (pseudo) => {
        if (players.length < 3) {
            const newPlayer = { id: socket.id, name: pseudo, hand: [] };
            players.push(newPlayer);
            
            // On prévient tout le monde
            io.emit('update_players', players);
            console.log(`${pseudo} a rejoint la table.`);
        } else {
            socket.emit('error', 'La table est pleine !');
        }
    });

    // 2. Un joueur joue un domino
    socket.on('play_move', (data) => {
        // data contient : { tile, side, playerId }
        console.log(`Coup joué par ${socket.id} :`, data.tile);
        
        // ICI : On devra ajouter la logique de validation plus tard
        // Pour l'instant, on renvoie le coup à tout le monde pour l'afficher
        io.emit('move_played', data);
    });

    // Déconnexion
    socket.on('disconnect', () => {
        console.log(`Joueur parti : ${socket.id}`);
        players = players.filter(p => p.id !== socket.id);
        io.emit('update_players', players);
    });
});

// Lancer le serveur sur le port 3001 (pour ne pas gêner React qui est sur le 3000)
server.listen(3001, () => {
    console.log('⚡ LE LABO EST OUVERT SUR LE PORT 3001');
});