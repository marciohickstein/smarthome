// Import Libraries
require('dotenv').config();

const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const routerDevices = require('./routes/devices');
const routerTypes = require('./routes/types');

// Middleware
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use(cors());
app.use('/', express.static('client/'));
app.use('/devices', routerDevices);
app.use('/types', routerTypes);

app.get('*', (req, res) => res.sendFile(join(__dirname, '/client/error404.html')));

// Start Web Server
app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
