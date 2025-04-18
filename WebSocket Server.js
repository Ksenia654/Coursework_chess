const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = [];

server.on('connection', (ws) => {
    // Добавление игрока
    players.push(ws);
    console.log('Player connected. Total players:', players.length);

    // Обработка входящих сообщений
    ws.on('message', (message) => {
        console.log('Received:', message);
        // Трансляция хода другому игроку
        players.forEach(player => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(message);
            }
        });
    });

    // Обработка отключения игрока
    ws.on('close', () => {
        console.log('Player disconnected');
        players = players.filter(player => player !== ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
