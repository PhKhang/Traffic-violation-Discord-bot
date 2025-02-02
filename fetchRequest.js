const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const HTMLParser = require('node-html-parser');

// Define the URL and headers
const url = 'https://phatnguoixe.com/1026';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://phatnguoixe.com',
    'Pragma': 'no-cache',
    'Referer': 'https://phatnguoixe.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
};


// Make the POST request
var result
async function a() {
    // Define the form data
    const params = new URLSearchParams();
    params.append('BienSo', '59E22530');
    params.append('LoaiXe', '2');

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: params
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Parse the response as JSON
        })
        .then(data => {
            result = data
            // console.log(data); // Log the parsed JSON data
            root = HTMLParser.parse(data);
            console.log(root.querySelectorAll('center h3')[1].text);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

a()