document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.addBtn').addEventListener('click', async function () {
        // Get the input value
        const friendUsername = document.querySelector('input').value.trim();
        console.log("Mark 1");
        console.log("friendUsername : ", friendUsername);

        if (friendUsername !== '') {
            // Wrap chrome.runtime.sendMessage in a promise
            const sendMessagePromise = (message) => new Promise(resolve => {
                chrome.runtime.sendMessage(message, resolve);
            });

            // Use async/await to send the message
            const response = await sendMessagePromise({ action: 'addFriend', friend: friendUsername });

            // Handle the response if needed
            console.log(response);

            // Clear the input field
            document.querySelector('input').value = '';
        }
    });
});
