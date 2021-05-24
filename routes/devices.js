const DEFAULT_PIN = 17;
const DEFAULT_PULSELENGTH = 350;
const DEFAULT_PROTOCOL = 1;

const router = require('express').Router();
const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');
const rpi433 = require('rpi-433-v3');

const rfEmitter = rpi433.emitter({
	pin: DEFAULT_PIN,
	pulseLength: DEFAULT_PULSELENGTH,
	protocol: DEFAULT_PROTOCOL,
});

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../data/devices.json');

router.get('/', async (req, res) => {
	const devices = await dataSource.select({});
	return res.json(devices);
});

router.get('/:id', async (req, res) => {
	const devicesFiltered = await dataSource.selectById(req.params.id);
	return res.json(devicesFiltered);
});

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const fieldsToChange = req.body;
	let deviceChanged;

	try {
		if (fieldsToChange.code) {
			try {
				const result = await rfEmitter.sendCode(fieldsToChange.code);
				console.log(`Code sent: ${result}`);
			} catch (error) {
				console.log(`Code was not sent, reason: ${error}`);
			}
		}
		deviceChanged = await dataSource.update(id, fieldsToChange);
	} catch (error) {
		// console.log('error:', error);
		deviceChanged = {};
	}

	return res.json(deviceChanged);
});

module.exports = router;
