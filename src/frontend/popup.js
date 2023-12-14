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
  var questionDiv = document.createElement('div');
  questionDiv.classList.add('questionDiv');
  var responseDiv = document.createElement('div')
  responseDiv.classList.add("responseDiv")
  var chatDiv = document.getElementById('chat');
  questionDiv.innerText = message;
  chatDiv.appendChild(questionDiv);
  chatDiv.append(responseDiv)
  return responseDiv
}

// append response to chat  
function appendResponseMessage(message, responseDiv, loadingDiv) {
  responseDiv.removeChild(loadingDiv)
  responseDiv.innerText = message;
}

function appendResponseLoader(responseDiv) {
  var loadingDiv = document.createElement('div');
  loadingDiv.classList.add("loader")
  responseDiv.appendChild(loadingDiv)
  return loadingDiv
}

ERROR_MESSAGE = "Error: failed to fetch response"
function handleSubmit() {
  let userInput = document.getElementById('userInput').value;
  let responseDiv = appendQuestion(userInput)
  let loadingDiv = appendResponseLoader(responseDiv)
  document.getElementById('userInput').value = '';

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
      appendResponseMessage(data.response, responseDiv, loadingDiv)
    })
    .catch(error => {
      console.error('Error:', error)
      appendResponseMessage(ERROR_MESSAGE + error)
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
