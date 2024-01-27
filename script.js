// script.js

document.addEventListener('DOMContentLoaded', async function () {
    // Function to get data from local storage as a promise
    function getLocalStorage(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, resolve);
        });
    }

    // Function to set data to local storage as a promise
    function setLocalStorage(data) {
        return new Promise((resolve) => {
            chrome.storage.local.set(data, resolve);
        });
    }

    // Function to update the leaderboard
    async function updateLeaderboard() {
        // Display loading message
        const leaderboardContainer = document.getElementById('leaderboard');
        leaderboardContainer.innerHTML = '<p class="current-status">Data loading . . .  🚀</p>';
    
        // Fetch data from the API
        const apiURL = findUrl(); // Using the findUrl function to get the URL
        try {
            const response = await fetch(apiURL);
            const apiData = await response.json();
    
            // Retrieve friends from local storage
            const friendsData = await getLocalStorage('friends');
            const friends = friendsData.friends || [];
    
            // Sort the friends based on their rank
            friends.sort((a, b) => {
                const userA = apiData.total_ranks_simplified.find(user => user.username === a);
                const userB = apiData.total_ranks_simplified.find(user => user.username === b);
                return (userA ? userA.rank : Infinity) - (userB ? userB.rank : Infinity);
            });
    
            // Get the leaderboard container
            const leaderboardContainer = document.getElementById('leaderboard');
            // Clear existing leaderboard content
            leaderboardContainer.innerHTML = '';
    
            // Iterate through each friend and add them to the leaderboard
            friends.forEach(async (friend, index) => {
                const matchingUser = apiData.total_ranks_simplified.find(user => user.username === friend);
    
                if (matchingUser) {
                    const userHtml = `
                        <div class="oneUser">
                            <div class="topRow">
                                <div class="friendsRank">${index + 1}</div>
                                <div class="userInfo">
                                    <a href="/" class="username">@${friend}</a>
                                    <div class="rank">: <b>#${matchingUser.rank}</b></div>
                                </div>
                                <div class="deleteUser" data-username="${friend}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                                        <!-- Diagonal line from top-left to bottom-right -->
                                        <line x1="0" y1="0" x2="100" y2="100" stroke="white" stroke-width="4"/>
                                        <!-- Diagonal line from top-right to bottom-left -->
                                        <line x1="100" y1="0" x2="0" y2="100" stroke="white" stroke-width="4"/>
                                    </svg>
                                </div>
                            </div>
                        </div>`;
                    leaderboardContainer.innerHTML += userHtml;
                } else {
                    const userHtml = `
                        <div class="oneUser">
                            <div class="topRow">
                                <div class="friendsRank">${index + 1}</div>
                                <div class="userInfo">
                                    <a href="/" class="username">@${friend}</a>
                                    <div class="rank">: <b>-</b></div>
                                </div>
                                <div class="deleteUser" data-username="${friend}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                                        <!-- Diagonal line from top-left to bottom-right -->
                                        <line x1="0" y1="0" x2="100" y2="100" stroke="white" stroke-width="4"/>
                                        <!-- Diagonal line from top-right to bottom-left -->
                                        <line x1="100" y1="0" x2="0" y2="100" stroke="white" stroke-width="4"/>
                                    </svg>
                                </div>
                            </div>
                        </div>`;
                    leaderboardContainer.innerHTML += userHtml;
                }
            });
    
            // Add event listeners to deleteUser elements
            document.querySelectorAll('.deleteUser').forEach(deleteUserElement => {
                deleteUserElement.addEventListener('click', async function () {
                    const usernameToDelete = this.dataset.username;
    
                    // Retrieve stored friends from local storage
                    const data = await getLocalStorage('friends');
                    const friends = data.friends || [];
    
                    // Remove the friend with the specified username
                    const updatedFriends = friends.filter(friend => friend !== usernameToDelete);
    
                    // Save updated friends to local storage
                    await setLocalStorage({ 'friends': updatedFriends });
    
                    // Update the leaderboard after deleting the friend
                    await updateLeaderboard();
                });
            });
        } catch (error) {
            // Display an error message if fetching data fails
            leaderboardContainer.innerHTML = '<p class="current-status">Error loading data 😓, try again!</p>';
            console.error('Error loading data:', error);
        }
    }

    // Function to find the API URL
    function findUrl() {
        // For now, returning the hardcoded URL
        return 'https://lc-live-ranking-api.vercel.app/?contest=biweekly-contest-122';
    }

    await updateLeaderboard();

    document.querySelector('.addBtn').addEventListener('click', async function () {
        // Get the input value
        const friendUsername = document.querySelector('input').value.trim();
        console.log("Mark 1");
        console.log("friendUsername : ", friendUsername);

        if (friendUsername !== '') {
            // Retrieve stored friends from local storage
            const data = await getLocalStorage('friends');
            const friends = data.friends || [];

            // Add the new friend username
            friends.push(friendUsername);

            // Save updated friends to local storage
            await setLocalStorage({ 'friends': friends });

            // Update the leaderboard with the new friend
            await updateLeaderboard();

            // Clear the input field
            document.querySelector('input').value = '';
        }
    });
});
