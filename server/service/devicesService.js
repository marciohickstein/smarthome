const Device = require('../classes/device');
const DeviceType = require('../classes/deviceType');
const devicesData = require('../data/devicesData');
const typesData = require('../data/typesData');

const getDeviceByJSON = (deviceJSON) => {
	const { type } = deviceJSON;
	const deviceValues = Object.values(deviceJSON);
	const typeValues = Object.values(type);

	const deviceAndType = new Device(...deviceValues);
	const deviceType = new DeviceType(...typeValues);

	deviceAndType.setType(deviceType);
	return deviceAndType;
};

const checkSensors = async (devices) => {
	for (let index = 0; index < devices.length; index += 1) {
		const device = devices[index];

		try {
			const dev = getDeviceByJSON(device);
			// eslint-disable-next-line no-await-in-loop
			device.value = await dev.getValue();
			// eslint-disable-next-line no-await-in-loop
			await devicesData.updateDevices(device.id, { value: device.value });
			// eslint-disable-next-line no-param-reassign
			// console.log(device.value);
		} catch (err) {
			console.error('Failed to read sensor data:', err);
		}
	}

	return devices;
};

exports.getDevicesJSON = async (id) => {
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

exports.getDevices = async (id) => {
	const devicesJSON = await this.getDevicesJSON(id);

	const listDevices = devicesJSON.map((device) => {
		const { type } = device;
		const deviceValues = Object.values(device);
		const typeValues = Object.values(type);

		const deviceAndType = new Device(...deviceValues);
		const deviceType = new DeviceType(...typeValues);

		deviceAndType.setType(deviceType);
		return deviceAndType;
	});

	return listDevices;
};

exports.updateDevices = (id, valuesToChange) => devicesData.updateDevices(id, valuesToChange);
