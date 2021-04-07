const express = require('express');
const axios = require('axios');
const { json } = require('express');

const app = express();

const axiosInstance = axios.create({
  baseURL: 'http://metadata.google.internal/',
  timeout: 1000,
  headers: {'Metadata-Flavor': 'Google'}
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/', (req, res) => {
  axiosInstance.get('computeMetadata/v1/instance?recursive=true&alt=json').then(response => {
    console.log(response.status)
    console.log(response.data);
    res.send(response.data);
  });

});

app.get('/api', (req, res) => {
  
  var jsonString = "{\"key\":\"another json1 structure\"}";
  var jsonObj = JSON.parse(jsonString);
  res.send(jsonObj);

  /*axiosInstance.get('computeMetadata/v1/instance?recursive=true&alt=json').then(response => {
    console.log(response.status)
    console.log(response.data);
    res.send(response.data);
  });*/

});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});