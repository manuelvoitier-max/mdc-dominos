import React, { useState, useEffect, useRef } from 'react';

/**
 * --- ICONES SVG INTEGREES (Stable & Autonome) ---
 */
const Icons = {
    User: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Trophy: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-6c-1.71 0-3.03.96-3.79 2.52C7.94 5.37 8 7.42 8 10c0 2.21 1.79 4 4 4h0c2.21 0 4-1.79 4-4 0-2.58.06-4.63-.21-5.48C15.03 2.96 13.71 2 12 2Z"/></svg>,
    Coins: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M17.12 10.06a4 4 0 1 0-4.42 4.47"/></svg>,
    Settings: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
    Wifi: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
    ChevronLeft: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    X: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    Crown: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>,
    ShoppingBag: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    Gem: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>,
    AlertCircle: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    Maximize: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
    Lock: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    TrendingUp: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    Gift: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    Play: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    Snowflake: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16 16 12 20 8"/><path d="M4 8 8 12 4 16"/><path d="M16 4 12 8 8 4"/><path d="M8 20 12 16 16 20"/></svg>,
    MessageCircle: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    Camera: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
    Zap: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    CheckCircle: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    Award: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
};


/**
 * --- ASSETS ---
 */
// Logo 972 (Code Département)
const Logo972 = ({ className }) => (
    <svg viewBox="0 0 140 80" fill="currentColor" className={className}>
        <text x="70" y="65" fontSize="70" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-5px' }}>972</text>
    </svg>
);

// Composant de sécurité renforcé pour les icônes
const SafeIcon = ({ icon: Icon, size, className }) => {
    // Si l'icône n'est pas fournie ou n'est pas un composant valide, on ne rend rien
    if (!Icon || (typeof Icon !== 'function' && typeof Icon !== 'object')) return null;
    return <Icon size={size} className={className} />;
};

// Mapping sécurisé des icônes pour les objets dynamiques (JSON)
const ICON_MAP = {
    user: Icons.User,
    crown: Icons.Crown,
    bot: Icons.Settings,
    skull: Icons.AlertCircle,
    ghost: Icons.User,
    smile: Icons.User,
    snowflake: Icons.Snowflake
};

/**
 * --- SIMULATION BACKEND ---
 */
const MOCK_DB = {
  users: [
    {
      id: 1,
      pseudo: "admin",
      password: "123",
      role: "admin",
      isVip: true,
      wallet: { gold: 50000, gems: 1000 },
      inventory: ['skin_classic', 'skin_gold', 'board_classic', 'board_xmas', 'phrase_boude', 'license_expert', 'avatar_classic', 'avatar_king', 'bot_manx'],
      equippedSkin: 'skin_gold',
      equippedBoard: 'board_xmas',
      equippedAvatar: 'avatar_king',
      stats: { played: 500, won: 450, cochonsDonnes: 120, cochonsPris: 5, points: 1200 }
    },
    {
      id: 2,
      pseudo: "Joueur972",
      password: "123",
      role: "user",
      isVip: false,
      wallet: { gold: 500, gems: 0 },
      inventory: ['skin_classic', 'board_classic', 'phrase_boude', 'avatar_classic'],
      equippedSkin: 'skin_classic',
      equippedBoard: 'board_classic',
      equippedAvatar: 'avatar_classic',
      stats: { played: 10, won: 2, cochonsDonnes: 1, cochonsPris: 8, points: 45 }
    }
  ],
  items: [
    // SKINS DOMINOS
    { id: 'skin_classic', type: 'skin', name: 'Classique', price: 0, color: 'bg-yellow-400 text-black' },
    { id: 'skin_gold', type: 'skin', name: 'MDC Gold', price: 500, color: 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black border-yellow-200' },
    { id: 'skin_neon', type: 'skin', name: 'Néon Cyber', price: 250, color: 'bg-zinc-900 text-cyan-400 border-cyan-500 shadow-[0_0_10px_#22d3ee]' },
    // TAPIS DE JEU
    { id: 'board_classic', type: 'board', name: 'Feutre Vert', price: 0, style: 'bg-[#064e3b]' },
    { id: 'board_blue', type: 'board', name: 'Nuit Bleue', price: 100, style: 'bg-[#0f172a]' },
    { id: 'board_xmas', type: 'board', name: 'Noël 972', price: 300, style: 'bg-gradient-to-b from-red-900 to-green-900', icon: 'snowflake' },
    { id: 'board_sponsor', type: 'board', name: 'Sponsor Rhum', price: 1000, style: 'bg-[#451a03]' },
    // AVATARS
    { id: 'avatar_classic', type: 'avatar', name: 'Anonyme', price: 0, icon: 'user' },
    { id: 'avatar_king', type: 'avatar', name: 'Le Roi', price: 500, icon: 'crown' },
    { id: 'avatar_robot', type: 'avatar', name: 'Cyborg', price: 250, icon: 'bot' },
    { id: 'avatar_pirate', type: 'avatar', name: 'Filibustier', price: 300, icon: 'skull' },
    { id: 'avatar_ghost', type: 'avatar', name: 'Fantôme', price: 150, icon: 'ghost' },
    { id: 'avatar_smile', type: 'avatar', name: 'Joyeux', price: 100, icon: 'smile' },
    // PHRASES
    { id: 'phrase_boude', type: 'phrase', name: 'Boudé Standard', text: 'Boudé ! 🛑', price: 0 },
    { id: 'phrase_manikou', type: 'phrase', name: 'Ti Manikou', text: 'Ti Manikou ! 🐭', price: 50 },
    { id: 'phrase_sale', type: 'phrase', name: 'I Salé !', text: 'I salééé !!! 🧂', price: 100 },
    { id: 'phrase_tebe', type: 'phrase', name: 'Tébé', text: 'Tébé ou quoi ? 🤨', price: 80 },
    { id: 'phrase_mize', type: 'phrase', name: 'La Mizè', text: 'Woy la mizè... 😩', price: 50 },
    { id: 'phrase_boss', type: 'phrase', name: 'Le Boss', text: 'C\'est qui le patron ? 😎', price: 150 },
    { id: 'phrase_doudou', type: 'phrase', name: 'Doudou', text: 'I fèw mal Doudou ! 😢', price: 120 },
    { id: 'phrase_dur', type: 'phrase', name: 'Plus Dur', text: 'Tu n\'as pas plus dur ! 💪', price: 120 },
    // GRADES / LICENCES
    { id: 'license_expert', type: 'grade', name: 'Licence Pro', text: 'Débloque le niveau Expert', price: 500 },
    { id: 'bot_manx', type: 'legend', name: "Man'X le Président", text: 'Jouez contre la Légende (IA Stratégique)', price: 2000, icon: 'crown' },
    { id: 'bot_valou', type: 'legend', name: "Valou le Redoutable", text: 'Jouez contre la Légende (IA Agressive)', price: 3000, icon: 'crown' }
  ]
};

const MOCK_RANKINGS = {
    cochonsDonnes: [
        { name: 'Tonton René', val: 42, avatar: 'avatar_king', played: 150, winRate: 65 },
        { name: 'AdminMDC', val: 38, avatar: 'avatar_robot', played: 500, winRate: 90 },
        { name: 'Ti Jo', val: 25, avatar: 'avatar_classic', played: 80, winRate: 45 },
        { name: 'DominoBoss', val: 20, avatar: 'avatar_pirate', played: 200, winRate: 55 },
        { name: 'Joueur972', val: 1, avatar: 'avatar_smile', played: 10, winRate: 20 }
    ],
    cochonsPris: [
        { name: 'Expert972', val: 0, avatar: 'avatar_ghost', played: 300, winRate: 88 },
        { name: 'La Muraille', val: 1, avatar: 'avatar_robot', played: 120, winRate: 72 },
        { name: 'Joueur972', val: 2, avatar: 'avatar_smile', played: 10, winRate: 20 },
        { name: 'DominoMaster', val: 5, avatar: 'avatar_pirate', played: 450, winRate: 60 },
        { name: 'PasDeChance', val: 12, avatar: 'avatar_classic', played: 50, winRate: 30 }
    ],
    points: [
        { name: 'La Machine', val: 1540, avatar: 'avatar_robot', played: 210, winRate: 75 },
        { name: 'AdminMDC', val: 1200, avatar: 'avatar_king', played: 500, winRate: 90 },
        { name: 'ZoukLove', val: 980, avatar: 'avatar_smile', played: 180, winRate: 58 },
        { name: 'Ti Jo', val: 850, avatar: 'avatar_classic', played: 80, winRate: 45 },
        { name: 'Joueur972', val: 45, avatar: 'avatar_smile', played: 10, winRate: 20 }
    ]
};

const MOCK_TABLES = [
    { id: 1, name: "Fort-de-France", stake: 50, players: 2, max: 3, format: 'Manches' },
    { id: 2, name: "Le Lamentin", stake: 100, players: 1, max: 15, format: 'Points' },
    { id: 3, name: "Sainte-Marie", stake: 500, players: 2, max: 3, format: 'Manches' },
    { id: 4, name: "Le François", stake: 50, players: 0, max: 2, format: 'Manches' },
    { id: 5, name: "Rivière-Pilote", stake: 100, players: 1, max: 25, format: 'Points' }
];

const AuthService = {
  login: (pseudo, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_DB.users.find(u => u.pseudo.toLowerCase() === pseudo.toLowerCase() && u.password === password);
        if (user) resolve(user);
        else reject("Identifiants incorrects (Essaye: admin / 123)");
      }, 800);
    });
  }
};

/**
 * --- LOGIQUE DOMINO (VRAI MOTEUR) ---
 */
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

const getValidMoves = (hand, ends) => {
  if (!ends) return hand.map(d => ({ tile: d, side: 'start' }));
  const moves = [];
  hand.forEach(d => {
    if (d.v1 === ends.left || d.v2 === ends.left) moves.push({ tile: d, side: 'left' });
    if (d.v1 === ends.right || d.v2 === ends.right) moves.push({ tile: d, side: 'right' });
  });
  return moves;
};

const calculateHandPoints = (hand) => {
  return hand.reduce((sum, tile) => sum + tile.v1 + tile.v2, 0);
};

// --- IA SPECIALE : VALOU LE REDOUTABLE (CONFIRMÉ : NIVEAU MAX) ---
const getValouMove = (hand, ends) => {
    const validMoves = getValidMoves(hand, ends);
    if (validMoves.length === 0) return null;

    // --- CORRECTION DU BUG DE DÉMARRAGE ---
    // Si ends est null (c'est le début de la manche), on joue le plus fort sans stratégie de blocage
    if (!ends) {
        validMoves.sort((a, b) => {
            const ta = a.tile;
            const tb = b.tile;
            const isDoubleA = ta.v1 === ta.v2;
            const isDoubleB = tb.v1 === tb.v2;
           
            // Priorité absolue aux doubles pour démarrer
            if (isDoubleA && !isDoubleB) return -1;
            if (!isDoubleA && isDoubleB) return 1;
           
            // Sinon on joue le plus lourd
            return (tb.v1 + tb.v2) - (ta.v1 + ta.v2);
        });
        return validMoves[0];
    }
    // ----------------------------------------

    // Analyse de la main pour connaître ses forces (fréquence des valeurs)
    const counts = {};
    hand.forEach(t => {
        counts[t.v1] = (counts[t.v1] || 0) + 1;
        counts[t.v2] = (counts[t.v2] || 0) + 1;
    });

    // Score chaque mouvement possible selon les principes du domino martiniquais
    const scoredMoves = validMoves.map(move => {
        let score = 0;
        const t = move.tile;
        const isDouble = t.v1 === t.v2;
        const tilePoints = t.v1 + t.v2;

        // PRINCIPE 1 : "Tuer les Cochons" (Les gros doubles doivent sortir vite)
        if (isDouble) {
            // Plus le double est gros, plus c'est urgent (Double 6 = urgence absolue)
            // Augmentation du poids pour Valou le Redoutable (2.5 -> 3.0)
            score += tilePoints * 3.0;
        } else {
            // Pour les simples, on préfère aussi jouer les gros pour alléger la main
            score += tilePoints * 0.5;
        }

        // PRINCIPE 2 : "Garder la Main" (Poser une valeur qu'on domine)
        const nextOpenValue = move.side === 'left'
            ? (t.v1 === ends.left ? t.v2 : t.v1)
            : (t.v1 === ends.right ? t.v2 : t.v1);
       
        // Si je laisse ouvert une valeur dont j'ai beaucoup d'exemplaires en main
        const myCountOfOpenValue = (counts[nextOpenValue] || 0) - 1;
        score += myCountOfOpenValue * 25; // Gros bonus stratégique agressif

        // PRINCIPE 4 : FINISSEUR
        if (hand.length === 1) score += 10000; // Priorité absolue à la victoire

        return { move, score };
    });

    // On trie pour avoir le meilleur score en premier
    scoredMoves.sort((a, b) => b.score - a.score);
   
    return scoredMoves[0].move;
};
// --- LOGIQUE MAN'X (STRATEGIE AVANCEE) ---
const getManXMove = (hand, ends) => {
    // 1. Analyse de la main (Trouver la Clé)
    const counts = {};
    hand.forEach(t => {
        counts[t.v1] = (counts[t.v1] || 0) + 1;
        counts[t.v2] = (counts[t.v2] || 0) + 1;
    });
    let key = -1;
    let maxCount = -1;
    Object.entries(counts).forEach(([k, v]) => {
        if (v > maxCount) { maxCount = v; key = parseInt(k); }
    });
    // Une "clé" est forte si on a 4 ou 5 dominos de cette valeur
    const isStrongKey = maxCount >= 4;

    const validMoves = getValidMoves(hand, ends);
    if(validMoves.length === 0) return null;

    const scoredMoves = validMoves.map(move => {
        let score = 0;
        const t = move.tile;
        const isDouble = t.v1 === t.v2;

        // Règle 2 : Jouer ses clés stratégiquement (Priorité absolue)
        if (t.v1 === key || t.v2 === key) {
             score += 25; // Bonus fort pour la clé
        }

        // Règle 3 & 7 : Gestion des doubles
        if (isDouble) {
            if (t.v1 === key && isStrongKey && maxCount >= 5) {
                // Règle 7: Ne jamais commencer par un double si tu as une clé de 5 (tu te coupes)
                // On met un malus énorme pour éviter de le jouer sauf si c'est le seul coup
                score -= 100;
            } else {
                // Règle 3: Te débarrasser des doubles rapidement (surtout s'ils ne sont pas ta clé majeure)
                score += 35;
            }
        }

        // Règle 1 : Equilibre (bonus léger pour les valeurs orphelines, pour ne pas garder de déchets)
        score += Math.random() * 5;

        return { move, score };
    });

    // On trie pour avoir le meilleur score en premier
    scoredMoves.sort((a,b) => b.score - a.score);
    return scoredMoves[0].move;
};


const getBotMove = (hand, ends, difficulty) => {
    const validMoves = getValidMoves(hand, ends);
    if (validMoves.length === 0) return null;

    if (difficulty === 'easy') return validMoves[Math.floor(Math.random() * validMoves.length)];
    if (difficulty === 'medium') return validMoves.sort((a, b) => (b.tile.v1 + b.tile.v2) - (a.tile.v1 + a.tile.v2))[0];
   
    if (difficulty === 'expert') {
        const scoredMoves = validMoves.map(move => {
            let score = 0;
            const tile = move.tile;
            const isDouble = tile.v1 === tile.v2;
            const points = tile.v1 + tile.v2;

            // 1. Se débarrasser des points (Base)
            score += points * 0.5;

            // 2. Priorité absolue aux doubles
            if (isDouble) score += 25;

            // 3. Stratégie "Garder la main"
            if (ends) {
                const newValue = move.side === 'left' ? (tile.v1 === ends.left ? tile.v2 : tile.v1) : (tile.v1 === ends.right ? tile.v2 : tile.v1);
                const remainingHand = hand.filter(t => t.id !== tile.id);
                const matchingRemaining = remainingHand.filter(t => t.v1 === newValue || t.v2 === newValue).length;
                if (matchingRemaining > 0) score += 15 * matchingRemaining;
                else score -= 10;
            } else {
                const remainingHand = hand.filter(t => t.id !== tile.id);
                const matchesV1 = remainingHand.filter(t => t.v1 === tile.v1 || t.v2 === tile.v1).length;
                const matchesV2 = remainingHand.filter(t => t.v1 === tile.v2 || t.v2 === tile.v2).length;
                score += 5 * (matchesV1 + matchesV2);
            }
            score += Math.random() * 2;
            return { move, score };
        });
        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves[0].move;
    }

    // IA VALOU (Le Redoutable - Stratégie Aggressive)
    if (difficulty === 'valou_legend') {
        return getValouMove(hand, ends);
    }

    // IA MAN'X (Légende - Stratégie Equilibrée)
    if (difficulty === 'legend') {
        return getManXMove(hand, ends);
    }

    return validMoves[0];
};

/**
 * --- COMPOSANTS UI ---
 */
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type="button" }) => {
  const baseStyle = "uppercase font-black tracking-wider py-3 px-6 rounded shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans text-sm transition-all duration-150";
  const variants = {
    primary: "bg-gradient-to-b from-red-600 to-red-800 text-white border-t border-red-500 hover:brightness-110 shadow-[0_4px_0px_rgb(153,27,27)] active:shadow-none active:translate-y-1",
    secondary: "bg-zinc-800 text-zinc-300 border border-zinc-600 hover:text-white hover:bg-zinc-700 backdrop-blur-sm",
    shop: "bg-gradient-to-b from-purple-600 to-purple-800 text-white border-t border-purple-400 hover:brightness-110 shadow-[0_4px_0px_rgb(107,33,168)] active:shadow-none active:translate-y-1",
    ad: "bg-gradient-to-b from-blue-500 to-blue-700 text-white border-t border-blue-400 hover:brightness-110 shadow-[0_4px_0px_rgb(29,78,216)] active:shadow-none active:translate-y-1",
    vip: "bg-gradient-to-r from-yellow-500 to-amber-600 text-black border-t border-yellow-300 hover:brightness-110 shadow-[0_4px_0px_rgb(180,83,9)] active:shadow-none active:translate-y-1",
    legend: "bg-gradient-to-b from-zinc-900 to-black text-yellow-500 border-t border-yellow-600 hover:brightness-125 shadow-[0_4px_0px_rgba(234,179,8,0.5)] active:shadow-none active:translate-y-1",
    ghost: "bg-transparent hover:bg-white/10 text-white",
    danger: "bg-red-900 border border-red-700 text-red-100 hover:bg-red-800"
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}>{children}</button>;
};

const DominoTile = ({ v1, v2, size = 'md', orientation = 'vertical', flipped = false, onClick, highlight = false, isMandatory = false, className = '', skinId = 'skin_classic' }) => {
  const renderDots = (val) => {
    const isHorizontal = orientation === 'horizontal';
    const positions = {
      0: [], 1: [[50, 50]], 2: isHorizontal ? [[25, 75], [75, 25]] : [[25, 25], [75, 75]],
      3: isHorizontal ? [[25, 75], [50, 50], [75, 25]] : [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [25, 75], [75, 25], [75, 75]],
      5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      6: isHorizontal ? [[25, 30], [50, 30], [75, 30], [25, 70], [50, 70], [75, 70]]
                        : [[30, 25], [30, 50], [30, 75], [70, 25], [70, 50], [70, 75]]
    };
    return positions[val].map((pos, i) => <circle key={i} cx={pos[0]} cy={pos[1]} r="9" fill="currentColor" />);
  };
  const skin = MOCK_DB.items.find(s => s.id === skinId) || MOCK_DB.items[0];
  const isHorizontal = orientation === 'horizontal';
  const valA = flipped ? v2 : v1;
  const valB = flipped ? v1 : v2;
  let dimClass = size === 'sm' ? (isHorizontal ? 'w-10 h-5' : 'w-5 h-10') : size === 'lg' ? (isHorizontal ? 'w-18 h-9' : 'w-9 h-18') : (isHorizontal ? 'w-22 h-11' : 'w-11 h-22');
  const ringClass = isMandatory ? 'ring-2 ring-red-500 scale-110 z-20 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : highlight ? 'ring-2 ring-green-500 scale-105 z-10 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'shadow-md';
  const skinStyle = skin.id === 'skin_classic' ? 'bg-yellow-400 rounded-[2px] border border-black text-black' : `${skin.color} rounded-[4px] border-2`;
  return (
    <div onClick={onClick} className={`relative flex ${isHorizontal ? 'flex-row' : 'flex-col'} overflow-hidden select-none ${dimClass} ${ringClass} ${skinStyle} ${className} shrink-0 cursor-pointer`}>
      <div className={`flex-1 relative ${isHorizontal ? 'border-r' : 'border-b'} border-current/20 flex items-center justify-center`}><svg viewBox="0 0 100 100" className="w-full h-full">{renderDots(valA)}</svg></div>
      <div className="flex-1 relative flex items-center justify-center"><svg viewBox="0 0 100 100" className="w-full h-full">{renderDots(valB)}</svg></div>
    </div>
  );
};

const getAvatarIcon = (avatarId, size = 36, className = "") => {
    const avatarItem = MOCK_DB.items.find(i => i.id === avatarId);
    if (!avatarItem) return <SafeIcon icon={Icons.User} size={size} className={className} />;
   
    const IconComponent = (avatarItem.icon && ICON_MAP[avatarItem.icon]) ? ICON_MAP[avatarItem.icon] : Icons.User;
    return <SafeIcon icon={IconComponent} size={size} className={className} />;
};

const PlayerAvatar = ({ name, active, isBot, position, cardsCount, wins, isBoude, chatMessage, isVip, equippedAvatar, mdcPoints, cochons, isCochonMode, hand, revealed }) => {
    const getPosStyle = () => {
        switch(position) {
          case 'top-left': return { top: '40px', left: '2px', flexDirection: 'row' };
          case 'top-right': return { top: '40px', right: '2px', flexDirection: 'row-reverse' };
          case 'bottom-right': return { bottom: '2px', right: '2px', flexDirection: 'row-reverse' };
          default: return {};
        }
    };
    const style = getPosStyle();
    const bubbleStyle = position === 'bottom-right'
        ? "bottom-24 right-20"
        : position === 'top-left' ? "top-full mt-2 left-0" : "top-full mt-2 right-0";

    const scoreColor = isCochonMode ? 'text-pink-500' : 'text-yellow-500';
    const scoreLabel = isCochonMode ? '🐷' : 'Pts';
    const scoreValue = isCochonMode ? (cochons || 0) : mdcPoints;

    return (
        <div className={`absolute flex gap-2 md:gap-4 transition-all duration-300 items-center ${active ? 'scale-105 opacity-100 z-[100]' : 'opacity-80 scale-100'} scale-[0.65] md:scale-100 origin-${position.includes('left') ? 'top-left' : 'top-right'}`} style={style}>
            {/* BULLE DE CHAT */}
            {chatMessage && (
                <div className={`absolute ${bubbleStyle} z-[150] animate-in slide-in-from-bottom-2 fade-in duration-300 w-max`}>
                    <div className="bg-white text-black font-black text-xs md:text-sm px-3 py-2 rounded-xl shadow-2xl border-2 border-black relative max-w-[150px] md:max-w-[200px] text-center uppercase tracking-tight">
                        {chatMessage}
                        <div className={`absolute w-3 h-3 bg-white border-b-2 border-r-2 border-black transform rotate-45 ${position.includes('top') ? '-top-1.5 border-t-2 border-l-2 border-b-0 border-r-0' : '-bottom-1.5'} left-1/2 -translate-x-1/2`}></div>
                    </div>
                </div>
            )}

            {/* AVATAR + COMPTEUR */}
            <div className="relative">
                <div className={`w-10 h-10 md:w-24 md:h-24 rounded-full border-2 md:border-4 flex items-center justify-center bg-zinc-950 transition-all duration-500 ${active ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border-zinc-700 shadow-xl'}`}>
                    {isBot ? <SafeIcon icon={Icons.Wifi} className={`w-5 h-5 md:w-9 md:h-9 ${active ? "text-red-500" : "text-zinc-600"}`} /> : <div className={active ? "text-red-500" : "text-zinc-500"}>{getAvatarIcon(equippedAvatar, 20, "w-5 h-5 md:w-9 md:h-9")}</div>}
                    {active && <div className="absolute -top-2 -right-1 md:-top-3 md:-right-1 bg-red-600 text-white text-[6px] md:text-[9px] font-black px-1 py-0.5 rounded uppercase shadow-lg">JOUE</div>}
                </div>
                
                {/* SI PAS RÉVÉLÉ : Affiche le Compteur rond classique */}
                {!revealed && (
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 md:w-10 md:h-10 bg-white text-black rounded-full border-2 md:border-4 border-zinc-950 flex items-center justify-center shadow-lg">
                        <span className="font-black text-[8px] md:text-sm">{cardsCount}</span>
                    </div>
                )}
            </div>
            
            {/* PANNEAU NOM + SCORE */}
            <div className={`flex flex-col ${position === 'top-left' ? 'items-start' : 'items-end'} bg-zinc-900/90 backdrop-blur-xl px-2 py-1 md:px-5 md:py-3 rounded-md md:rounded-lg border border-zinc-700 shadow-2xl min-w-[70px] md:min-w-[140px]`}>
                <span className={`font-sans font-bold text-[8px] md:text-xs tracking-widest uppercase mb-0.5 md:mb-1 flex items-center gap-1 ${isVip ? 'text-yellow-400' : 'text-white'}`}>{isVip && <SafeIcon icon={Icons.Crown} size={8} className="md:w-3 md:h-3 text-yellow-400 fill-yellow-400" />}{name}</span>
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center">
                        <span className="text-[5px] md:text-[8px] text-lime-400 font-black uppercase">V</span>
                        <span className="text-sm md:text-4xl leading-none font-mono font-black text-lime-400">{wins}</span>
                    </div>
                    <div className="w-[1px] h-4 md:h-8 bg-zinc-700"></div>
                    <div className="flex flex-col items-center">
                        <span className={`text-[5px] md:text-[8px] font-black uppercase tracking-tighter text-center ${scoreColor}`}>{scoreLabel}</span>
                        <span className={`text-sm md:text-4xl leading-none font-mono font-black ${scoreColor}`}>{scoreValue}</span>
                    </div>
                </div>
                {isBoude && <div className="mt-1 text-white bg-red-600 font-black text-[6px] md:text-[10px] uppercase tracking-widest animate-pulse px-1 py-0.5 rounded">BOUDÉ !!</div>}
            </div>

            {/* NOUVEAU : AFFICHAGE DE LA MAIN EN FIN DE PARTIE */}
            {revealed && hand && hand.length > 0 && (
                <div className={`absolute ${position.includes('top') ? 'top-full mt-4' : 'bottom-full mb-4'} left-1/2 -translate-x-1/2 z-[200] flex gap-1 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl animate-in zoom-in slide-in-from-top-2 duration-300`}>
                    {hand.map((tile, i) => (
                        <DominoTile key={i} v1={tile.v1} v2={tile.v2} size="sm" className="scale-75 origin-center" skinId="skin_classic" />
                    ))}
                </div>
            )}
        </div>
    );
};

// ... TournamentBanner, AdOverlay ...
const TournamentBanner = ({ onJoin }) => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(20, 0, 0, 0);
      if (now > target) { target.setDate(target.getDate() + 1); }
      const diff = target - now;
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-1 shadow-2xl mb-6 relative overflow-hidden group cursor-pointer" onClick={onJoin}>
      <div className="absolute top-0 right-0 p-4 opacity-20"><SafeIcon icon={Icons.Trophy} size={120} className="text-white transform rotate-12" /></div>
      <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2"><span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded animate-pulse">LIVE 20H00</span><h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Le Grand Tournoi <span className="text-yellow-400">Gratuit</span></h3></div>
          <p className="text-zinc-300 text-xs font-medium max-w-sm">Rejoignez l'élite tous les soirs. Inscription gratuite, dotation réelle.</p>
          <div className="flex items-center gap-2 mt-2"><SafeIcon icon={Icons.Gift} size={16} className="text-yellow-400" /><span className="text-yellow-400 font-bold text-xs uppercase">À gagner : Bons Kadeos & Gemmes</span></div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-purple-300 font-bold uppercase tracking-widest mb-1">Début dans</div>
          <div className="text-3xl font-mono font-black text-white bg-black/50 px-4 py-2 rounded border border-purple-500/30 shadow-inner">{timeLeft}</div>
          <div className="mt-2 text-[10px] text-green-400 font-bold uppercase tracking-widest">● Inscriptions ouvertes</div>
        </div>
      </div>
    </div>
  );
};

const AdOverlay = ({ onClose, onReward }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => { setProgress(prev => { if (prev >= 100) { clearInterval(timer); return 100; } return prev + 2; }); }, 50);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => { if (progress === 100) { setTimeout(() => { onReward(); onClose(); }, 500); } }, [progress, onReward, onClose]);
    return (
        <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-sm w-full">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><SafeIcon icon={Icons.Play} size={32} className="text-white" /></div>
                <h3 className="text-xl font-black text-white uppercase mb-2">Publicité Partenaire</h3>
                <p className="text-zinc-400 text-sm mb-6">Merci de patienter pour recevoir votre récompense...</p>
                <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700"><div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div></div>
                <div className="mt-2 text-xs font-mono text-zinc-500 text-right">{Math.floor((100 - progress) / 20)}s</div>
            </div>
        </div>
    );
};

// --- ECRAN LOBBY MULTIJOUEUR ---
const LobbyScreen = ({ onBack, onJoinTable, onCreateTable }) => {
    const [filterStake, setFilterStake] = useState('all');
    const [loadingTableId, setLoadingTableId] = useState(null);

    const handleJoin = (table) => {
        setLoadingTableId(table.id);
        // Simulation du délai de connexion et de matchmaking
        setTimeout(() => {
            onJoinTable({
                format: table.format.toLowerCase() === 'manches' ? 'manches' : 'points',
                target: table.max,
                stake: table.stake,
                currency: 'gold',
                difficulty: 'medium'
            });
            setLoadingTableId(null);
        }, 2000);
    };

    const filteredTables = MOCK_TABLES.filter(t => filterStake === 'all' || t.stake === filterStake);

    return (
        <div className="flex flex-col h-full p-4 md:p-6 relative bg-zinc-950 overflow-y-auto text-white font-sans">
            <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-white/10"><SafeIcon icon={Icons.ChevronLeft} size={32} /></button>
            <div className="flex-1 max-w-3xl mx-auto w-full pt-8 pb-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">SALON <span className="text-green-500">JEU</span></h2>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Rejoignez une table ou créez la vôtre</p>
                    </div>
                    <Button onClick={onCreateTable} className="text-xs py-3 px-5"><SafeIcon icon={Icons.Settings} size={14} /> CRÉER UNE TABLE</Button>
                </div>

                {/* FILTRES */}
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setFilterStake('all')} className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${filterStake === 'all' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>Tout</button>
                    <button onClick={() => setFilterStake(50)} className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${filterStake === 50 ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>50 Or</button>
                    <button onClick={() => setFilterStake(100)} className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${filterStake === 100 ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>100 Or</button>
                    <button onClick={() => setFilterStake(500)} className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${filterStake === 500 ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>500 Or</button>
                </div>

                {/* LISTE DES TABLES */}
                <div className="flex flex-col gap-3">
                    {filteredTables.map(table => (
                        <div key={table.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-600 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                    <SafeIcon icon={Icons.Wifi} size={20} className={table.players > 0 ? "text-green-500" : "text-zinc-600"} />
                                </div>
                                <div>
                                    <div className="text-white font-black uppercase text-sm">{table.name}</div>
                                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                        <span className="flex items-center gap-1"><SafeIcon icon={Icons.Coins} size={10} className="text-yellow-500"/> {table.stake}</span>
                                        <span>•</span>
                                        <span>{table.format}</span>
                                        <span>•</span>
                                        <span>Obj: {table.max}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-zinc-300 font-mono font-bold text-sm">{table.players}/3</div>
                                    <div className="text-[9px] text-zinc-600 uppercase font-black">Joueurs</div>
                                </div>
                                <Button
                                    onClick={() => handleJoin(table)}
                                    disabled={loadingTableId === table.id}
                                    className={`py-3 px-6 text-xs ${loadingTableId === table.id ? 'opacity-80' : ''}`}
                                >
                                    {loadingTableId === table.id ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ...
                                        </div>
                                    ) : "REJOINDRE"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
               
                {/* MATCHMAKING OVERLAY SIMULATION */}
                {loadingTableId && (
                    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                        <div className="w-20 h-20 rounded-full border-4 border-t-green-500 border-zinc-800 animate-spin mb-8"></div>
                        <h2 className="text-3xl font-black text-white uppercase italic animate-pulse">Recherche d'adversaires...</h2>
                        <p className="text-zinc-500 mt-2 font-mono">Connexion au serveur Martinique...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const LoginScreen = ({ onLogin }) => {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); setError(""); try { const user = await AuthService.login(pseudo, password); onLogin(user); } catch (err) { setError(err); } finally { setLoading(false); } };
    return (
        <div className="flex flex-col h-full w-full bg-zinc-950 items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#450a0a_0%,_#09090b_70%)] opacity-50 pointer-events-none"></div>
            <div className="z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] transform -skew-x-12 mb-4">
                        <Logo972 className="w-10 h-10 text-white skew-x-12" />
                    </div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">MDC <span className="text-red-600">Dominos</span></h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">L'excellence d'une tradition</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Pseudo</label><input type="text" value={pseudo} onChange={e=>setPseudo(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors" placeholder="admin" /></div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors" placeholder="123" /></div>
                    {error && <div className="text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded border border-red-500/20 text-center">{error}</div>}
                    <Button type="submit" disabled={loading} className="mt-4 py-4 text-lg">{loading ? "Chargement..." : "SE CONNECTER"}</Button>
                </form>
            </div>
        </div>
    );
};

const HomeScreen = ({ onNavigate, user, onTournamentClick }) => {
  const modes = [ { id: 'solo', title: 'Entraînement', desc: 'Contre IA', icon: Icons.User, target: 'setup', config: { mode: 'solo' } }, { id: 'online', title: 'Partie Rapide', desc: 'Multijoueur', icon: Icons.Wifi, target: 'lobby' } ];
  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-[#09090b] relative text-white font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#27272a_0%,_#09090b_60%)] opacity-80 pointer-events-none"></div>
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center shadow-lg transform -skew-x-12">
                  <Logo972 className="w-6 h-6 text-white skew-x-12" />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter italic">MDC <span className="text-red-600">DOMINOS</span></h1>
          </div>
          <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ml-1 flex items-center gap-2 ${user.isVip ? 'text-yellow-400' : 'text-zinc-500'}`}>{user.isVip && <SafeIcon icon={Icons.Crown} size={12} className="fill-current" />} Bonjour, {user.pseudo}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-3 bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-700 shadow-lg text-yellow-500 font-mono font-bold text-sm" title="Pièces d'or (Jeu)"><SafeIcon icon={Icons.Coins} size={14} />{user.wallet.gold.toLocaleString()}</div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-900/20 to-purple-600/20 px-4 py-1.5 rounded-full border border-purple-600/50 shadow-lg text-purple-400 font-mono font-bold text-sm cursor-pointer hover:bg-purple-900/40" onClick={() => onNavigate('shop')} title="Gemmes (Premium)"><SafeIcon icon={Icons.Gem} size={14} />{user.wallet.gems.toLocaleString()} <span className="text-[10px] bg-purple-600 text-white px-1 rounded ml-1">+</span></div>
        </div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col h-full pb-20 overflow-y-auto custom-scrollbar">
          <TournamentBanner onJoin={onTournamentClick} />
          <div className="flex-1 flex flex-row items-stretch justify-center gap-4 w-full">
            {modes.map((mode, index) => (
              <div key={index} onClick={() => onNavigate(mode.target, mode.config)} className="group relative flex-1 min-h-[180px] bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer transition-all duration-200 ease-out hover:flex-[1.2] hover:bg-zinc-800 hover:border-red-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="mb-4 text-zinc-600 group-hover:text-red-500 group-hover:scale-125 transition-all duration-200 transform group-hover:-translate-y-2"><SafeIcon icon={mode.icon} size={48} strokeWidth={1.5} /></div>
                  <h3 className="font-black uppercase tracking-tighter text-lg text-white group-hover:text-xl transition-all duration-200 whitespace-nowrap">{mode.title}</h3>
                  <div className="h-1 w-8 bg-zinc-700 my-3 group-hover:bg-red-600 group-hover:w-16 transition-all"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white">{mode.desc}</p>
              </div>
            ))}
          </div>
      </div>
      {/* BAS : BOUTONS TAILLE AJUSTÉE (Mobile: Compact / PC: Normal) */}
      <div className="absolute bottom-6 w-full px-2 z-20 flex justify-center items-end gap-2 md:gap-6 pointer-events-none">
        
        {/* BOUTON PROFIL (Gauche) - Redirige vers 'member' */}
        <Button 
            onClick={() => onNavigate('member')} 
            variant="secondary" 
            className="pointer-events-auto flex-1 max-w-[100px] md:max-w-none px-0 md:px-6 py-3 text-[10px] md:text-sm border-2 border-zinc-600 hover:border-white whitespace-nowrap"
        >
            <SafeIcon icon={Icons.User} size={16} className="mr-1 md:mr-2"/> PROFIL
        </Button>

        {/* BOUTON BOUTIQUE (Centre) - Redirige vers 'shop' - Un peu plus gros */}
        <Button 
            onClick={() => onNavigate('shop')} 
            variant="shop" 
            className="pointer-events-auto flex-[1.4] max-w-[150px] md:max-w-none px-1 md:px-8 py-4 text-xs md:text-base border-2 border-purple-500 hover:border-purple-300 text-white font-black shadow-2xl whitespace-nowrap mb-1"
        >
            <SafeIcon icon={Icons.ShoppingBag} size={18} className="mr-1 md:mr-2"/> BOUTIQUE
        </Button>

        {/* BOUTON RANK (Droite) - Redirige vers 'ranking' */}
        <Button 
            onClick={() => onNavigate('ranking')} 
            variant="secondary" 
            className="pointer-events-auto flex-1 max-w-[100px] md:max-w-none px-0 md:px-6 py-3 text-[10px] md:text-sm border-2 border-zinc-600 hover:border-white whitespace-nowrap"
        >
            <SafeIcon icon={Icons.TrendingUp} size={16} className="mr-1 md:mr-2"/> RANK
        </Button>

      </div>
    </div>
  );
};

const ShopScreen = ({ onBack, user, onUpdateUser }) => {
    const [tab, setTab] = useState('coins');
    const [showingAd, setShowingAd] = useState(false);
    const gemPacks = [ { id: 1, name: "Poignée", amount: 100, price: "1.99 €", color: "bg-zinc-800 border-purple-900" }, { id: 2, name: "Sacoche", amount: 550, bonus: 50, price: "9.99 €", color: "bg-zinc-800 border-purple-600", popular: true }, { id: 3, name: "Coffre", amount: 1200, bonus: 200, price: "19.99 €", color: "bg-zinc-800 border-purple-400" } ];
    const buyGems = (pack) => { const newWallet = { ...user.wallet, gems: user.wallet.gems + pack.amount + (pack.bonus || 0) }; onUpdateUser({ ...user, wallet: newWallet }); alert(`Achat réussi : +${pack.amount} Gemmes !`); };
    const handleWatchAd = () => { if (user.isVip) { handleAdReward(); alert("✨ Récompense VIP récupérée sans publicité !"); } else { setShowingAd(true); } };
    const handleAdReward = () => { const reward = 500; const newWallet = { ...user.wallet, gold: user.wallet.gold + reward }; onUpdateUser({ ...user, wallet: newWallet }); if (!user.isVip) alert(`Merci ! Vous avez gagné ${reward} pièces d'or.`); };
    const buyVip = () => { onUpdateUser({ ...user, isVip: true }); alert("Félicitations ! Vous êtes maintenant Membre VIP."); };
    const buyItem = (item) => {
        const isOwned = user.inventory.includes(item.id);
        if (isOwned) {
            if (item.type === 'skin') onUpdateUser({ ...user, equippedSkin: item.id });
            if (item.type === 'board') onUpdateUser({ ...user, equippedBoard: item.id });
            if (item.type === 'avatar') onUpdateUser({ ...user, equippedAvatar: item.id });
            if (item.type === 'phrase') alert("Phrase déjà possédée ! Utilisable en jeu.");
            if (item.type === 'grade') alert("Vous avez déjà ce grade !");
        } else {
            if (user.wallet.gems >= item.price) {
                const newWallet = { ...user.wallet, gems: user.wallet.gems - item.price };
                let updates = { wallet: newWallet, inventory: [...user.inventory, item.id] };
                if (item.type === 'skin') updates.equippedSkin = item.id;
                if (item.type === 'board') updates.equippedBoard = item.id;
                if (item.type === 'avatar') updates.equippedAvatar = item.id;
                onUpdateUser({ ...user, ...updates });
                alert("Achat effectué !");
            } else { alert("Pas assez de Gemmes !"); }
        }
    };
    const renderItems = (type) => ( <div className="grid grid-cols-2 gap-6 mt-8"> {MOCK_DB.items.filter(i => i.type === type).map(item => { const owned = user.inventory.includes(item.id); const equipped = (type === 'skin' ? user.equippedSkin : type === 'board' ? user.equippedBoard : user.equippedAvatar) === item.id; return ( <div key={item.id} className={`p-4 rounded-xl border ${equipped && type !== 'phrase' ? 'border-green-500 bg-green-500/10' : 'border-zinc-800 bg-zinc-900'} flex flex-col justify-between gap-4 relative overflow-hidden`}> <div className="flex items-center gap-4 relative z-10"> {type === 'skin' ? ( <div className={`w-12 h-6 rounded flex border ${item.color}`}> <div className="flex-1 border-r border-current/20"></div> <div className="flex-1"></div> </div> ) : type === 'board' ? ( <div className={`w-12 h-8 rounded border border-white/20 ${item.style}`}></div> ) : type === 'grade' ? ( <div className="w-12 h-12 rounded bg-yellow-600 flex items-center justify-center text-xl shadow-lg border border-yellow-400"><SafeIcon icon={Icons.Crown} size={24} className="text-white"/></div> ) : type === 'legend' ? ( <div className="w-12 h-12 rounded bg-zinc-900 flex items-center justify-center text-xl shadow-lg border border-yellow-600 text-yellow-500"><SafeIcon icon={Icons.Crown} size={24} className="text-yellow-500" /></div> ) : type === 'avatar' ? ( <div className="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center text-xl shadow-lg border border-zinc-700"> {getAvatarIcon(item.id, 24, "text-zinc-400")} </div> ) : ( <div className="w-12 h-12 rounded bg-black flex items-center justify-center text-xl">{item.text.split(' ').pop().slice(0,2)}</div> )} <div className="text-left"> <div className="font-bold text-sm text-white uppercase leading-tight">{item.name}</div> {type === 'phrase' && <div className="text-[10px] text-zinc-400 italic mt-1">"{item.text}"</div>} {!owned ? ( <div className="flex flex-col items-start"> <div className="text-xs text-purple-400 font-mono flex items-center gap-1 mt-1"><SafeIcon icon={Icons.Gem} size={10}/> {item.price}</div> <span className="text-[9px] text-zinc-500 uppercase font-black">À vie</span> </div> ) : ( <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold mt-1"> <SafeIcon icon={Icons.CheckCircle} size={10} /> POSSÉDÉ </div> )} </div> </div> <Button onClick={() => buyItem(item)} className={`py-2 px-4 text-xs w-full ${owned ? (equipped && type !== 'phrase' && type !== 'grade' && type !== 'legend' ? 'bg-green-600 border-green-500' : 'bg-zinc-700 border-zinc-600') : type === 'legend' ? 'bg-gradient-to-r from-yellow-600 to-amber-800 border-yellow-500 text-white' : 'bg-purple-600 border-purple-500'}`}> {owned ? (type === 'phrase' || type === 'grade' || type === 'legend' ? 'POSSÉDÉ' : equipped ? 'ÉQUIPÉ' : 'METTRE') : 'ACHETER'} </Button> </div> ) })} </div> );
    return (
        <div className="flex flex-col h-full p-4 md:p-6 relative bg-slate-950 overflow-y-auto text-white font-sans">
            {showingAd && <AdOverlay onClose={() => setShowingAd(false)} onReward={handleAdReward} />}
            <div className="flex justify-between items-center mb-6"><button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-white/10"><SafeIcon icon={Icons.ChevronLeft} size={32} /></button><div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 overflow-x-auto custom-scrollbar"><button onClick={() => setTab('coins')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'coins' ? 'bg-yellow-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Pièces</button><button onClick={() => setTab('gems')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'gems' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Banque</button><button onClick={() => setTab('vip')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'vip' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>VIP</button><button onClick={() => setTab('legends')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'legends' ? 'bg-gradient-to-r from-zinc-800 to-black text-yellow-500 border border-yellow-600 shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Légendes</button><button onClick={() => setTab('grades')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'grades' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Grades</button><button onClick={() => setTab('avatars')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'avatars' ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Avatars</button><button onClick={() => setTab('skins')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'skins' ? 'bg-cyan-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Dominos</button><button onClick={() => setTab('boards')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'boards' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Tapis</button><button onClick={() => setTab('phrases')} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${tab === 'phrases' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Paroles</button></div><div className="flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30 whitespace-nowrap"><SafeIcon icon={Icons.Gem} size={14} className="text-purple-400"/> <span className="font-mono font-bold text-purple-200">{user.wallet.gems}</span></div></div>
            <div className="flex-1 max-w-4xl mx-auto w-full pt-4 pb-12">
                {tab === 'coins' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Pièces <span className="text-yellow-500">Gratuites</span></h2> <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden max-w-sm mx-auto mt-8"> <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-lg">OFFRE SPÉCIALE</div> {user.isVip ? ( <div className="w-20 h-20 bg-yellow-600/20 rounded-full flex items-center justify-center mb-4 border border-yellow-500/50"><SafeIcon icon={Icons.Crown} size={40} className="text-yellow-500" /></div> ) : ( <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/50"><SafeIcon icon={Icons.Play} size={40} className="text-blue-500" /></div> )} <h3 className="text-xl font-black text-white uppercase mb-1"> {user.isVip ? "Bonus Quotidien VIP" : "Visionner une Pub"} </h3> <p className="text-zinc-400 text-xs mb-6 max-w-xs"> {user.isVip ? "En tant que membre VIP, récupérez vos pièces instantanément !" : "Regardez une vidéo de 30 secondes pour soutenir l'association et recevoir votre récompense."} </p> <div className="text-4xl font-black text-yellow-500 mb-6 flex items-center gap-2">+500 <SafeIcon icon={Icons.Coins} size={32} /></div> <Button onClick={handleWatchAd} variant={user.isVip ? "vip" : "ad"} className="w-full text-lg py-4"> {user.isVip ? <><SafeIcon icon={Icons.Zap} size={20} className="fill-current" /> RÉCLAMER (VIP)</> : <><SafeIcon icon={Icons.Play} size={20} className="fill-current" /> REGARDER (30s)</>} </Button> </div> </> )}
                {tab === 'vip' && ( <> <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter text-center italic text-yellow-500 flex items-center justify-center gap-3"><SafeIcon icon={Icons.Crown} size={32} /> Pass VIP</h2> <div className="bg-gradient-to-br from-yellow-900/50 to-amber-900/20 border border-yellow-600/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl max-w-sm mx-auto"> <div className="absolute top-0 right-0 p-10 bg-yellow-500/10 rounded-bl-[100px] -mr-10 -mt-10"></div> <div className="flex flex-col gap-4 mb-8"> <div className="flex items-center gap-3 text-white"> <div className="p-2 bg-yellow-500/20 rounded-lg"><SafeIcon icon={Icons.Play} size={20} className="text-yellow-400"/></div> <span className="font-bold text-sm">Plus de publicités</span> </div> <div className="flex items-center gap-3 text-white"> <div className="p-2 bg-yellow-500/20 rounded-lg"><SafeIcon icon={Icons.Zap} size={20} className="text-yellow-400"/></div> <span className="font-bold text-sm">Bonus instantanés</span> </div> <div className="flex items-center gap-3 text-white"> <div className="p-2 bg-yellow-500/20 rounded-lg"><SafeIcon icon={Icons.Crown} size={20} className="text-yellow-400"/></div> <span className="font-bold text-sm">Pseudo Doré</span> </div> <div className="flex items-center gap-3 text-white"> <div className="p-2 bg-yellow-500/20 rounded-lg"><SafeIcon icon={Icons.TrendingUp} size={20} className="text-yellow-400"/></div> <span className="font-bold text-sm">Stats Détaillées</span> </div> </div> {user.isVip ? ( <div className="bg-green-600/20 border border-green-500 text-green-400 font-black text-center py-4 rounded-xl uppercase tracking-widest"> ACTIF </div> ) : ( <Button onClick={buyVip} variant="vip" className="w-full text-xl py-5"> S'ABONNER 4,99€ / MOIS </Button> )} <p className="text-[10px] text-zinc-500 text-center mt-4">Sans engagement. Annulable à tout moment.</p> </div> </> )}
                {tab === 'gems' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Recharger <span className="text-purple-500">Gemmes</span></h2> <div className="grid grid-cols-3 gap-6 mt-8"> {gemPacks.map(pack => ( <div key={pack.id} className={`relative p-6 rounded-xl shadow-2xl border-2 flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform ${pack.color}`} onClick={() => buyGems(pack)}> {pack.popular && <div className="absolute -top-3 bg-red-600 text-white font-black px-3 py-1 rounded text-[10px] tracking-widest shadow-lg">POPULAIRE</div>} <SafeIcon icon={Icons.Gem} size={40} className="text-purple-400 mb-4" /> <div className="text-3xl font-black mb-1 text-white">{pack.amount}</div> <Button className="w-full mt-auto text-lg">{pack.price}</Button> </div> ))} </div> </> )}
                {tab === 'legends' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic text-yellow-500">Bots <span className="text-white">Légendaires</span></h2> <p className="text-center text-zinc-500 text-xs mb-6">Affrontez des IA avec des stratégies uniques.</p> {renderItems('legend')} </> )}
                {tab === 'grades' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Grades <span className="text-orange-500">VIP</span></h2> <p className="text-center text-zinc-500 text-xs mb-2">Débloquez des fonctionnalités exclusives.</p> {renderItems('grade')} </> )}
                {tab === 'skins' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Style <span className="text-cyan-500">Dominos</span></h2> {renderItems('skin')} </> )}
                {tab === 'avatars' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Vos <span className="text-blue-500">Avatars</span></h2> {renderItems('avatar')} </> )}
                {tab === 'boards' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Style <span className="text-green-500">Tapis</span></h2> {renderItems('board')} </> )}
                {tab === 'phrases' && ( <> <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-center italic">Paroles <span className="text-red-500">Choc</span></h2> <p className="text-center text-zinc-500 text-xs mb-2">Achetez des phrases cultes pour narguer vos adversaires.</p> {renderItems('phrase')} </> )}
            </div>
        </div>
    );
};

const SetupScreen = ({ onBack, onStart, user, mode = 'solo' }) => {
  const [format, setFormat] = useState('manches');
  const [target, setTarget] = useState(3);
  const [stake, setStake] = useState(100);
  const [difficulty, setDifficulty] = useState('easy');
  const [privacy, setPrivacy] = useState('public');

  const stakePresets = [50, 100, 500];
  // AJOUT : Presets pour le mode cochons (2, 3, 4)
  const targetPresets = format === 'manches' ? [1, 2, 3] : format === 'cochons' ? [2, 3, 4] : [5, 10, 15];
 
  const hasExpertLicense = user.inventory.includes('license_expert');
  const hasManX = user.inventory.includes('bot_manx');
 
  useEffect(() => { setTarget(format === 'manches' ? 3 : format === 'cochons' ? 2 : 15); }, [format]);
 
  const handleStart = () => {
      if (difficulty === 'expert' && !hasExpertLicense) { alert("Niveau Expert verrouillé ! Achetez la Licence Pro en boutique."); return; }
      if (difficulty === 'legend' && !hasManX) { alert("Niveau Légende verrouillé ! Achetez Man'X en boutique."); return; }
      if(target <= 0) { alert("L'objectif doit être supérieur à 0 !"); return; }
      if(stake <= 0) { alert("La mise doit être supérieure à 0 !"); return; }
      onStart({ format, target, stake, currency: 'gold', difficulty });
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 relative bg-zinc-950 overflow-y-auto text-white text-center font-sans">
      <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-white/10"><SafeIcon icon={Icons.ChevronLeft} size={32} /></button>
      <div className="flex-1 flex flex-col items-center max-w-lg mx-auto w-full pt-8 pb-12 text-center">
        <h2 className="text-2xl md:text-4xl font-black mb-8 uppercase tracking-tighter italic">{mode === 'multi' ? 'CRÉER' : 'CONFIG'} <span className="text-red-600">TABLE</span></h2>
       
        {/* SECTION PUBLIC/PRIVE (INTACTE) */}
        {mode === 'multi' && (
            <div className="w-full mb-8">
                <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-black mb-4 block text-center">Confidentialité du Salon</label>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto mb-6">
                    <button onClick={() => setPrivacy('public')} className={`p-4 rounded border-2 transition-all flex flex-col items-center gap-1 ${privacy === 'public' ? 'bg-zinc-800 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-black/40 border-zinc-800 text-zinc-600'}`}>
                        <SafeIcon icon={Icons.Wifi} size={24} />
                        <span className="font-black tracking-widest text-xs mt-1">PUBLIC</span>
                    </button>
                    <button onClick={() => setPrivacy('private')} className={`p-4 rounded border-2 transition-all flex flex-col items-center gap-1 ${privacy === 'private' ? 'bg-zinc-800 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-black/40 border-zinc-800 text-zinc-600'}`}>
                        <SafeIcon icon={Icons.Lock} size={24} />
                        <span className="font-black tracking-widest text-xs mt-1">PRIVÉ</span>
                    </button>
                </div>
                {privacy === 'private' && (
                    <div className="bg-zinc-900/80 border border-zinc-700 p-4 rounded-xl max-w-md mx-auto animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-zinc-400 uppercase font-bold">Code d'accès</span>
                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Actif</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-black p-3 rounded border border-zinc-700 font-mono text-xl font-black text-center tracking-[0.2em] text-white select-all">972-MDC</div>
                            <Button onClick={() => alert("Lien d'invitation copié !")} className="py-2 px-4 text-xs bg-blue-600 border-blue-500"><SafeIcon icon={Icons.Settings} size={14} className="mr-1"/> COPIER</Button>
                        </div>
                        <p className="text-[9px] text-zinc-600 mt-2 italic text-left">Envoyez ce lien à vos amis pour rejoindre.</p>
                    </div>
                )}
            </div>
        )}

        <div className="w-full mb-8">
            <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-black mb-4 block text-center">Niveau de l'IA</label>
            <div className="flex gap-2 justify-center flex-wrap">
                <button onClick={() => setDifficulty('easy')} className={`p-3 rounded-lg border-2 flex-1 min-w-[80px] text-xs font-bold uppercase transition-all ${difficulty === 'easy' ? 'bg-green-600 border-green-400 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>Débutant</button>
                <button onClick={() => setDifficulty('medium')} className={`p-3 rounded-lg border-2 flex-1 min-w-[80px] text-xs font-bold uppercase transition-all ${difficulty === 'medium' ? 'bg-yellow-600 border-yellow-400 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>Moyen</button>
                <button onClick={() => setDifficulty('expert')} className={`p-3 rounded-lg border-2 flex-1 min-w-[80px] text-xs font-bold uppercase transition-all relative overflow-hidden ${difficulty === 'expert' ? 'bg-red-600 border-red-400 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>Expert {!hasExpertLicense && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]"><SafeIcon icon={Icons.Lock} size={16} className="text-white" /></div>)}</button>
                <button onClick={() => setDifficulty('legend')} className={`p-3 rounded-lg border-2 flex-1 min-w-[80px] text-xs font-black uppercase transition-all relative overflow-hidden ${difficulty === 'legend' ? 'bg-yellow-600 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>Légende {!hasManX && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]"><SafeIcon icon={Icons.Lock} size={16} className="text-white" /></div>)}</button>
            </div>
        </div>

        {/* FORMAT DE JEU AVEC LE BOUTON COCHONS */}
        <div className="w-full mb-8">
            <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-black mb-4 block text-center">Format de jeu</label>
            <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
                <button onClick={() => setFormat('manches')} className={`p-2 py-4 rounded border-2 transition-all flex flex-col items-center gap-1 ${format === 'manches' ? 'bg-zinc-800 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-black/40 border-zinc-800 text-zinc-600'}`}>
                    <span className="font-black tracking-widest text-[10px]">MANCHES</span>
                    <span className="text-[8px] leading-tight">Premier à X vict.</span>
                </button>
                <button onClick={() => setFormat('points')} className={`p-2 py-4 rounded border-2 transition-all flex flex-col items-center gap-1 ${format === 'points' ? 'bg-zinc-800 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-black/40 border-zinc-800 text-zinc-600'}`}>
                    <span className="font-black tracking-widest text-[10px]">SCORE</span>
                    <span className="text-[8px] leading-tight">Premier à X pts</span>
                </button>
                {/* NOUVEAU BOUTON COCHONS */}
                <button onClick={() => setFormat('cochons')} className={`p-2 py-4 rounded border-2 transition-all flex flex-col items-center gap-1 ${format === 'cochons' ? 'bg-zinc-800 border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-black/40 border-zinc-800 text-zinc-600'}`}>
                    <span className="text-xl leading-none">🐷</span>
                    <span className="font-black tracking-widest text-[10px]">COCHONS</span>
                    <span className="text-[8px] leading-tight">Objectif X Cochons</span>
                </button>
            </div>
        </div>

        <div className="w-full mb-8">
            <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-black mb-4 block text-center">
                {format === 'manches' ? 'Nombre de manches gagnantes' : format === 'cochons' ? 'Nombre de cochons à atteindre' : 'Score à atteindre (MDC)'}
            </label>
            <div className="flex justify-between gap-3 max-w-md mx-auto">
                {targetPresets.map(v => ( <button key={v} onClick={() => setTarget(v)} className={`flex-1 py-4 rounded border-2 font-mono font-black text-lg transition-all ${target === v ? 'bg-white text-black border-white' : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'}`}>{v}</button> ))}
                <div className={`flex-1 relative rounded border-2 transition-all ${!targetPresets.includes(target) ? 'bg-white border-white' : 'bg-black/40 border-zinc-800'}`}><input type="number" placeholder="X" className={`w-full h-full bg-transparent text-center font-mono font-black text-lg focus:outline-none ${!targetPresets.includes(target) ? 'text-black placeholder:text-black/30' : 'text-zinc-500 hover:text-white placeholder:text-zinc-600'}`} value={!targetPresets.includes(target) ? target : ''} onChange={(e) => setTarget(parseInt(e.target.value) || 0)} /></div>
            </div>
        </div>

        <div className="w-full mb-8">
            <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-black mb-4 block text-center">Mise par partie (Monnaie Virtuelle)</label>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {stakePresets.map(s => ( <button key={s} onClick={() => setStake(s)} className={`py-4 rounded border-2 font-mono font-black transition-all ${stake === s ? 'bg-zinc-800 border-yellow-500 text-yellow-500' : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'}`}>{s} <span className="text-[10px]">Or</span></button> ))}
                <div className={`relative rounded border-2 transition-all ${!stakePresets.includes(stake) ? 'bg-zinc-800 border-yellow-500' : 'bg-black/40 border-zinc-800'}`}><input type="number" placeholder="X" className={`w-full h-full bg-transparent text-center font-mono font-black text-sm focus:outline-none ${!stakePresets.includes(stake) ? 'text-yellow-500 placeholder:text-yellow-500/30' : 'text-zinc-500 hover:text-white placeholder:text-zinc-600'}`} value={!stakePresets.includes(stake) ? stake : ''} onChange={(e) => setStake(parseInt(e.target.value) || 0)} /></div>
            </div>
        </div>
        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-12">Règles : Sens Anti-horaire (Martinique)</div>
        <Button onClick={handleStart} className="w-full py-5 text-xl max-w-md mx-auto">{mode === 'multi' ? 'OUVRIR LE SALON' : 'LANCER LA PARTIE'}</Button>
      </div>
    </div>
  );
};

// ... GameScreen ... (Same as provided above)
const GameScreen = ({ config, onExit, onWin, onPartieEnd, user, onDoubleWin }) => {
 
  // --- GESTION ADVERSAIRES ---
  let bot1Name, bot2Name;
  if (config.customOpponents && config.customOpponents.length === 2) {
      bot1Name = config.customOpponents[0].pseudo;
      bot2Name = config.customOpponents[1].pseudo;
  }
  else {
      bot1Name = config.difficulty === 'legend' ? "Man'X le Président" : config.difficulty === 'expert' ? "Chaton la tigresse" : "Chaton";
      bot2Name = config.difficulty === 'legend' ? "Valou le Redoutable" : config.difficulty === 'expert' ? "Olivier le blagueur" : "Olivier";
  }

  const getInitData = (pName) => {
      const history = (config.previousScores && config.previousScores[pName]) ? config.previousScores[pName] : [];
      const total = history.reduce((a, b) => a + b, 0);
      return { history, total };
  };

  const p0Data = getInitData(user.pseudo);
  const p1Data = getInitData(bot1Name);
  const p2Data = getInitData(bot2Name);

  const [gameState, setGameState] = useState({
    players: [
      // AJOUT DE 'cochonsTotal' POUR TOUS
      { id: 0, name: user.pseudo, type: 'human', hand: [], mdcPoints: p0Data.total, cochonsTotal: 0, wins: 0, isBoude: false, mancheHistory: p0Data.history, label: null, initialMaxDouble: -1 },
      { id: 1, name: bot1Name, type: 'bot', hand: [], mdcPoints: p1Data.total, cochonsTotal: 0, wins: 0, isBoude: false, mancheHistory: p1Data.history, label: null, initialMaxDouble: -1 },
      { id: 2, name: bot2Name, type: 'bot', hand: [], mdcPoints: p2Data.total, cochonsTotal: 0, wins: 0, isBoude: false, mancheHistory: p2Data.history, label: null, initialMaxDouble: -1 }
    ],
    board: [], ends: null, turnIndex: 0, status: 'dealing', currentManche: 1, currentPartie: 1, winnerId: null, pendingChoice: null, history: [], mandatoryTile: null
  });

  const [timeLeft, setTimeLeft] = useState(15);
  const [zoomScale, setZoomScale] = useState(0.6);
  const [showChat, setShowChat] = useState(false);
  const [lastChatMessage, setLastChatMessage] = useState(null);
  const [adWatchedForThisWin, setAdWatchedForThisWin] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [winningInfo, setWinningInfo] = useState(null);
 
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const paidRef = useRef(false);

  const ownedPhrases = MOCK_DB.items.filter(i => i.type === 'phrase' && user.inventory.includes(i.id));
  const currentBoard = MOCK_DB.items.find(i => i.id === user.equippedBoard) || MOCK_DB.items.find(i => i.id === 'board_classic');

  useEffect(() => { startRound(1, 1); }, []);

  useEffect(() => {
    let timer;
    if (gameState.status === 'playing' && timeLeft > 0 && !gameState.pendingChoice) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && gameState.status === 'playing') {
      const p = gameState.players[gameState.turnIndex];
      const moves = getValidMoves(p.hand, gameState.ends);
      if (moves.length > 0) playTile(p.id, moves[0].tile, moves[0].side);
      else passTurn(p.id);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState.status, gameState.pendingChoice, gameState.turnIndex]);

  // NOUVEAU : Gère le délai de 1.5s entre la fin du jeu et l'apparition de la bannière victoire
  useEffect(() => {
      if (gameState.status === 'revealing') {
          const t = setTimeout(() => {
              setGameState(prev => ({ ...prev, status: 'winning_animation' }));
          }, 1500); // 1.5 secondes pour voir les dominos adverses
          return () => clearTimeout(t);
      }
  }, [gameState.status]);

  useEffect(() => {
      if (gameState.status === 'winning_animation') {
          const t = setTimeout(() => {
              setGameState(prev => resolvePartieEnd(prev, prev.players, prev.winnerId));
              setWinningInfo(null);
          }, 3000);
          return () => clearTimeout(t);
      }
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status === 'playing' && gameState.turnIndex === 0) {
      const moves = getValidMoves(gameState.players[0].hand, gameState.ends);
      if (!gameState.mandatoryTile && moves.length === 0 && gameState.board.length > 0) {
        const t = setTimeout(() => passTurn(0), 1000);
        return () => clearTimeout(t);
      }
    }
  }, [gameState.turnIndex, gameState.ends, gameState.status, gameState.board.length, gameState.mandatoryTile]);

  useEffect(() => {
      if (gameState.status === 'tournoi_over' && gameState.winnerId === 0 && !paidRef.current) {
          paidRef.current = true;
          // MODIFICATION : Le gain est égal à la MISE multipliée par le NOMBRE DE JOUEURS (ex: 100 * 3 = 300)
          onWin(config.stake * gameState.players.length, config.currency);
      }
  }, [gameState.status, gameState.winnerId]);

  useEffect(() => {
      if (gameState.status === 'playing' && gameState.history.length > 0) {
          const currentId = gameState.turnIndex;
          const prevId = (currentId + 1) % 3;
          const prevPlayer = gameState.players[prevId];
          const lastLog = gameState.history[0];

          if (prevPlayer.name.includes("Man'X") && lastLog.player === prevPlayer.name && lastLog.action === 'Posé') {
              const currentPlayer = gameState.players[currentId];
              const moves = getValidMoves(currentPlayer.hand, gameState.ends);
              if (moves.length === 0 && currentPlayer.hand.length > 0) {
                  setLastChatMessage({ playerId: prevId, text: "I fèw mal Doudou !" });
                  setTimeout(() => setLastChatMessage(null), 4000);
              }
          }
      }
  }, [gameState.turnIndex, gameState.status, gameState.history]);

  // Zoom Optimisé (CORRIGÉ : Marges de sécurité augmentées pour éviter que le dernier domino ne sorte)
  useEffect(() => {
    const calculateZoom = () => {
        if (boardRef.current && containerRef.current) {
          const boardWidth = boardRef.current.scrollWidth;
          const containerWidth = containerRef.current.clientWidth;
          const boardHeight = boardRef.current.scrollHeight;
          const containerHeight = containerRef.current.clientHeight;
         
          const isLandscape = containerWidth > containerHeight;
         
          // MODIFICATION ICI : On passe de 0.85 à 0.75 (75% de l'écran max)
          // Cela crée une "zone tampon" de 12.5% de chaque côté.
          const safeWidth = containerWidth * (isLandscape ? 0.70 : 0.75);
          const safeHeight = containerHeight * (isLandscape ? 0.60 : 0.55);
         
          // On garde la limite max à 0.6 pour ne pas que ce soit trop gros au début
          const calculatedZoom = Math.min(safeWidth / boardWidth, safeHeight / boardHeight, 0.8);
          setZoomScale(calculatedZoom);
        }
    };
    // On garde le délai pour laisser le temps au DOM de s'agrandir avant de mesurer
    setTimeout(calculateZoom, 50);
  }, [gameState.board, gameState.turnIndex]);

  const addLog = (log) => {
    setGameState(prev => ({
        ...prev,
        history: [{ ...log, id: Date.now() }, ...prev.history].slice(0, 30)
    }));
  };

  const handleSendChat = (text) => {
      setLastChatMessage({ playerId: 0, text });
      setShowChat(false);
      setTimeout(() => setLastChatMessage(null), 3000);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
            console.log("Erreur plein écran:", e);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  const handleScreenshot = () => {
      alert("📸 Capture d'écran sauvegardée dans la galerie ! (Simulation)");
  };

  const handleDoubleReward = () => {
      setShowAdOverlay(true);
  };

  const onAdCompleted = () => {
      setAdWatchedForThisWin(true);
      // MODIFICATION : On ajoute le montant du pot une 2ème fois pour doubler le gain total
      onDoubleWin(config.stake * gameState.players.length, config.currency);
      alert("Gain Doublé !");
  };


  const startRound = (mancheNum, partieNum, forcedStarterId = -1) => {
    const allTiles = generateDominoes();
    const hands = [allTiles.slice(0, 7), allTiles.slice(7, 14), allTiles.slice(14, 21)];
   
    let starterIndex = forcedStarterId;
    let maxDTotal = -1;
    let starterTile = null;

    const playersWithDoubles = hands.map((hand, pIdx) => {
        let pMaxD = -1;
        hand.forEach(t => { if (t.v1 === t.v2 && t.v1 > pMaxD) pMaxD = t.v1; });
        if (pMaxD > maxDTotal && starterIndex === -1) {
            maxDTotal = pMaxD;
            starterIndex = pIdx;
        }
        return { pIdx, maxD: pMaxD };
    });

    if (forcedStarterId !== -1) starterIndex = forcedStarterId;
    else starterTile = hands[starterIndex].find(t => t.v1 === t.v2 && t.v1 === maxDTotal);

    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) => ({ ...p, hand: hands[i], isBoude: false, initialMaxDouble: playersWithDoubles[i].maxD })),
      board: [], ends: null, status: 'playing', turnIndex: starterIndex, currentManche: mancheNum, currentPartie: partieNum, winnerId: null, pendingChoice: null,
      mandatoryTile: (forcedStarterId === -1 && starterTile) ? starterTile : null
    }));
    setTimeLeft(15);
    addLog({ player: 'SYSTÈME', action: `Début Partie ${partieNum}`, info: `Distrib.` });
    if (forcedStarterId === -1 && starterTile) setTimeout(() => { playTile(starterIndex, starterTile, 'start'); }, 2000);
  };

  useEffect(() => {
    if (gameState.status !== 'playing' || gameState.pendingChoice) return;
    const player = gameState.players[gameState.turnIndex];
    if (player.type === 'bot') {
      const timer = setTimeout(() => {
        const aiLevel = player.name.includes("Valou") ? 'valou_legend' : (config.difficulty || 'easy');
        const move = getBotMove(player.hand, gameState.ends, aiLevel);
        if (move) playTile(player.id, move.tile, move.side);
        else passTurn(player.id);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.turnIndex, gameState.status, gameState.pendingChoice]);

  const passTurn = (id) => {
    const playerName = gameState.players[id].name;
    addLog({ player: playerName, action: 'BOUDÉ', type: 'alert' });
    setGameState(prev => {
        const newPlayers = prev.players.map(p => p.id === id ? { ...p, isBoude: true } : p);
        const allBlocked = newPlayers.every(p => p.isBoude || p.hand.length === 0);
        if (allBlocked) {
            const scores = newPlayers.map(p => ({ id: p.id, points: calculateHandPoints(p.hand) }));
            const minPoints = Math.min(...scores.map(s => s.points));
            const winners = scores.filter(s => s.points === minPoints);
            if (winners.length > 1) {
                addLog({ player: 'SYSTÈME', action: 'ÉGALITÉ TOTALE', type: 'alert' });
                return { ...prev, status: 'partie_draw', players: newPlayers };
            } else {
                return resolvePartieEnd(prev, newPlayers, winners[0].id);
            }
        }
        return { ...prev, turnIndex: (prev.turnIndex + 2) % 3, players: newPlayers };
    });
    setTimeLeft(15);
  };

  // --- LOGIQUE FIN DE PARTIE & COCHONS ---
  const resolvePartieEnd = (prevState, currentPlayers, winnerId) => {
      const winnerName = currentPlayers[winnerId].name;
      addLog({ player: winnerName, action: 'GAGNE LA PARTIE', type: 'success' });
      if (onPartieEnd) onPartieEnd(winnerId);

      const withWins = currentPlayers.map(p => ({ ...p, wins: p.id === winnerId ? p.wins + 1 : p.wins }));
      const hasKO = withWins.some(p => p.wins >= 3);
      const everyoneWonOnce = withWins.every(p => p.wins >= 1);

      if (hasKO || everyoneWonOnce) {
          const maxW = Math.max(...withWins.map(p => p.wins));
          const mancheWinnerId = withWins.find(p => p.wins === maxW).id;
          const numCochons = withWins.filter(p => p.wins === 0).length;
         
          const finalMdcManche = withWins.map(p => {
              let mdcGain = p.wins;
              let label = "";
             
              if (p.id === mancheWinnerId) {
                  if (numCochons === 2) { mdcGain = 5; label = "DOUBLE COCHON !!"; }
                  else if (numCochons === 1) { mdcGain = 4; label = "COCHON !"; }
              } else if (p.wins === 0) { mdcGain = -1; label = "COCHON PRIS (-1)"; }

              // LOGIQUE SPECIALE COCHONS
              let newCochonsTotal = p.cochonsTotal || 0;
              if (config.format === 'cochons' && p.id === mancheWinnerId) {
                  if (mdcGain === 5) {
                      newCochonsTotal += 2;
                      label = "2 COCHONS DONNÉS !";
                  } else if (mdcGain === 4) {
                      newCochonsTotal += 1;
                      label = "1 COCHON DONNÉ !";
                  } else {
                      label = "Pas de cochon...";
                  }
              }

              return { ...p, mdcPoints: p.mdcPoints + mdcGain, cochonsTotal: newCochonsTotal, gain: mdcGain, label, mancheHistory: [...p.mancheHistory, mdcGain] };
          });

          // VERIFICATION VICTOIRE
          let isTournoiFini = false;
          if (config.mode === 'tournament') isTournoiFini = false;
          else if (config.format === 'cochons') isTournoiFini = finalMdcManche.some(p => p.cochonsTotal >= config.target);
          else if (config.format === 'manches') isTournoiFini = prevState.currentManche >= config.target;
          else isTournoiFini = finalMdcManche.some(p => p.mdcPoints >= config.target);

          return { ...prevState, players: finalMdcManche, status: isTournoiFini ? 'tournoi_over' : 'manche_over', winnerId, mancheScoreMDC: finalMdcManche };
      }
      return { ...prevState, players: withWins, status: 'partie_over', winnerId };
  };

  const playTile = (id, tile, side) => {
    // MODIFICATION : Son "Clac" plus réaliste (type domino sur table)
    // Source fiable Google (Wood Plank Flick) qui ressemble beaucoup à un domino
    const audio = new Audio('https://actions.google.com/sounds/v1/impacts/wood_plank_flick.ogg');
    
    // ASTUCE DE PRO : On change légèrement la vitesse (entre 0.9 et 1.1) à chaque coup
    // pour que le son ne soit jamais exactement le même (effet naturel)
    audio.playbackRate = 0.9 + Math.random() * 0.2;
    audio.volume = 1.0;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => { console.log("Audio bloqué:", error); });
    }
    const playerName = gameState.players[id].name;
    addLog({ player: playerName, action: 'Posé', info: `[${tile.v1}|${tile.v2}]` });
    
    // ... Le reste de la fonction reste STRICTEMENT identique ...
    const isWin = gameState.players[id].hand.length === 1 && gameState.players[id].hand[0].id === tile.id;
    if (isWin) {
        setWinningInfo({ winnerId: id, winningTile: tile });
    }
    setGameState(prev => {
      let newBoard = [...prev.board];
      let newEnds = prev.ends ? { ...prev.ends } : { left: null, right: null };
// MODIFICATION : On ajoute 'placedAt: Date.now()' pour forcer le rafraîchissement de l'animation
      let placed = { ...tile, orientation: (tile.v1 === tile.v2) ? 'vertical' : 'horizontal', flipped: false, sourcePlayerId: id, placedAt: Date.now() };
      if (!prev.ends) { newBoard = [placed]; newEnds = { left: tile.v1, right: tile.v2 }; }
      else {
        if (side === 'left') { placed.flipped = (tile.v1 === newEnds.left); newEnds.left = placed.flipped ? tile.v2 : tile.v1; newBoard.unshift(placed); }
        else { placed.flipped = (tile.v2 === newEnds.right); newEnds.right = placed.flipped ? tile.v1 : tile.v2; newBoard.push(placed); }
      }
      const newPlayers = prev.players.map(p => p.id === id ? { ...p, hand: p.hand.filter(h => h.id !== tile.id), isBoude: false } : p);
     
      if (newPlayers[id].hand.length === 0) {
          return {
              ...prev,
              players: newPlayers,
              board: newBoard,
              ends: newEnds,
              // MODIFICATION : On passe en 'revealing' au lieu de 'winning_animation'
              status: 'revealing', 
              winnerId: id,
              pendingChoice: null,
              mandatoryTile: null
          };
      }
     
      return { ...prev, players: newPlayers, board: newBoard, ends: newEnds, turnIndex: (prev.turnIndex + 2) % 3, pendingChoice: null, mandatoryTile: null };
    });
    setTimeLeft(15);
  };

  const humanHand = gameState.players[0].hand;
  const isMyTurn = gameState.turnIndex === 0 && gameState.status === 'playing';

  return (
    <div className={`fixed inset-0 w-full h-full z-50 bg-slate-950 overflow-hidden text-white font-sans ${currentBoard.style} transition-colors duration-500`}>
      {showAdOverlay && <AdOverlay onClose={() => setShowAdOverlay(false)} onReward={onAdCompleted} />}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-20 mix-blend-overlay"></div>
     
      {currentBoard.id === 'board_xmas' && (
          <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-between px-10">
              <SafeIcon icon={Icons.Snowflake} className="animate-bounce text-white w-8 h-8 opacity-50" style={{animationDuration:'3s'}} />
              <SafeIcon icon={Icons.Snowflake} className="animate-bounce text-white w-12 h-12 opacity-30" style={{animationDuration:'5s'}} />
              <SafeIcon icon={Icons.Snowflake} className="animate-bounce text-white w-6 h-6 opacity-60" style={{animationDuration:'4s'}} />
          </div>
      )}

      {/* HEADER (Objectif déplacé à droite pour meilleure visibilité) */}
      <div className="absolute top-0 left-0 w-full z-[60] flex justify-between items-center px-4 h-12 bg-black/40 backdrop-blur-md border-b border-white/5 shadow-2xl">
          
          {/* GAUCHE : Quitter */}
          <Button variant="ghost" onClick={onExit} className="p-1"><SafeIcon icon={Icons.X} size={24} /></Button>
          
          {/* CENTRE : Timer Seul (Plus gros et centré) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <span className="text-3xl font-black font-mono text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest">
                  {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
          </div>

          {/* DROITE : Objectif + Mise + Plein écran */}
          <div className="flex items-center gap-2">
              
              {/* NOUVEL EMPLACEMENT : Objectif (Badge Bleu/Visible) */}
              <div className="flex flex-col items-end mr-1 bg-blue-900/40 px-2 py-1 rounded border border-blue-500/30">
                  <span className="text-[8px] text-blue-200 font-bold uppercase leading-none mb-0.5">Objectif</span>
                  <span className="text-xs font-black text-white leading-none">
                      {config.target} {config.format === 'manches' ? 'VICT.' : config.format === 'cochons' ? '🐷' : 'PTS'}
                  </span>
              </div>

              <span className="text-[10px] text-yellow-500 font-black font-mono bg-black/50 px-2 py-1.5 rounded border border-yellow-500/30 shadow-inner">
                  {config.stake} OR
              </span>
              
              <button onClick={toggleFullScreen} className="p-2 bg-black/30 rounded hover:bg-white/10 transition-colors border border-white/5">
                  <SafeIcon icon={Icons.Maximize} size={18} className="text-zinc-300" />
              </button>
          </div>
      </div>
     
      {/* TAPIS */}
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative pt-32 pb-[25vh]" ref={containerRef}>
          {currentBoard.id === 'board_sponsor' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
                  <div className="flex flex-col items-center">
                      <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Rhumerie 972</h1>
                      <p className="text-sm md:text-xl uppercase tracking-widest text-zinc-300">Sponsor Officiel</p>
                  </div>
              </div>
          )}
         
          {/* BANNIERE VICTOIRE ANIMATION */}
          {gameState.status === 'winning_animation' && winningInfo && (
            <div className="absolute inset-0 z-[250] flex flex-col items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                <div className="bg-black/80 backdrop-blur-lg p-8 rounded-3xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.6)] flex flex-col items-center text-center">
                    <SafeIcon icon={Icons.Crown} size={64} className="text-yellow-500 mb-4 animate-bounce" />
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Victoire de</h2>
                    <h3 className="text-3xl md:text-5xl font-black text-yellow-400 uppercase mb-8 drop-shadow-lg">{gameState.players[winningInfo.winnerId].name}</h3>
                    <div className="scale-125 md:scale-150 transform rotate-6">
                        <DominoTile v1={winningInfo.winningTile.v1} v2={winningInfo.winningTile.v2} size="lg" skinId={user.equippedSkin} />
                    </div>
                </div>
            </div>
          )}

          {/* AVATARS PLUS PETITS ET DANS LES COINS */}
          <PlayerAvatar
              name={gameState.players[1].name}
              isBot
              position="top-left"
              active={gameState.turnIndex === 1}
              cardsCount={gameState.players[1].hand.length}
              wins={gameState.players[1].wins}
              isBoude={gameState.players[1].isBoude}
              chatMessage={lastChatMessage?.playerId === 1 ? lastChatMessage.text : null}
              isVip={gameState.players[1].id === 0 ? user.isVip : false}
              equippedAvatar={gameState.players[1].type === 'human' ? user.equippedAvatar : gameState.players[1].name.includes('Chaton') ? 'avatar_robot' : 'avatar_smile'}
              // --- AJOUTS POUR LE MODE COCHON ---
              mdcPoints={gameState.players[1].mdcPoints}
              cochons={gameState.players[1].cochonsTotal}
              isCochonMode={config.format === 'cochons'}
              // AJOUTER CECI :
              hand={gameState.players[1].hand}
              revealed={gameState.status !== 'playing' && gameState.status !== 'dealing' }
          />

          <PlayerAvatar
              name={gameState.players[2].name}
              isBot
              position="top-right"
              active={gameState.turnIndex === 2}
              cardsCount={gameState.players[2].hand.length}
              wins={gameState.players[2].wins}
              isBoude={gameState.players[2].isBoude}
              chatMessage={lastChatMessage?.playerId === 2 ? lastChatMessage.text : null}
              isVip={gameState.players[2].id === 0 ? user.isVip : false}
              equippedAvatar={gameState.players[2].type === 'human' ? user.equippedAvatar : gameState.players[2].name.includes('Olivier') ? 'avatar_king' : 'avatar_classic'}
              // --- AJOUTS POUR LE MODE COCHON ---
              mdcPoints={gameState.players[2].mdcPoints}
              cochons={gameState.players[2].cochonsTotal}
              isCochonMode={config.format === 'cochons'}
              // AJOUTER CECI :
              hand={gameState.players[2].hand}
              revealed={gameState.status !== 'playing' && gameState.status !== 'dealing' }
          />
          {/* ZONE PLATEAU (CORRIGÉE : Alignement Flexbox restauré) */}
          <div className="w-full h-full flex items-center justify-center pointer-events-none relative z-10">
            
            {/* Définition des animations (CSS) */}
            <style>{`
                @keyframes slideFromBottom { 
                    0% { transform: translateY(300px) scale(1.5); opacity: 0; } 
                    100% { transform: translateY(0) scale(1); opacity: 1; } 
                }
                @keyframes slideFromTopLeft { 
                    0% { transform: translate(-300px, -300px) scale(0.5); opacity: 0; } 
                    100% { transform: translate(0, 0) scale(1); opacity: 1; } 
                }
                @keyframes slideFromTopRight { 
                    0% { transform: translate(300px, -300px) scale(0.5); opacity: 0; } 
                    100% { transform: translate(0, 0) scale(1); opacity: 1; } 
                }
                .anim-p0 { animation: slideFromBottom 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .anim-p1 { animation: slideFromTopLeft 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .anim-p2 { animation: slideFromTopRight 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
            `}</style>

            <div ref={boardRef} className="flex items-center justify-center origin-center drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] whitespace-nowrap w-max" style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.5s ease-out' }}>
                {gameState.board.map((tile, i) => {
                    const isNew = (Date.now() - (tile.placedAt || 0)) < 1000;
                    
                    let animClass = "";
                    // On applique l'animation et un z-index élevé pour passer devant
                    if (isNew) {
                        if (tile.sourcePlayerId === 0) animClass = "anim-p0 z-50";
                        else if (tile.sourcePlayerId === 1) animClass = "anim-p1 z-50";
                        else if (tile.sourcePlayerId === 2) animClass = "anim-p2 z-50";
                    }

                    return (
                        <DominoTile
                            key={tile.id}
                            v1={tile.v1}
                            v2={tile.v2}
                            orientation={tile.orientation}
                            flipped={tile.flipped}
                            skinId={user.equippedSkin}
                            // L'animation est appliquée directement ici, sans casser le flex
                            className={`mx-0.5 ${animClass}`}
                        />
                    );
                })}
            </div>
          </div>

          <div className="absolute bottom-[30%] flex gap-6 pointer-events-none z-20">
            {gameState.players.map(p => p.isBoude && (
                <div key={p.id} className="text-red-500 font-black text-[8px] md:text-xs uppercase tracking-widest animate-pulse bg-red-500/10 px-4 md:px-6 py-1 md:py-2 rounded-full border border-red-500/30 shadow-2xl">{p.name} BOUDÉ !!</div>
            ))}
        </div>
      </div>
     
      {/* MAIN JOUEUR */}
      <div className="absolute bottom-0 left-0 w-full h-[18vh] bg-gradient-to-t from-black via-black/90 to-transparent flex items-end pb-2 px-2 overflow-visible z-[100]">
          <div className="w-12 flex items-end pb-2 relative pointer-events-auto mr-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-zinc-800 border-2 border-zinc-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-xl hover:bg-zinc-700 active:scale-95 transition-all"
              >
                  <SafeIcon icon={Icons.MessageCircle} size={16} />
              </button>
             
              {showChat && (
                  <div className="absolute bottom-10 left-0 w-48 bg-zinc-900 border-2 border-zinc-700 rounded-xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 pointer-events-auto">
                      <h3 className="text-[8px] font-black uppercase text-zinc-500 mb-1 px-2">Vos Phrases</h3>
                      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar">
                          {ownedPhrases.length > 0 ? ownedPhrases.map(phrase => (
                              <button
                                key={phrase.id}
                                onClick={() => handleSendChat(phrase.text)}
                                className="text-left text-[10px] font-bold text-white bg-zinc-800 hover:bg-zinc-700 p-2 rounded transition-colors border border-white/5"
                              >
                                  {phrase.text}
                              </button>
                          )) : (
                              <div className="text-[10px] text-zinc-500 p-2 italic text-center">Aucune phrase.<br/>Allez en boutique !</div>
                          )}
                      </div>
                  </div>
              )}
          </div>

          {/* MODIFICATION ICI : justify-start pour aligner à gauche et pl-4 pour décaler un peu du chat */}
          <div className="flex-1 flex justify-start pl-[18%] items-end gap-1 overflow-visible px-0 pointer-events-none pb-2">
           {humanHand.map((tile) => {
              const m = getValidMoves([tile], gameState.ends);
              const canClick = isMyTurn && m.length > 0;
              return (
                <div key={tile.id} className="overflow-visible pointer-events-auto">
                  <DominoTile
                     v1={tile.v1} v2={tile.v2} size="lg" orientation="vertical" skinId={user.equippedSkin} highlight={canClick && !gameState.mandatoryTile} isMandatory={false}
                     onClick={() => {
                         if (gameState.mandatoryTile) return;
                         if (canClick && m.length === 1) playTile(0, tile, m[0].side);
                         else if (canClick && m.length > 1) setGameState(prev => ({ ...prev, pendingChoice: { tile, moves: m } }));
                     }}
                     className={`transform transition-all duration-300 scale-90 origin-bottom ${canClick && !gameState.mandatoryTile ? 'hover:-translate-y-4 cursor-pointer hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'opacity-30 grayscale translate-y-1'}`}
                  />
                </div>
              )
           })}
         </div>
         
         {/* AVATAR JOUEUR (Compact) */}
         <div className="w-auto flex justify-end items-end pb-2 ml-2">
            <PlayerAvatar
                name={user.pseudo}
                position="bottom-right"
                active={isMyTurn}
                cardsCount={humanHand.length}
                wins={gameState.players[0].wins}
                isBoude={gameState.players[0].isBoude}
                chatMessage={lastChatMessage?.playerId === 0 ? lastChatMessage.text : null}
                isVip={user.isVip}
                equippedAvatar={user.equippedAvatar}
                // --- AJOUTS POUR LE MODE COCHON ---
                mdcPoints={gameState.players[0].mdcPoints}
                cochons={gameState.players[0].cochonsTotal}
                isCochonMode={config.format === 'cochons'}
            />
         </div>
         
         {gameState.pendingChoice && (
             <div className="absolute inset-0 z-[200] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center rounded-t-xl pointer-events-auto text-white">
                 <div className="bg-slate-900 border border-yellow-500/50 p-4 rounded-2xl shadow-2xl text-center text-white">
                     <h3 className="font-black uppercase mb-4 tracking-widest text-sm">Côté ?</h3>
                     <div className="flex gap-4">
                         <Button onClick={() => playTile(0, gameState.pendingChoice.tile, 'left')} className="flex-1 py-3 text-xs">GAUCHE</Button>
                         <Button onClick={() => playTile(0, gameState.pendingChoice.tile, 'right')} className="flex-1 py-3 text-xs">DROITE</Button>
                     </div>
                 </div>
             </div>
         )}
      </div>

      {/* MODAL FIN DE MANCHE */}
      {(gameState.status !== 'playing' && gameState.status !== 'dealing' && gameState.status !== 'winning_animation') && (
        <div className="absolute inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-4 text-center backdrop-blur-xl animate-in fade-in duration-500 text-white">
           <div className="bg-slate-900 border-2 border-red-700 p-4 rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden text-white flex flex-col max-h-[85vh]">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
             
             <div className="mb-2">
                 {gameState.status === 'partie_draw' ? <SafeIcon icon={Icons.AlertCircle} size={32} className="text-red-500 mx-auto mb-2 animate-pulse" /> : <SafeIcon icon={Icons.Trophy} size={32} className="text-red-500 mx-auto mb-2 animate-bounce" />}
                 <h2 className="text-xl font-serif font-black uppercase tracking-tighter leading-tight">
                    {gameState.status === 'tournoi_over' ? 'VICTOIRE FINALE' :
                     gameState.status === 'manche_over' ? `Fin Manche ${gameState.currentManche}` :
                     gameState.status === 'partie_draw' ? 'ÉGALITÉ' :
                     `Partie Gagnée par ${gameState.players[gameState.winnerId].name}`}
                 </h2>
             </div>

             <div className="overflow-auto mb-4 bg-black/30 rounded-xl border border-white/5 text-left p-2 custom-scrollbar flex-1">
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr className="border-b border-white/10 text-zinc-500 font-black">
                            <th className="p-2 uppercase text-white sticky top-0 bg-black/80">Joueur</th>
                            {gameState.players[0].mancheHistory.map((_, i) => (
                                <th key={i} className="p-2 text-center text-white sticky top-0 bg-black/80">M{i+1}</th>
                            ))}
                            <th className="p-2 uppercase text-right text-red-500 sticky top-0 bg-black/80">
                                {config.format === 'cochons' ? 'COCHONS' : 'TOTAL'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {gameState.players.map((p) => (
                            <tr key={p.id} className="border-b border-white/5 last:border-0 text-white">
                                <td className="p-2 text-white">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase">{p.name}</span>
                                        {gameState.status === 'manche_over' && p.label && <span className={`text-[6px] font-black ${p.gain === -1 ? 'text-red-400' : 'text-green-400'}`}>{p.label}</span>}
                                        {(gameState.status === 'partie_over' || gameState.status === 'partie_draw' || gameState.status === 'manche_over' || gameState.status === 'tournoi_over') && p.hand.length > 0 && (
                                            <span className="text-[8px] text-zinc-500 font-mono mt-0.5">
                                                Main: <span className="text-yellow-500 font-bold">{calculateHandPoints(p.hand)}</span> pts
                                            </span>
                                        )}
                                    </div>
                                </td>
                                {p.mancheHistory.map((score, i) => (
                                    <td key={i} className={`p-2 text-center font-mono font-black ${score >= 4 ? 'text-green-400' : score === -1 ? 'text-red-500' : 'text-zinc-400'}`}>
                                        {score > 0 ? `+${score}` : score}
                                    </td>
                                ))}
                                <td className={`p-2 text-lg font-mono font-black text-right ${config.format === 'cochons' ? 'text-pink-500' : 'text-yellow-500'}`}>
                                    {config.format === 'cochons' ? `${p.cochonsTotal || 0} 🐷` : p.mdcPoints}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             
             {gameState.status === 'tournoi_over' && gameState.winnerId === 0 && !user.isVip && !adWatchedForThisWin && (
                 <div className="mb-2">
                     <Button onClick={handleDoubleReward} variant="ad" className="w-full text-sm py-3 animate-pulse">
                         <SafeIcon icon={Icons.Play} size={14} className="fill-current" /> DOUBLER (PUB)
                     </Button>
                 </div>
             )}

             <div className="flex gap-2 items-center">
                <button
                    onClick={handleScreenshot}
                    className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-600"
                    title="Prendre une photo"
                >
                    <SafeIcon icon={Icons.Camera} size={18} className="text-white" />
                </button>

                {gameState.status === 'partie_over' || gameState.status === 'partie_draw' ? (
                     <Button
                         onClick={() => startRound(
                             gameState.currentManche,
                             gameState.currentPartie + 1,
                             gameState.winnerId !== null ? gameState.winnerId : -1
                         )}
                         className="flex-1 py-3 text-sm text-blue-950"
                     >
                         DONNE SUIVANTE
                     </Button>
                ) : gameState.status === 'manche_over' ? (
                    <Button onClick={() => {
                        if (config.mode === 'tournament') {
                            onExit(gameState.players);
                        } else {
                            setGameState(prev => ({ ...prev, players: prev.players.map(p => ({ ...p, wins: 0, label: null })), mancheScoreMDC: null }));
                            startRound(gameState.currentManche + 1, 1);
                        }
                    }} className="flex-1 py-3 text-sm text-blue-950">MANCHE SUIVANTE</Button>
                ) : (
                    <Button onClick={onExit} className="flex-1 py-3 text-sm text-blue-200">RETOUR MENU</Button>
                )}
               
                <button
                    onClick={() => {
                        alert("Le tableau reste affiché. Utilisez les boutons pour continuer.");
                    }}
                    className="p-3 bg-zinc-800 rounded-xl hover:bg-red-900/50 transition-colors border border-zinc-600 text-red-400"
                    title="Fermer"
                >
                    <SafeIcon icon={Icons.X} size={18} />
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MemberScreen = ({ onBack, user, onLogout }) => {
    const winRate = user.stats.played > 0 ? ((user.stats.won / user.stats.played) * 100).toFixed(1) : "0.0";
    const [rankingTab, setRankingTab] = useState('cochonsDonnes');

    return (
        <div className="flex flex-col h-full p-6 relative bg-slate-950 overflow-y-auto text-white font-sans">
            <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-white/10"><SafeIcon icon={Icons.ChevronLeft} size={32} /></button>
           
            <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full pt-8 pb-12">
                <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter text-center italic">ESPACE <span className="text-red-600">MEMBRE</span></h2>
                <div className="w-16 h-1 bg-red-600 mb-8"></div>
               
                {/* PROFIL CARD */}
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 flex items-center gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><SafeIcon icon={Icons.User} size={120}/></div>
                    <div className="w-20 h-20 rounded bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 relative">
                        {getAvatarIcon(user.equippedAvatar, 40, "text-zinc-400")}
                        {user.isVip && <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-full border-2 border-zinc-900"><SafeIcon icon={Icons.Crown} size={12} className="fill-current" /></div>}
                    </div>
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-2">
                             <h3 className={`text-xl md:text-2xl font-black uppercase ${user.isVip ? 'text-yellow-400' : 'text-white'}`}>{user.pseudo}</h3>
                             {user.isVip && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-yellow-500/30">VIP</span>}
                        </div>
                        <span className="text-zinc-500 font-bold uppercase text-xs">{user.role === 'admin' ? 'Administrateur' : 'Membre du Club'}</span>
                    </div>
                </div>

                 {/* PORTEFEUILLE */}
                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center shadow-lg">
                        <div className="text-blue-400 font-black text-xs uppercase mb-1 flex items-center gap-1"><SafeIcon icon={Icons.Gem} size={12}/> Jetons</div>
                        <span className="text-2xl font-mono font-black text-white">{user.wallet.gold.toLocaleString()}</span>
                    </div>
                    <div className="bg-zinc-900 border border-purple-900/30 p-4 rounded-xl flex flex-col items-center justify-center shadow-lg">
                        <div className="text-purple-400 font-black text-xs uppercase mb-1 flex items-center gap-1"><SafeIcon icon={Icons.Gem} size={12}/> Gemmes</div>
                        <span className="text-2xl font-mono font-black text-white">{user.wallet.gems.toLocaleString()}</span>
                    </div>
                </div>

                {/* STATISTIQUES */}
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl mb-8">
                      <h3 className="text-xs font-black uppercase text-zinc-400 mb-6 flex items-center gap-2">
                          <SafeIcon icon={Icons.TrendingUp} size={14} /> Performance Globale
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-center mb-6">
                          <div><div className="text-3xl font-mono font-black text-white">{user.stats.played}</div><div className="text-[9px] uppercase text-zinc-500 font-bold mt-1">Jouées</div></div>
                          <div><div className="text-3xl font-mono font-black text-green-500">{user.stats.won}</div><div className="text-[9px] uppercase text-zinc-500 font-bold mt-1">Gagnées</div></div>
                          <div><div className="text-3xl font-mono font-black text-white">{winRate}%</div><div className="text-[9px] uppercase text-zinc-500 font-bold mt-1">Ratio</div></div>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${winRate}%` }}></div></div>
                </div>

                {/* RANKING MENSUEL */}
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl mb-8">
                    <h3 className="text-xs font-black uppercase text-zinc-400 mb-4 flex items-center gap-2"><SafeIcon icon={Icons.Award} size={14} /> Classement du Mois</h3>
                   
                    <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-lg">
                        <button onClick={() => setRankingTab('cochonsDonnes')} className={`flex-1 py-2 rounded text-[10px] font-black uppercase transition-all ${rankingTab === 'cochonsDonnes' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}>🐷 Boucher</button>
                        <button onClick={() => setRankingTab('cochonsPris')} className={`flex-1 py-2 rounded text-[10px] font-black uppercase transition-all ${rankingTab === 'cochonsPris' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}>🛡️ Défense</button>
                        <button onClick={() => setRankingTab('points')} className={`flex-1 py-2 rounded text-[10px] font-black uppercase transition-all ${rankingTab === 'points' ? 'bg-yellow-500 text-black' : 'text-zinc-500 hover:text-white'}`}>🏆 Score</button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {MOCK_RANKINGS[rankingTab].map((rank, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border-yellow-500/30' : 'bg-zinc-800/50 border-zinc-800'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-zinc-400 text-black' : i === 2 ? 'bg-orange-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{i + 1}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">{getAvatarIcon(rank.avatar, 16, "text-zinc-400")}</div>
                                        <span className={`font-bold text-sm ${rank.name === user.pseudo ? 'text-yellow-400' : 'text-white'}`}>{rank.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-mono font-black text-lg text-white">{rank.val}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold">
                                            {rankingTab === 'cochonsDonnes' ? 'Donnés' : rankingTab === 'cochonsPris' ? 'Pris' : 'Pts'}
                                        </span>
                                        {rank.played !== undefined && (
                                            <div className="flex items-center gap-2 mt-1 bg-black/20 px-2 py-0.5 rounded">
                                                <span className="text-[8px] text-zinc-400">{rank.played} Part.</span>
                                                <span className={`text-[8px] font-bold ${rank.winRate > 50 ? 'text-green-500' : 'text-zinc-500'}`}>{rank.winRate}% Vic.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center text-[10px] text-zinc-600 italic">Classement mis à jour toutes les 24h.</div>
                </div>

                <Button variant="danger" onClick={onLogout} className="w-full py-4 border-2">
                    DÉCONNEXION
                </Button>
            </div>
        </div>
    );
};


const RankingScreen = ({ onBack, user }) => {
    const [rankingTab, setRankingTab] = useState('cochonsDonnes');

    return (
        <div className="flex flex-col h-full p-6 relative bg-slate-950 overflow-y-auto text-white font-sans">
            <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-white/10"><SafeIcon icon={Icons.ChevronLeft} size={32} /></button>
            <div className="flex-1 max-w-2xl mx-auto w-full pt-8 pb-12">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-center italic">CLASSEMENT <span className="text-yellow-500">MENSUEL</span></h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Les meilleurs joueurs de la Martinique</p>
                </div>

                <div className="flex gap-2 mb-8 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
                    <button onClick={() => setRankingTab('cochonsDonnes')} className={`flex-1 py-4 rounded-lg text-xs font-black uppercase transition-all flex flex-col items-center gap-1 ${rankingTab === 'cochonsDonnes' ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                        <span className="text-lg">🐷</span>
                        <span>Boucher</span>
                        <span className="text-[8px] opacity-60 font-normal capitalize">Le + de cochons</span>
                    </button>
                    <button onClick={() => setRankingTab('cochonsPris')} className={`flex-1 py-4 rounded-lg text-xs font-black uppercase transition-all flex flex-col items-center gap-1 ${rankingTab === 'cochonsPris' ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                        <span className="text-lg">🛡️</span>
                        <span>Défenseur</span>
                        <span className="text-[8px] opacity-60 font-normal capitalize">Le - de cochons</span>
                    </button>
                    <button onClick={() => setRankingTab('points')} className={`flex-1 py-4 rounded-lg text-xs font-black uppercase transition-all flex flex-col items-center gap-1 ${rankingTab === 'points' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                        <span className="text-lg">🏆</span>
                        <span>Scoreur</span>
                        <span className="text-[8px] opacity-60 font-normal capitalize">Le + de points</span>
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {MOCK_RANKINGS[rankingTab].map((rank, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                            i === 0 ? 'bg-gradient-to-r from-yellow-900/40 to-transparent border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' :
                            i === 1 ? 'bg-zinc-800/60 border-zinc-400/30' :
                            i === 2 ? 'bg-orange-900/30 border-orange-500/30' :
                            'bg-zinc-900/50 border-zinc-800'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                                    i === 0 ? 'bg-yellow-500 text-black shadow-lg' :
                                    i === 1 ? 'bg-zinc-400 text-black' :
                                    i === 2 ? 'bg-orange-700 text-white' :
                                    'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                }`}>
                                    {i + 1}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-zinc-700 shadow-md">
                                        {getAvatarIcon(rank.avatar, 20, "text-zinc-400")}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black text-sm uppercase ${rank.name === user.pseudo ? 'text-yellow-400' : 'text-white'}`}>
                                            {rank.name}
                                        </span>
                                        {i === 0 && <span className="text-[8px] text-yellow-500 font-bold uppercase tracking-widest">Champion en titre</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col items-end">
                                    <span className={`font-mono font-black text-2xl ${i===0 ? 'text-yellow-500' : 'text-white'}`}>{rank.val}</span>
                                    <span className="text-[9px] text-zinc-500 uppercase font-bold">
                                        {rankingTab === 'cochonsDonnes' ? 'Donnés' : rankingTab === 'cochonsPris' ? 'Pris' : 'Pts'}
                                    </span>
                                    {rank.played !== undefined && (
                                        <div className="flex items-center gap-2 mt-1 bg-black/20 px-2 py-0.5 rounded">
                                            <span className="text-[8px] text-zinc-400">{rank.played} Part.</span>
                                            <span className={`text-[8px] font-bold ${rank.winRate > 50 ? 'text-green-500' : 'text-zinc-500'}`}>{rank.winRate}% Vic.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * --- MOTEUR TOURNOI (LOGIQUE COMPLETE) ---
 */
const TournamentEngine = {
  // 1. Complète avec des Bots pour avoir un multiple de 3
  prepareParticipants: (realPlayers) => {
    let participants = [...realPlayers];
    // Simulation d'autres joueurs réels pour l'exemple
    for(let i=0; i<20; i++) participants.push({ id: `random_${i}`, pseudo: `Joueur ${i+1}`, isBot: true, type: 'bot', score: 0 });
   
    const remainder = participants.length % 3;
    if (remainder !== 0) {
      const botsNeeded = 3 - remainder;
      for (let i = 0; i < botsNeeded; i++) {
        participants.push({ id: `bot_tournoi_${i}`, pseudo: `Bot T${i+1}`, isBot: true, type: 'bot', score: 0 });
      }
    }
    return participants.sort(() => Math.random() - 0.5);
  },

  // 2. Crée les tables
  createTables: (participants) => {
    const tables = [];
    let tableId = 1;
    for (let i = 0; i < participants.length; i += 3) {
      tables.push({
        id: tableId++,
        seats: [participants[i], participants[i+1], participants[i+2]], // [Maitre, Impair, Pair]
        scores: [0, 0, 0]
      });
    }
    return tables;
  },

  // 3. Rotation (Maitre fixe, Impair monte, Pair descend)
  rotateTables: (currentTables) => {
    const totalTables = currentTables.length;
    let nextTables = currentTables.map(t => ({ id: t.id, seats: [null, null, null], scores: [0,0,0] }));

    currentTables.forEach((table, index) => {
      // Seat 0 (Maitre) -> Reste
      nextTables[index].seats[0] = table.seats[0];

      // Seat 1 (Impair) -> Monte (Table + 1)
      let nextUp = (index + 1) % totalTables;
      nextTables[nextUp].seats[1] = table.seats[1];

      // Seat 2 (Pair) -> Descend (Table - 1)
      let nextDown = (index - 1 + totalTables) % totalTables;
      nextTables[nextDown].seats[2] = table.seats[2];
    });
    return nextTables;
  }
};

// --- ECRAN TOURNOI (AVEC REGLAGES ADMIN) ---
const TournamentScreen = ({ tournament, onStartNext, onBack, onUpdateRounds, isUserAdmin }) => {
    // Tri des joueurs par score décroissant
    const sortedParticipants = [...tournament.participants].sort((a, b) => b.score - a.score);
    const isFinished = tournament.round > tournament.totalRounds;

    return (
        <div className="flex flex-col h-full p-4 md:p-6 relative bg-zinc-950 overflow-y-auto text-white font-sans">
            {!isFinished && (
                <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-white/10">
                    <SafeIcon icon={Icons.ChevronLeft} size={32} />
                </button>
            )}
           
            <div className="flex-1 max-w-3xl mx-auto w-full pt-8 pb-12 flex flex-col">
                <div className="text-center mb-6">
                    <SafeIcon icon={Icons.Trophy} size={64} className="text-yellow-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                        {isFinished ? <span className="text-yellow-500">CLASSEMENT FINAL</span> : tournament.round === 0 ? "LISTE DES INSCRITS" : `TOUR ${tournament.round} / ${tournament.totalRounds}`}
                    </h2>
                   
                    {/* --- ZONE ADMIN : REGLAGE DES TOURS (5, 10, 15, X) --- */}
                    {isUserAdmin && tournament.round === 0 && (
                        <div className="mt-4 bg-zinc-900 border border-yellow-500/30 p-3 rounded-xl inline-block shadow-lg animate-in slide-in-from-top-4">
                             <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                <SafeIcon icon={Icons.Settings} size={12}/> Admin : Durée du Tournoi
                             </div>
                             <div className="flex gap-2 justify-center items-center">
                                {/* Boutons prédefinis */}
                                {[5, 10, 15].map(nb => (
                                    <button
                                        key={nb}
                                        onClick={() => onUpdateRounds(nb)}
                                        className={`px-4 py-2 rounded-lg font-black text-xs transition-all border-2 ${tournament.totalRounds === nb ? 'bg-yellow-500 text-black border-yellow-500 scale-110' : 'bg-black text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
                                    >
                                        {nb}
                                    </button>
                                ))}
                                {/* Case X personnalisée */}
                                <div className="relative group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        className={`w-12 py-2 rounded-lg font-black text-xs text-center border-2 outline-none transition-all ${![5, 10, 15].includes(tournament.totalRounds) ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-black text-white border-zinc-700 focus:border-yellow-500'}`}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val > 0) onUpdateRounds(val);
                                        }}
                                    />
                                </div>
                             </div>
                             <div className="text-[9px] text-zinc-600 mt-1 italic">Tours</div>
                        </div>
                    )}
                    {/* -------------------------------------- */}

                    {!isFinished && tournament.round > 0 && (
                        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mt-2">
                            Manche {tournament.manche} / 2
                        </p>
                    )}
                </div>

                {/* LISTE DES PARTICIPANTS */}
                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl mb-8">
                    <div className="overflow-y-auto max-h-[50vh] custom-scrollbar p-2">
                        {sortedParticipants.map((p, i) => (
                            <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl mb-2 ${i === 0 ? 'bg-gradient-to-r from-yellow-900/40 to-black border border-yellow-500/50' : 'bg-black/20 border border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black uppercase ${p.id === 'user_me' ? 'text-green-400' : 'text-white'}`}>
                                            {p.pseudo} {p.id === 'user_me' && '(Moi)'}
                                        </span>
                                        {tournament.round > 0 && <span className="text-[10px] text-zinc-500 uppercase font-bold">Table {Math.floor(i/3) + 1}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-mono font-black text-yellow-500">{p.score}</span>
                                    <span className="text-[10px] text-zinc-600 block uppercase font-bold">Points</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOUTON D'ACTION */}
                <div className="mt-auto">
                    {isFinished ? (
                        <Button onClick={onBack} className="w-full py-5 text-xl bg-green-600 border-green-500">RETOURNER AU MENU</Button>
                    ) : (
                        <Button onClick={onStartNext} className="w-full py-5 text-xl animate-pulse">
                            {tournament.round === 0 ? `LANCER LE TOURNOI (${tournament.totalRounds} TOURS)` : "LANCER LE MATCH SUIVANT"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * --- APP PRINCIPALE ---
 */
const App = () => {
  const [screen, setScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [gameConfig, setGameConfig] = useState(null);
  const [setupMode, setSetupMode] = useState('solo'); // 'solo' ou 'multi'

  // --- LOGIQUE TOURNOI ---
  // Ajout de "totalRounds" dans l'état
  const [tournament, setTournament] = useState({
      active: false,
      registered: false,
      round: 0,
      manche: 1,
      tables: [],
      myTable: null,
      participants: [],
      totalRounds: 5 // Valeur par défaut
  });

  const handleLogin = (user) => { setCurrentUser(user); setScreen('home'); };
  const updateUser = (newUser) => { setCurrentUser(newUser); };

  const handleStartGame = (cfg) => {
      if (currentUser.wallet.gold < cfg.stake) { alert("Pas assez d'or ! Regardez une pub en boutique pour en gagner."); return; }
      updateUser({ ...currentUser, wallet: { ...currentUser.wallet, gold: currentUser.wallet.gold - cfg.stake } });
      setGameConfig(cfg);
      setScreen('game');
  };

  const handleWin = (amount, currency) => {
      updateUser({ ...currentUser, wallet: { ...currentUser.wallet, [currency]: currentUser.wallet[currency] + amount } });
      alert(`Gagné ! +${amount} ${currency}`);
  };
   
  const handleDoubleWin = (amount, currency) => {
       updateUser({ ...currentUser, wallet: { ...currentUser.wallet, [currency]: currentUser.wallet[currency] + amount } });
  };
   
  const handleLogout = () => {
      setCurrentUser(null);
      setScreen('login');
  };

  // --- GESTION DU TOURNOI ---
   
  // 1. Inscription / Création
  const handleRegisterTournament = () => {
    const human = { ...currentUser, id: 'user_me', score: 0 };
    const allParticipants = TournamentEngine.prepareParticipants([human]);
   
    // Si l'admin a défini une "target" dans le setup, on l'utilise comme nombre de tours
    // Sinon par défaut c'est 5
    const roundsConfigured = (currentUser.role === 'admin' && gameConfig?.target) ? gameConfig.target : 5;

    setTournament({
        active: true,
        registered: true,
        round: 0,
        manche: 1,
        tables: [],
        myTable: null,
        participants: allParticipants,
        totalRounds: roundsConfigured // On sauvegarde la config
    });
    setScreen('tournament_standings');
  };

  // Helper pour initialiser un Round (Tour)
  const startNextRound = (roundNum) => {
      let nextTables;
      if (roundNum === 1) {
          nextTables = TournamentEngine.createTables(tournament.participants);
      } else {
          nextTables = TournamentEngine.rotateTables(tournament.tables);
      }
     
      const myNewTable = nextTables.find(t => t.seats.find(s => s.id === 'user_me'));
     
      setTournament(prev => ({
          ...prev,
          round: roundNum,
          manche: 1,
          tables: nextTables,
          myTable: myNewTable
      }));
     
      launchTournamentGame(myNewTable, 1);
  };

  // 3. Lancer une manche
  const launchTournamentGame = (table, mancheNum, previousScores = null) => {
    let opponents = table.seats.filter(s => s.id !== 'user_me');
    if (mancheNum === 2) opponents = [...opponents].reverse();

    setGameConfig({
      gameId: Date.now(),
      mode: 'tournament',
      format: 'manches',
      target: 1,
      stake: 0,
      currency: 'gold',
      difficulty: 'expert',
      customOpponents: opponents,
      previousScores: previousScores
    });
    setScreen('game');
  };

  // 4. Fin d'une manche (Appelé par GameScreen)
  const handleTournamentStep = (playersData) => {
    // A. Mise à jour des scores globaux
    let updatedParticipants = [...tournament.participants];
   
    if (playersData) {
        playersData.forEach(pData => {
            const participantIndex = updatedParticipants.findIndex(p => p.pseudo === pData.name);
            if (participantIndex !== -1) {
                updatedParticipants[participantIndex].score += pData.mdcPoints;
            }
        });
       
        // Simulation scores autres tables
        updatedParticipants = updatedParticipants.map(p => {
            if (!playersData.find(pd => pd.name === p.pseudo)) {
                return { ...p, score: p.score + Math.floor(Math.random() * 4) };
            }
            return p;
        });
    }

    // B. Logique de progression
    if (tournament.manche === 1) {
        // Fin Manche 1
        setTournament(prev => ({
            ...prev,
            participants: updatedParticipants,
            manche: 2
        }));
        setScreen('tournament_standings');
       
    } else {
        // Fin Manche 2 (Fin du Tour)
        if (tournament.round >= tournament.totalRounds) {
            // FIN DU TOURNOI
            setTournament(prev => ({ ...prev, participants: updatedParticipants, round: 6 }));
            setScreen('tournament_standings');
        } else {
            // PASSAGE AU TOUR SUIVANT
            setTournament(prev => ({
                ...prev,
                participants: updatedParticipants,
                round: prev.round + 1,
                manche: 1
            }));
             setScreen('tournament_standings');
        }
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-[#020617] text-white overflow-hidden select-none flex justify-center items-center">
      <div className="w-full h-full lg:max-w-[900px] lg:max-h-[650px] lg:border lg:border-slate-800 lg:rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-slate-950 relative overflow-hidden flex flex-col ring-1 ring-white/10 text-white">
        {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
       
        {screen === 'home' && currentUser && <HomeScreen
            user={currentUser}
            onNavigate={(s, c) => {
                if (s === 'setup') setSetupMode('solo');
                if (c) setGameConfig(c);
                setScreen(s);
            }}
            onTournamentClick={handleRegisterTournament}
        />}
       
        {screen === 'shop' && currentUser && <ShopScreen user={currentUser} onBack={() => setScreen('home')} onUpdateUser={updateUser} />}
       
        {screen === 'setup' && <SetupScreen
            onBack={() => setScreen(setupMode === 'solo' ? 'home' : 'lobby')}
            onStart={handleStartGame}
            user={currentUser}
            mode={setupMode}
        />}
       
        {screen === 'lobby' && <LobbyScreen
            onBack={() => setScreen('home')}
            onJoinTable={(cfg) => handleStartGame(cfg)}
            onCreateTable={() => { setSetupMode('multi'); setScreen('setup'); }}
        />}

        {screen === 'tournament_standings' && (
            <TournamentScreen
                tournament={tournament}
                isUserAdmin={currentUser.role === 'admin'} // On dit si c'est l'admin
                onUpdateRounds={(nb) => setTournament(prev => ({ ...prev, totalRounds: nb }))} // La fonction pour changer les tours
                onStartNext={() => {
                    if (tournament.manche === 1 && tournament.round > 1) {
                        startNextRound(tournament.round);
                    } else if (tournament.round === 0) {
                        startNextRound(1);
                    } else {
                        launchTournamentGame(tournament.myTable, 2);
                    }
                }}
                onBack={() => setScreen('home')}
            />
        )}

        {screen === 'game' && <GameScreen
            key={gameConfig?.gameId || 'solo-game'}
            config={gameConfig}
            onExit={(playersData) => {
                if (gameConfig && gameConfig.mode === 'tournament') {
                    handleTournamentStep(playersData);
                } else {
                    setScreen('home');
                }
            }}
            onWin={handleWin}
            onDoubleWin={handleDoubleWin}
            user={currentUser}
        />}

        {screen === 'member' && currentUser && <MemberScreen user={currentUser} onBack={() => setScreen('home')} onLogout={handleLogout} />}
        {screen === 'ranking' && currentUser && <RankingScreen user={currentUser} onBack={() => setScreen('home')} />}
      </div>
    </div>
  );
};

export default App;