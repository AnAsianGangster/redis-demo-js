/**
 * service mocks a fake db service
 */
const express = require('express');

/* constants */
const PORT = 6000;

const app = express();

/* demo data */
const someData = {
    name: 'anasiangangster',
    emails: [
        {
            ename: '1',
            eaddress: '1@gmail.com',
        },
        {
            ename: '2',
            eaddress: '2@gmail.com',
        },
    ],
};

/* runtime blocking function to mock calculation */
function sleep(milliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + milliseconds >= new Date().getTime()) {
        // block runtime for x milliseconds
    }
}

/* funciton mocks fetch data from disk */
function fetchData() {
    sleep(3000);
    return someData;
}

/* get data handler */
function getData(req, res) {
    console.log(new Date().toUTCString() + ' ' + 'Hit fake db get service');
    res.send(fetchData());
}

/* service route */
app.get('/', getData);

app.listen(PORT, () => {
    console.log(`fake db services listening on ${PORT}`);
});
