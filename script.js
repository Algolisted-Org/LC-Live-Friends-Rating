document.addEventListener('DOMContentLoaded', async function () {
    function getLocalStorage(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, resolve);
        });
    }

    function setLocalStorage(data) {
        return new Promise((resolve) => {
            chrome.storage.local.set(data, resolve);
        });
    }

    async function generateDefaultLeaderboard() {
        const friendsData = await getLocalStorage('friends');
        const friends = friendsData.friends || [];

        const leaderboardContainer = document.getElementById('leaderboard');
        leaderboardContainer.innerHTML = '';

        friends.forEach((friend, index) => {
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
                                <line x1="0" y1="0" x2="100" y2="100" stroke="white" stroke-width="4"/>
                                <line x1="100" y1="0" x2="0" y2="100" stroke="white" stroke-width="4"/>
                            </svg>
                        </div>
                    </div>
                </div>`;
            leaderboardContainer.innerHTML += userHtml;
        });

        document.querySelectorAll('.deleteUser').forEach(deleteUserElement => {
            deleteUserElement.addEventListener('click', async function () {
                const usernameToDelete = this.dataset.username;

                const data = await getLocalStorage('friends');
                const friends = data.friends || [];

                const updatedFriends = friends.filter(friend => friend !== usernameToDelete);

                await setLocalStorage({ 'friends': updatedFriends });

                await generateDefaultLeaderboard();
                await updateLeaderboard();
            });
        });
    }

    let apiData = null;

    async function fetchData() {
        if (!apiData) {
            const apiURL = findUrl();
            try {
                const response = await fetch(apiURL);
                apiData = await response.json();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    async function updateLeaderboard() {
        const friendsData = await getLocalStorage('friends');
        const friends = friendsData.friends || [];

        const leaderboardContainer = document.getElementById('leaderboard');

        friends.forEach((friend, index) => {
            const matchingUser = apiData.total_ranks_simplified.find(user => user.username === friend);
            if (matchingUser) {
                const rankElement = leaderboardContainer.querySelector(`.oneUser:nth-child(${index + 1}) .rank b`);
                rankElement.textContent = `#${matchingUser.rank}`;
            }
        });
    }

    function findUrl() {
        return 'https://lc-live-ranking-api.vercel.app/?contest=biweekly-contest-122';
    }

    await generateDefaultLeaderboard();
    
    document.querySelector('.addBtn').addEventListener('click', async function () {
        const friendUsername = document.querySelector('input').value.trim();

        if (friendUsername !== '') {
            const data = await getLocalStorage('friends');
            const friends = data.friends || [];

            friends.push(friendUsername);

            await setLocalStorage({ 'friends': friends });

            await generateDefaultLeaderboard();
            updateLeaderboard();

            document.querySelector('input').value = '';
        }
    });

    await fetchData();
    await updateLeaderboard();
});

