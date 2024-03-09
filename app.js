const express = require('express');
const fs = require('fs');
const cors = require('cors');
const config = require('./config');
const brain = require('./brain');

const app = express();

if (!fs.existsSync(config.hlsOutputPath)) fs.mkdirSync(config.hlsOutputPath);

app.use(cors());
app.use(express.static(config.hlsOutputPath));

brain.run();

module.exports = app;
