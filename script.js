// Load existing friends from storage on page load
document.addEventListener('DOMContentLoaded', function () {
    // Attach event listener for the "Add Friend" button
    document.getElementById('addFriendBtn').addEventListener('click', addFriend);

    // Load existing friends
    loadFriends();
});

function addFriend() {
    // Get the input value
    var friendUsername = document.getElementById('friendInput').value;

    if (friendUsername.trim() !== '') {
        // Get existing friends from storage
        getExistingFriends(function (existingFriends) {
            // Add the new friend
            existingFriends.push(friendUsername);

            // Save the updated friends list to storage
            setFriends(existingFriends);

            // Reload the friends in the leaderboard
            loadFriends();

            // Clear the input field
            document.getElementById('friendInput').value = '';
        });
    }
}

function loadFriends() {
    // Get existing friends from storage
    getExistingFriends(function (existingFriends) {
        // Get the leaderboard container
        var leaderboardContainer = document.getElementById('leaderboard');

        // Clear the existing leaderboard content
        leaderboardContainer.innerHTML = '';

        // Add each friend to the leaderboard
        existingFriends.forEach(function (friend, index) {
            var userDiv = document.createElement('div');
            userDiv.className = 'oneUser';

            var topRowDiv = document.createElement('div');
            topRowDiv.className = 'topRow';

            var friendsRankDiv = document.createElement('div');
            friendsRankDiv.className = 'friendsRank';
            friendsRankDiv.textContent = (index + 1).toString();

            var userInfoDiv = document.createElement('div');
            userInfoDiv.className = 'userInfo';

            var usernameLink = document.createElement('a');
            usernameLink.href = '/';
            usernameLink.className = 'username';
            usernameLink.textContent = '@' + friend;

            var rankDiv = document.createElement('div');
            rankDiv.className = 'rank';
            rankDiv.innerHTML = ': <b>-</b>';

            userInfoDiv.appendChild(usernameLink);
            userInfoDiv.appendChild(rankDiv);

            topRowDiv.appendChild(friendsRankDiv);
            topRowDiv.appendChild(userInfoDiv);

            userDiv.appendChild(topRowDiv);

            leaderboardContainer.appendChild(userDiv);
        });
    });
}

function getExistingFriends(callback) {
    // Get existing friends from storage
    chrome.storage.local.get(['friends'], function (result) {
        var existingFriends = result.friends || [];
        callback(existingFriends);
    });
}

function setFriends(friends) {
    // Save friends to storage
    chrome.storage.local.set({ 'friends': friends }, function () {
        console.log('Friends list updated');
    });
}
