// Function to fetch data from the URL
async function fetchData() {
    const url = "https://leetcode.com/contest/api/ranking/weekly-contest-379/?pagination=1&region=global";
  
    try {
      // Make the API request
      const response = await fetch(url);
  
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response JSON
      const data = await response.json();
  
      // Do something with the data (for example, log it)
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
  
  // Call the fetchData function
  fetchData();
  