const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = [];

server.on('connection', (ws) => {
    // ���������� ������
    players.push(ws);
    console.log('Player connected. Total players:', players.length);

    // ��������� �������� ���������
    ws.on('message', (message) => {
        console.log('Received:', message);
        // ���������� ���� ������� ������
        players.forEach(player => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(message);
            }
        });
    });

    // ��������� ���������� ������
    ws.on('close', () => {
        console.log('Player disconnected');
        players = players.filter(player => player !== ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
