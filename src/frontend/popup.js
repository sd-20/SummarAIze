// send url to /summary when the extension is opened
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var activeTabUrl = activeTab.url;

    fetch('http://127.0.0.1:5000/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: activeTabUrl }),
    })
      .then(response => response.text())
      .then(data => console.log("Response from server:", data))
      .catch(error => console.error('Fetch error:', error));
  });
});

// send user query to /submit when submit button is clicked
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
