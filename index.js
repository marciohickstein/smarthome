// Import Libraries
require('dotenv').config();

const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const routerGroups = require('./server/route/groupsRoute');
const routerDevices = require('./server/route/devicesRoute');
const routerTypes = require('./server/route/typesRoute');

const { geraToken, verifyToken } = require('./server/utils/auth');

// Middleware
app.use(express.json());
app.use(morgan('combined'));
// app.use(helmet());
app.use(compression());
app.use(cors());

// Routes
app.use('/', express.static('client/'));
app.use('/client/login.html', express.static('client/login.html'));
app.use('/groups', verifyToken, routerGroups);
app.use('/devices', verifyToken, routerDevices);
app.use('/types', verifyToken, routerTypes);

app.get('/ping', (req, res) => {
	return res.json({ online: true });
});

app.post('/login', (req, res) => {
	const { user, password } = req.body;

	const isValid = (user === process.env.LOGIN && password === process.env.PASSWORD);

	if (!isValid) {
		return res.status(401).json({ auth: false, message: 'Login incorreto. Verifique logine e senha.' });
	}

	const token = geraToken({
		userId: user,
	});

	return res.json({ auth: isValid, token });
});

app.get('*', (req, res) => res.sendFile(join(__dirname, '/client/error404.html')));

// Start Web Server
app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
