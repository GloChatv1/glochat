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
    // Assign a unique ID to the user and store it in the users object
    const userId = socket.id;
    users[userId] = userId;

    console.log(`${new Date().toLocaleTimeString()} connect ${userId}`);
    
    // Emit 'user connected' event when a user connects
    io.emit('chat message', `<span class="user-connect">${userId} has connected</span>`);

    // Send chat history to the newly connected user
    socket.emit('chat history', messages);

    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const messageWithTimestamp = `<div class="message">
    <div class="user-info">
        <div class="user-id">${userId}</div>
        <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-content">
        <span class="message-text">${msg}</span>
    </div>
</div>`;

        messages.push(messageWithTimestamp);
        io.emit('chat message', messageWithTimestamp);
        console.log(`${timestamp} message ${userId} : \"${msg}\"`);
    });

    // Handle sending images
    socket.on('chat image', (dataUrl) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const imageMessageWithTimestamp = `<div class="message">
    <div class="user-info">
        <div class="user-id">${userId}</div>
        <div class="timestamp">${timestamp}</div>
    </div>
    <div class="message-content">
        <img src="${dataUrl}" class="message-image" />
    </div>
</div>`;
        messages.push(imageMessageWithTimestamp);
        io.emit('chat message', imageMessageWithTimestamp);
        console.log(`${timestamp} image ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log(`${new Date().toLocaleTimeString()} disconnect ${userId}`);
        // Remove user from users object on disconnect
        delete users[userId];
        // Emit 'user disconnected' event when a user disconnects
        io.emit('chat message', `<span class="user-disconnect">${userId} has disconnected</span>`);
    });
});


server.listen(3000, () => console.log('Listening on port 3000'));