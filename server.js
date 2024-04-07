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

let banned = [];

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
        if (userIP == '::1' || userIP == '::ffff:127.0.0.1'){
            displayName = '[ADMIN] ' + displayName;
        }
        // Store the display name for the user's IP address
        userDisplayNames[userIP] = displayName;
    }
    
    console.log(`${new Date().toLocaleTimeString()} connect ${userIP} ${userDisplayNames[userIP]}`);
    
    // Emit 'user connected' event when a user connects
    io.emit('chat message', `<span class="user-connect">${userDisplayNames[userIP]} has connected</span>`);
    
    // Send chat history to the newly connected user
    socket.emit('chat history', messages);

    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const displayName = userDisplayNames[userIP]; // Get the display name for the user ID
        if (banned.includes(displayName)){
            return;
        }
        if (msg.startsWith('<')){
            if (displayName.startsWith('[ADMIN] ')){
                let args = msg.match(/(?:[^\s"]+|"[^"]*")/g).map(arg => arg.replace(/^"(.*)"$/, '$1'));
                if (msg == '<list'){
                    for (let user in userDisplayNames) {
                        console.log(`${user} ${userDisplayNames[user]}`);
                    }
                }
                else if (msg.startsWith('<give-admin ')){
                    let argument = args[1];
                    let userName = userDisplayNames[argument];
                    userDisplayNames[argument] = "[ADMIN] " + userName;
                    sendMsgSpan(displayName, `Admin status added to ${userName}`, timestamp, 'aquamarine')
                }
                else if (msg.startsWith('<remove-admin ')){
                    let argument = args[1];
                    let userName = userDisplayNames[argument];
                    if (userName.startsWith("[ADMIN] ")) {
                        userDisplayNames[argument] = userName.slice("[ADMIN] ".length);
                        sendMsgSpan(displayName, `Admin status removed from ${userName}`, timestamp, 'aquamarine');
                    }
                }
                else if (msg == '<reset'){
                    messages = [];
                    sendMsgSpan(displayName, 'Message History Cleared', timestamp, 'sendMsgSpan(displayName, `aquamarine');
                }
                else if (msg.startsWith('<msg ')){
                    sendMsgSpan(displayName, args[2], timestamp, args[1]);
                }
                else if (msg.startsWith('<msgas ')){
                    sendMsgSpan(args[1], args[3], timestamp, args[2]);
                }
                else if (msg.startsWith('<as ')){
                    sendMsg(args[1], args[2], timestamp);
                }
                else if (msg.startsWith('<anon ')){
                    sendMsg('[Anonymous]', args[1], timestamp);
                }
                else if (msg.startsWith('<ban ')){
                    let user = args[1];
                    banned.push(user);
                    sendMsgSpan('[System]', `${user} was banned`, timestamp, 'red');
                }
                else if (msg.startsWith('<unban ')){
                    let user = args[1];
                    let index = banned.indexOf(user);
                    if (index !== -1) {
                        banned.splice(index, 1);
                        sendMsgSpan('[System]', `${user} was unbanned`, timestamp, 'red');
                    }
                }
                else if (msg.startsWith('<msganon ')){
                    sendMsgSpan('[Anonymous]', args[2], timestamp, args[1]);
                }
            }
            else {
                let newMsg = 'You are not allowed to use admin commands';
                sendMsgSpan(displayName, newMsg, timestamp, 'red');
            }
            return;
        }
        else if (msg.includes('<')){
            console.log(`${timestamp} illegal-message ${displayName} : ${msg}`);
            // msg = '</span><p>Illegal character detected</p>'
            sendIllegal(displayName);
            return;
        }
        
        sendMsg(displayName, msg, timestamp);
    });
    

    // Handle sending images
    socket.on('chat image', (dataUrl) => {
        const timestamp = new Date().toLocaleTimeString(); // Get current time
        const displayName = userDisplayNames[userIP];
        if (banned.includes(displayName)){
            return;
        }
        if (dataUrl.includes('<')){
            console.log(`${timestamp} illegal-image ${displayName} : ${dataUrl}`);
            // dataUrl = '"/><p>Illegal character detected<class"xss'
            sendIllegal(displayName);
            return;
        }
        
        const imageMessageWithTimestamp = `<div class="message">
    <div class="user-info">
        <div class="user-id">${displayName}</div>
        <div class="timestamp">${timestamp}</div>
    </div>
    <div class="message-content">
        <img class="message-image" src="${dataUrl}" />
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

function sendIllegal(display, timestamp){
    sendMsgSpan(display, 'Illegal character detected', timestamp, 'red');
}

function sendMsgSpan(display, msg, timestamp, color){
    let newMsg = `</span><p style="color:${color};">${msg}</p`
    sendMsg(display, newMsg, timestamp);
}

function sendMsg(displayName, msg, timestamp){
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
}
