const express = require('express');
const axios = require('axios');

const app = express();

const axiosInstance = axios.create({
  baseURL: 'http://metadata.google.internal/',
  timeout: 1000,
  headers: {'Metadata-Flavor': 'Google'}
});

app.get('/', (req, res) => {
  let path = req.query.path || 'computeMetadata/v1/';

  axiosInstance.get(path).then(response => {
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