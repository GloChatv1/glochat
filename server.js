// server.js
const exp = require('constants');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const { generateUsername } = require("unique-username-generator");

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

// Mapping of user IDs to display names
let userDisplayNames = {};

io.on('connection', (socket) => {
    // Get the IP address of the user
    const userIP = socket.handshake.address;

    // Check if the user has previously connected and has a display name
    let displayName = userDisplayNames[userIP];
    if (!displayName) {
        // If not, generate a new display name for the user
        displayName = getDisplayName();
        // Store the display name for the user's IP address
        userDisplayNames[userIP] = displayName;
    }
    
    console.log(`${new Date().toLocaleTimeString()} connect ${userDisplayNames[userIP]}`);
    
    // Emit 'user connected' event when a user connects
    io.emit('chat message', `<span class="user-connect">${userDisplayNames[userIP]} has connected</span>`);
    
    // Send chat history to the newly connected user
    socket.emit('chat history', messages);

    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const displayName = userDisplayNames[userIP]; // Get the display name for the user ID
        if (msg.includes('<')){
            console.log(`${timestamp} illegal-message ${displayName} : ${msg}`);
            msg = '</span><p>Illegal character detected</p>'
        }
        const messageWithTimestamp = `<div class="message">
            <div class="user-info">
                <div class="user-id">${displayName}</div>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-content">
                <span class="message-text">${msg}</span>
            </div>
        </div>`;

        messages.push(messageWithTimestamp);
        io.emit('chat message', messageWithTimestamp);
        console.log(`${timestamp} message ${displayName} : ${msg}`);
    });
    

    // Handle sending images
    socket.on('chat image', (dataUrl) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const displayName = userDisplayNames[userIP];
        if (dataUrl.includes('<')){
            console.log(`${timestamp} illegal-image ${displayName} : ${dataUrl}`);
            dataUrl = '" /> <p>Illegal character detected<class"xss'
        }
        const imageMessageWithTimestamp = `<div class="message">
    <div class="user-info">
        <div class="user-id">${displayName}</div>
        <div class="timestamp">${timestamp}</div>
    </div>
    <div class="message-content">
        <img class="message-image src="${dataUrl}" />
    </div>
</div>`;
        messages.push(imageMessageWithTimestamp);
        io.emit('chat message', imageMessageWithTimestamp);
        console.log(`${timestamp} image ${displayName}`);
    });

    socket.on('disconnect', () => {
        const displayName = userDisplayNames[userIP];
        console.log(`${new Date().toLocaleTimeString()} disconnect ${displayName}`);
        // Remove user from users object on disconnect
        delete users[userIP];
        // Emit 'user disconnected' event when a user disconnects
        io.emit('chat message', `<span class="user-disconnect">${displayName} has disconnected</span>`);
    });
});

server.listen(3000, () => console.log('Listening on port 3000'));

function getDisplayName(){
    return generateUsername("-");
}
