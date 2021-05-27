const DEFAULT_PIN = 17;
const DEFAULT_PULSELENGTH = 350;
const DEFAULT_PROTOCOL = 1;
const TYPE_DHT_SENSOR = 4;

const router = require('express').Router();
const rpi433 = require('rpi-433-v3');
const sensor = require('node-dht-sensor').promises;
const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const rfEmitter = rpi433.emitter({
	pin: DEFAULT_PIN,
	pulseLength: DEFAULT_PULSELENGTH,
	protocol: DEFAULT_PROTOCOL,
});

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../data/devices.json');

sensor.initialize({
	test: {
		fake: {
			temperature: 30,
			humidity: 60,
		},
	},
});

const checkSensors = async (devices) => {
	const devicesChanged = devices.map(async (device) => {
		if (device.type === TYPE_DHT_SENSOR) {
			try {
				const res = await sensor.read(22, 4);
				await dataSource.update(device.id, { value: res.temperature });
				// eslint-disable-next-line no-param-reassign
				device.value = res.temperature;
				console.log(`temp: ${device.value.toFixed(1)}°C, humidity: ${device.value.toFixed(1)}%`);
			} catch (err) {
				console.error('Failed to read sensor data:', err);
			}
		}

		const deviceChanged = { ...device };
		console.log(deviceChanged);
		return deviceChanged;
	});

	return devicesChanged;
};

router.get('/', async (req, res) => {
	const devices = await dataSource.select({});
	const devicesChanged = await checkSensors(devices);
	console.log(devicesChanged);
	return res.json(devicesChanged);
});

router.get('/:id', async (req, res) => {
	const devicesFiltered = await dataSource.selectById(req.params.id);
	if (devicesFiltered.type === TYPE_DHT_SENSOR) {
		checkSensors([...devicesFiltered]);
	}
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
