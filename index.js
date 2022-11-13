/**
 * redis demo
 */
const axios = require('axios');
const express = require('express');
const redis = require('redis');

/* constants */
const MOCK_DB_ADDRESS = 'http://localhost:6000';
const CACHE_KEY_NAME = 'cache';
const PORT = 3000;

const app = express();

/* create redis client and connects to it */
let redisClient;
(async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error) => console.log(`Error: ${error}`));
    await redisClient.connect();
})();

/* fetch data from db */
async function fetchDataFromDB() {
    console.log(new Date().toUTCString() + ' ' + 'Accessing DB');
    const axiosResponse = await axios.get(`${MOCK_DB_ADDRESS}`);
    return axiosResponse.data;
}

/* get without cache handler */
async function getWithoutCache(req, res) {
    let result;
    result = await fetchDataFromDB();
    res.send(result);
}

/* get with cache handler */
async function getWithCache(req, res) {
    let result;
    const cachedData = await redisClient.get(`${CACHE_KEY_NAME}`);
    if (cachedData) {
        console.log(new Date().toUTCString() + ' ' + 'Cache hit');
        result = JSON.parse(cachedData);
    } else {
        console.log(new Date().toUTCString() + ' ' + 'Cache miss');
        result = await fetchDataFromDB();
        await redisClient.set(`${CACHE_KEY_NAME}`, JSON.stringify(result));
    }
    res.send(result);
}

/* app route */
app.get('/without-cache', getWithoutCache);
app.get('/with-cache', getWithCache);

app.listen(PORT, () => {
    console.log(`demo services listening on ${PORT}`);
});
