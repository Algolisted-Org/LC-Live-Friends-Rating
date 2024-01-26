// background.js

chrome.runtime.onInstalled.addListener(async () => {
    // Initialize friends in storage if not present
    chrome.storage.local.get('friends', function (data) {
        if (!data.friends) {
            chrome.storage.local.set({ 'friends': [] });
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addFriend') {
        const friendUsername = request.friend;

        // Retrieve stored friends from local storage
        chrome.storage.local.get('friends', function (data) {
            const friends = data.friends || [];

            // Add the new friend username
            friends.push(friendUsername);

            // Save updated friends to local storage
            chrome.storage.local.set({ 'friends': friends }, function () {
                // Log the updated friends (you can update the context menu here)
                console.log("Updated friends:", friends);
            });
        });
    }
});
