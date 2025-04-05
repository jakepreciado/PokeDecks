const express = require('express');
const app = express();
const env = require("dotenv").config()

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST
// const apiKey = process.env.TCG_PLAYER_API_KEY;

app.use(express.static('src/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
  });

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})