chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.local.get('friends', function (data) {
        if (!data.friends) {
            chrome.storage.local.set({ 'friends': [] });
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addFriend') {
        const friendUsername = request.friend;

        chrome.storage.local.get('friends', function (data) {
            const friends = data.friends || [];

            friends.push(friendUsername);

            chrome.storage.local.set({ 'friends': friends }, function () {
                console.log("Updated friends:", friends);
            });
        });
    }
});