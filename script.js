let contestStatus = "No Contest Running";
let contestURL = null;

// Function to get the current Indian week day and time
function getCurrentIndianTime() {
    // Get the current UTC date and time
    const now = new Date();

    // Adjust for Indian time zone (GMT+5:30)
    const indianTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));

    // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
    const indianDay = indianTime.getUTCDay();

    // Array of Indian week days
    const indianWeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Get the current Indian week day
    const currentIndianDay = indianWeekDays[indianDay];

    // Get the current time in 24-hour format
    const hours = indianTime.getUTCHours();
    const minutes = indianTime.getUTCMinutes();

    // Construct the string for current Indian time
    const currentTimeString = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    // Return an object containing the current Indian day and time
    return {
        day: currentIndianDay,
        time: currentTimeString
    };
}

// Function to calculate the weekly contest number based on the start date and the current date
function calculateWeeklyContestNumber(startDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    // Start date: December 24, 2023
    const contestStartDate = new Date(startDate);

    // Current date
    const currentDate = new Date();

    // Calculate the number of days between start date and current date
    const daysPassed = Math.round(Math.abs((contestStartDate.getTime() - currentDate.getTime()) / (oneDay)));

    // Calculate the number of Sundays passed
    const sundaysPassed = Math.floor(daysPassed / 7);

    // Initial contest number
    const initialContestNumber = 377;

    // Calculate the current contest number
    const currentContestNumber = initialContestNumber + sundaysPassed;

    return currentContestNumber;
}

// Function to calculate the biweekly contest number based on the start date and the current date
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

// Update the content of the paragraphs based on the current day and time
document.addEventListener('DOMContentLoaded', function() {
    // Update the content of the paragraph with class "currentDayTime"
    const currentDayTimeElement = document.querySelector('.currentDayTime');
    if (currentDayTimeElement) {
        const currentTime = getCurrentIndianTime();
        currentDayTimeElement.textContent = `${currentTime.day}, ${currentTime.time}`;
    }

    // Update the content of the paragraph with class "weeklySunday" and set contest status
    const weeklySundayElement = document.querySelector('.weeklySunday');
    if (weeklySundayElement) {
        const currentTime = getCurrentIndianTime();
        const isSunday = currentTime.day === 'Sunday';
        const isTime = currentTime.time >= '02:00' && currentTime.time <= '03:30';
        if (isSunday && isTime) {
            const contestNumber = calculateWeeklyContestNumber('2023-12-24');
            contestStatus = `Weekly Contest ${contestNumber} is Running`;
            contestURL = `https://lc-live-ranking-api.vercel.app/?contest=weekly-contest-${contestNumber}`;
            weeklySundayElement.textContent = `Active: Weekly Contest ${contestNumber}`;
        } else {
            weeklySundayElement.textContent = 'Inactive';
        }
    }

    // Update the content of the paragraph with class "biweeklySaturdayEven" and set contest status
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

    // Update the contest status in HTML
    const contestStatusElement = document.querySelector('.currContestStatus');
    if (contestStatusElement) {
        contestStatusElement.textContent = contestStatus;
    }

    // Log the contest URL
    console.log("Contest URL:", contestURL);
});
