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
      mode: 'cors'
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log("Response from server:", data)
        document.getElementById('summary').innerText = data.summary;
        document.querySelector('.loader').style.display = 'none';

      })
      .catch(error => {
        console.error('Fetch error:', error)
        document.querySelector('.loader').style.display = 'none';
      });
  });
});

// append question to chat 
function appendQuestion(message) {
  var newMessageDiv = document.createElement('div');
  newMessageDiv.classList.add('questionDiv');
  var chatDiv = document.getElementById('chat');
  newMessageDiv.innerText = message;
  chatDiv.appendChild(newMessageDiv);
}

// append response to chat  
function appendResponse(message) {
  var newMessageDiv = document.createElement('div');
  newMessageDiv.classList.add('responseDiv');
  var chatDiv = document.getElementById('chat');
  newMessageDiv.innerText = message;
  chatDiv.appendChild(newMessageDiv);
}

ERROR_MESSAGE = "Error: failed to fetch response"
function handleSubmit() {
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
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      document.getElementById('userInput').value = '';
      appendQuestion(userInput)
      appendResponse(data.response)
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error)
      appendQuestion(ERROR_MESSAGE + error)
    });
};

// send user query to /submit when submit button is clicked or 'enter' is pressed
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submitButton').addEventListener('click', handleSubmit);
  document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  });
});
