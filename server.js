// server.js
const exp = require('constants');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Store connected users and their IDs
let users = {};



app.use((req, res) => {
    res.status(404);
    res.sendFile(__dirname + '/404.html');
});

let messages = [];

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Assign a unique ID to the user and store it in the users object
    const userId = socket.id;
    users[userId] = userId;
    
    socket.emit('chat history', messages);

    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const messageWithTimestamp = `<div class="message"><div class="user-id">${userId}</div><div class="message-content"><span class="timestamp">${timestamp}</span><span class="message-text">${msg}</span></div></div>`; // Include user ID
        messages.push(messageWithTimestamp);
        io.emit('chat message', messageWithTimestamp);
    });
    

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Remove user from users object on disconnect
        delete users[userId];
    });
});

server.listen(3000, () => console.log('Listening on port 3000'));
