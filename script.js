document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.addBtn').addEventListener('click', function () {
        // Get the input value
        const friendUsername = document.querySelector('input').value.trim();
        console.log("Mark 1");
        console.log("friendUsername : ", friendUsername);

        if (friendUsername !== '') {
            // Send a message to the background script to add the friend
            chrome.runtime.sendMessage({ action: 'addFriend', friend: friendUsername });

            // Clear the input field
            document.querySelector('input').value = '';
        }
    });
});
