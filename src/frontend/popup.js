document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submitButton').addEventListener('click', () => {
    let userInput = document.getElementById('userInput').value;

    console.log(userInput);
    
    fetch('http://127.0.0.1:5000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: userInput }),
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      document.getElementById('response').innerText = data.summary;
    })
    .catch(error => console.error('Error:', error));
  });
});
