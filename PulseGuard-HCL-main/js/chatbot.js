
//Note - Comments are mentioned at each section to define functionality - Jonnnalagadda Sri Harsha
document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatIconOpen = document.getElementById('chat-icon-open');
    const chatIconClose = document.getElementById('chat-icon-close');
    const chatbox = document.getElementById('chatbox');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');

    // Initially hide the close icon
    chatIconClose.style.display = 'none';

    // Toggling chatbot 
    chatbotToggler.addEventListener('click', function () {
        chatbotWindow.classList.toggle('active');

        // Toggle between chat open and close icons
        if (chatbotWindow.classList.contains('active')) {
            chatIconOpen.style.display = 'none';  // Hide message icon
            chatIconClose.style.display = 'inline';  // Show close icon
        } else {
            chatIconOpen.style.display = 'inline';  // Show message icon
            chatIconClose.style.display = 'none';  // Hide close icon
        }
    });

    // Send message on button click
    sendBtn.addEventListener('click', function () {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        // Display user's message
        addMessageToChatbox(userMessage, 'outgoing');

        // Prepare request body in the format expected by Gemini API
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: userMessage }
                    ]
                }
            ]
        };

        // Send message to the Gemini API
        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD4tPhXlpS7JlP9ljRTcTIXBzbzuuQmBgQ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);  

            // Check if the response has valid content in the 'candidates' array
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                console.log('Candidate Response:', candidate); 
                console.log('Candidate Content:', candidate.content); 
                
                const botResponseParts = candidate.content.parts;
                const botResponse = botResponseParts.length > 0 ? botResponseParts[0].text : "Sorry, I couldn't understand that.";

                addMessageToChatbox(botResponse, 'incoming');
            } else {
                console.warn('Unexpected response structure:', data);
                addMessageToChatbox("Sorry, I couldn't understand that. Please try again.", 'incoming');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChatbox("Sorry, there was an error processing your message.", 'incoming');
        });

        // Clear the input field
        userInput.value = '';
    });

    // Helper function to add messages to the chatbox
    function addMessageToChatbox(message, type) {
        const messageElement = document.createElement('li');
        messageElement.classList.add('chat', type);

        const icon = document.createElement('span');
        icon.classList.add('fas', type === 'incoming' ? 'fa-robot' : 'fa-user');

        const messageText = document.createElement('p');
        messageText.textContent = message;

        messageElement.appendChild(icon);
        messageElement.appendChild(messageText);
        chatbox.appendChild(messageElement);

        // Scroll to the bottom of the chatbox
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});
