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
            try {
                const apiURL = await findUrl(); // Wait for the Promise to resolve
                console.log("apiURL : ", apiURL);
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

    async function findUrl() {
        let contestStatus = "No Contest Running";
        let contestURL = null;
    
        function getCurrentIndianTime() {
            const now = new Date();
    
            const indianTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    
            const indianDay = indianTime.getUTCDay();
    
            const indianWeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
            const currentIndianDay = indianWeekDays[indianDay];
    
            const hours = indianTime.getUTCHours();
            const minutes = indianTime.getUTCMinutes();
    
            const currentTimeString = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    
            return {
                day: currentIndianDay,
                time: currentTimeString
            };
        }
    
        function calculateWeeklyContestNumber(startDate) {
            const oneDay = 24 * 60 * 60 * 1000;
    
            // Start date: December 24, 2023
            const contestStartDate = new Date(startDate);
    
            // Current date
            const currentDate = new Date();
    
            // Calculate the number of days between start date and current date
            const daysPassed = Math.round(Math.abs((contestStartDate.getTime() - currentDate.getTime()) / (oneDay)));
    
            // Calculate the number of Sundays passed
            const sundaysPassed = Math.floor(daysPassed / 7);
    
            // Initial contest number
            // const initialContestNumber = 377;
            const initialContestNumber = 376;
    
            // Calculate the current contest number
            const currentContestNumber = initialContestNumber + sundaysPassed;
    
            return currentContestNumber;
        }
    
        function calculateBiweeklyContestNumber(startDate) {
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    
            // Start date: December 23, 2023
            const contestStartDate = new Date(startDate);
    
            // Current date
            const currentDate = new Date();
    
            // Calculate the number of days between start date and current date
            const daysPassed = Math.round(Math.abs((contestStartDate.getTime() - currentDate.getTime()) / (oneDay)));
    
            // Calculate the number of biweekly intervals passed
            const biweeklyIntervalsPassed = Math.floor(daysPassed / 14);
    
            // Initial contest number
            const initialContestNumber = 120;
    
            // Calculate the current contest number
            const currentContestNumber = initialContestNumber + biweeklyIntervalsPassed;
    
            return currentContestNumber;
        }
    
        const currentDayTimeElement = document.querySelector('.currentDayTime');
        if (currentDayTimeElement) {
            const currentTime = getCurrentIndianTime();
            currentDayTimeElement.textContent = `${currentTime.day}, ${currentTime.time}`;
        }
    
        const weeklySundayElement = document.querySelector('.weeklySunday');
        if (weeklySundayElement) {
            const currentTime = getCurrentIndianTime();
            const isSunday = currentTime.day === 'Sunday';
            const isTime = currentTime.time >= '06:00' && currentTime.time <= '07:30';
            if (isSunday && isTime) {
                const contestNumber = calculateWeeklyContestNumber('2023-12-24');
                contestStatus = `Weekly Contest ${contestNumber} is Running`;
                contestURL = `https://lc-live-ranking-api.vercel.app/?contest=weekly-contest-${contestNumber}`;
                weeklySundayElement.textContent = `Active: Weekly Contest ${contestNumber}`;
            } else {
                weeklySundayElement.textContent = 'Inactive';
            }
        }
    
        const biweeklySaturdayEvenElement = document.querySelector('.biweeklySaturdayEven');
        if (biweeklySaturdayEvenElement) {
            const currentTime = getCurrentIndianTime();
            const isSaturday = currentTime.day === 'Saturday';
            const isTime = currentTime.time >= '20:00' && currentTime.time <= '21:30';
            if (isSaturday && isTime) {
                const contestNumber = calculateBiweeklyContestNumber('2023-12-23');
                contestStatus = `Biweekly Contest ${contestNumber} is Running`;
                contestURL = `https://lc-live-ranking-api.vercel.app/?contest=biweekly-contest-${contestNumber}`;
                biweeklySaturdayEvenElement.textContent = `Active: Biweekly Contest ${contestNumber}`;
            } else {
                biweeklySaturdayEvenElement.textContent = 'Inactive';
            }
        }
    
        const contestStatusElement = document.querySelector('.currContestStatus');
        if (contestStatusElement) {
            contestStatusElement.textContent = contestStatus;
        }
    
        console.log("Contest URL:", contestURL);
        
        return contestURL;
    }
    
    document.addEventListener('DOMContentLoaded', async function () {
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

