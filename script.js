document.addEventListener('DOMContentLoaded', function () {
  fetch('https://algolisted.cyclic.app/coding-questions/question/striver-sde-sheet')
      .then(response => response.json())
      .then(data => {
          // Handle the data as needed
          console.log(data);
          // Update the HTML with the fetched data or perform other actions
          document.getElementById('result').innerText = "Data fetched";
      })
      .catch(error => console.error('Error:', error));
});
