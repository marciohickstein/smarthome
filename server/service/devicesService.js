const DEFAULT_PIN = 17;
const DEFAULT_PULSELENGTH = 350;
const DEFAULT_PROTOCOL = 1;
const TYPE_DHT_SENSOR = 4;

const rpi433 = require('rpi-433-v3');
const sensor = require('node-dht-sensor').promises;

const devicesData = require('../data/devicesData');
const typesData = require('../data/typesData');

const rfEmitter = rpi433.emitter({
	pin: DEFAULT_PIN,
	pulseLength: DEFAULT_PULSELENGTH,
	protocol: DEFAULT_PROTOCOL,
});

sensor.initialize({
	test: {
		fake: {
			temperature: 18,
			humidity: 74,
		},
	},
});

const getType = (device) => {
	if (typeof device.type === 'number') {
		return device.type;
	}

	if (typeof device.type === 'object' && device.type.id !== 'undefined') {
		return device.type.id;
	}

	return null;
};

const checkSensors = async (devices) => {
	for (let index = 0; index < devices.length; index += 1) {
		const device = devices[index];

		if (getType(device) === TYPE_DHT_SENSOR) {
			try {
				// eslint-disable-next-line no-await-in-loop
				const res = await sensor.read(22, 4);
				device.value = `${res.temperature.toFixed(1)}C\n${res.humidity.toFixed(1)}%`;
				// eslint-disable-next-line no-await-in-loop
				await devicesData.updateDevices(device.id, { value: device.value });
				// eslint-disable-next-line no-param-reassign
				console.log(device.value);
			} catch (err) {
				console.error('Failed to read sensor data:', err);
			}
		}
	}

	return devices;
};

exports.getDevices = async (id) => {
	const devices = await devicesData.getDevices(id);

	for (let index = 0; index < devices.length; index += 1) {
		const device = devices[index];
		// eslint-disable-next-line no-await-in-loop
		const [type] = await typesData.getTypes(device.type);
		device.type = type;
	}

	const devicesChanged = await checkSensors(devices);

	return devicesChanged;
};

exports.updateDevices = (id, valuesToChange) => devicesData.updateDevices(id, valuesToChange);

exports.sendRfCode = (code) => rfEmitter.sendCode(code);
