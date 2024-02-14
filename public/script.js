document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messages = document.getElementById('messages');
    const imageInput = document.getElementById('imageInput');
    const imageInputLabel = document.getElementById('imageInputLabel');
    const sendMessageButton = document.getElementById('sendMessageButton');

    socket.on('chat history', (chatHistory) => {
        messages.innerHTML = chatHistory.join('<br>');
        scrollToBottom();
    });

    socket.on('chat message', (msg) => {
        messages.innerHTML += '<br>' + msg;
        scrollToBottom();
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                socket.emit('chat image', dataUrl);
                scrollToBottom(); // Scroll to bottom after sending image
            };
            reader.readAsDataURL(file);
            imageInput.value = ''; // Clear the file input
            imageInputLabel.textContent = 'Select Image'; // Reset label content
            imageInputLabel.style.display = 'inline-block'; // Show the label
        } else if (messageInput.value.trim() !== '') {
            socket.emit('chat message', messageInput.value);
            scrollToBottom(); // Scroll to bottom after sending message
        }
        messageInput.value = ''; // Clear the message input
    });

    imageInput.addEventListener('change', () => {
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            imageInputLabel.textContent = file.name; // Display the selected file name
            imageInputLabel.style.display = 'inline-block'; // Show the label
        }
    });
});

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}
