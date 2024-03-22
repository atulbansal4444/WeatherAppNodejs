// const http = require('http');
const fs = require('fs');
const requests = require('requests');

const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())

const apiKey = '097614be0d44876b5346687cd8f9420f';
const cityName = 'Patiala';

const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

const htmlContent = fs.readFileSync("home.html", "utf-8");

const replaceValue = (tempVal, realVal) => {
    // console.log(realVal);
    let temperature = tempVal.replace("{%temp%}", realVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", realVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", realVal.main.temp_max);
    temperature = temperature.replace("{%location%}", realVal.name);
    temperature = temperature.replace("{%country%}", realVal.sys.country);
    temperature = temperature.replace("{%tempstatus}", realVal.weather[0].main);

    return temperature;
}

app.get("/", (req, res) => {
    requests(api)
            .on('data', (chunk) => {
                const jsonObj = JSON.parse(chunk);
                const arrData = [jsonObj];
                const realTimeData = arrData
                    .map(val => replaceValue(htmlContent, val))
                    .join(""); // .join("") using to convert data to string.
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) {
                    return console.log('connection closed due to errors', err);
                }
                res.end();
            });
})

// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         requests(api)
//             .on('data', (chunk) => {
//                 const jsonObj = JSON.parse(chunk);
//                 const arrData = [jsonObj];
//                 const realTimeData = arrData
//                     .map(val => replaceValue(htmlContent, val))
//                     .join(""); // .join("") using to convert data to string.
//                 res.write(realTimeData);
//             })
//             .on('end', (err) => {
//                 if (err) {
//                     return console.log('connection closed due to errors', err);
//                 }
//                 res.end();
//             });
//     }
// });

app.listen(4000, () => {
    console.log('listening for requests on port 4000')
});

// server.listen("8000", "127.0.0.1");
