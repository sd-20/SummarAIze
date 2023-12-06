// // we might need to make a server to handle the ChatGPT api calls otherwise our API key will be public
// // i dont rly care so i just assumed we wont, we can change this later

// const OPENAI_API_KEY = 'your-api-key'; // replace

// // example query function
// function queryOpenAI(prompt) {
//     return fetch('https://api.openai.com/v1/engines/davinci/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             prompt: prompt,
//             max_tokens: 100
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//             return data;
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             throw error;
//         });
// }
