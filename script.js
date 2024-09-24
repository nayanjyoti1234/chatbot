document.addEventListener('DOMContentLoaded', function () {
    let conversation_id;
    const chatbotButton = document.querySelector('.chatbot-btn');
    const chatPopup = document.querySelector('.chat-popup');
    // const closeChatButton = document.querySelector('.close-chat');
    const sendButton = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.querySelector('.chat-messages');
    const chatBody = document.querySelector('.chat-body')
    chatPopup.classList.toggle('active');

    // Toggle chat popup visibility.chat-messages
    chatbotButton.addEventListener('click', function () {
        chatPopup.classList.toggle('active');
    });

    // closeChatButton.addEventListener('click', function () {
    //     chatPopup.classList.remove('active');
    // });

    // Function to add message to chat
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = message;
        chatMessages.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;

        document.querySelectorAll(".chat-messages a").forEach(function (a) {
            a.setAttribute('target', '_blank');
        })
    }

    function showTypingIndicator() {
        userInput.disabled = true;
        const typingIndicator = document.getElementById("typing");
        typingIndicator.style.display = "flex";
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTypingIndicator() {
        userInput.disabled = false;
        const typingIndicator = document.getElementById("typing");
        typingIndicator.style.display = "none";
    }

    // Simulate bot response
    async function botResponse(userMessage) {

        showTypingIndicator();
        const rawResponse = await fetch('https://xdemvy-be.healthbackend.com/chat/ask', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({customer_query: userMessage, conversation_id: conversation_id})
        });

        const res = await rawResponse.json();

        hideTypingIndicator();
        let response_message = ''
        if (!conversation_id) {
            conversation_id = res.data.conversation_id;
        }

        if (res && res.data && res.data.chats.length) {
            response_message = res.data.chats[0].message;
        }

        setTimeout(() => {
            const htmlString = marked.parse(response_message);
            addMessage('bot', htmlString);
        }, 1000); // Simulate delay
    }

    // Send user message
    sendButton.addEventListener('click', function () {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            userInput.value = ''; // Clear input
            botResponse(userMessage); // Trigger bot response
        }
    });

    // Allow Enter key to send message
    userInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});
