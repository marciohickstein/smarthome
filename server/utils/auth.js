const jwt = require('jsonwebtoken');

const SECRET_KEY = 'DLKGBFGPEGBGAOFSPBGFBGDFBG';
const EXPIRE_IN = 300; // 5 min

const geraToken = (payload) => {
	const token = jwt.sign(payload, SECRET_KEY, {
		expiresIn: EXPIRE_IN,
	});
	return token;
};

const verifyToken = (req, res, next) => {
	const token = req.headers['x-access-token'];

	console.log('x-newrelic-id:', req.headers['x-newrelic-id']);
	if (req.headers['x-newrelic-id'] === 'VwAOU1RRGwcJUFJQBQAFVg==') {
		// By pass when it's IFTTT
		next();
		return true;
	}

	if (!token) {
		return res.status(401).json({ auth: false, message: 'Token não informado na requisição!' });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		res.userId = decoded.userId;
	} catch (err) {
		return res.status(401).json({ auth: false, message: 'Token inválido!' });
	}

	next();
	return true;
};

module.exports = {
	geraToken,
	verifyToken,
};
