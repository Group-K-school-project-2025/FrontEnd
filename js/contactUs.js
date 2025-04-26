document.getElementById('messageForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
    };

    fetch('https://backend-7hqy.onrender.com/submit-message', {  // ✅ اینجا آدرس درست شد
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message sent:", data);
        alert('Your message has been sent. Our team will get in touch with you soon.');
    })
    .catch(error => {
        console.error("Error sending message:", error);
    });
});
