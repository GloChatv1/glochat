document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messages = document.getElementById('messages');

    socket.on('chat history', (chatHistory) => {
        messages.innerHTML = chatHistory.join('<br>');
    });

    socket.on('chat message', (msg) => {
        messages.innerHTML += '<br>' + msg;
        scrollToBottom();
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('chat message', messageInput.value);
        messageInput.value = '';
    });

});

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}