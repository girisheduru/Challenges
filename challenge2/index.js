const express = require('express');
const axios = require('axios');

const app = express();

const axiosInstance = axios.create({
  baseURL: 'http://metadata.google.internal/',
  timeout: 1000,
  headers: {'Metadata-Flavor': 'Google'}
});

app.get('/', (req, res) => {
  axiosInstance.get('computeMetadata/v1/instance?alt=json').then(response => {
    console.log(response.status)
    console.log(response.data);
    res.send(response.data);
  });

});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});