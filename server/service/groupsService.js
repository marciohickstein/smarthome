const groupsData = require('../data/groupsData');
const devicesData = require('../data/devicesData');
const typesData = require('../data/typesData');
const devicesService = require('../service/devicesService');

const getDevice = async (deviceID) => {
	const [device] = await devicesData.getDevices(deviceID);
	return device;
};

const getType = async (typeID) => {
	const [type] = await typesData.getTypes(typeID);
	return type;
};

exports.getGroups = async (id) => {
	const groups = await groupsData.getGroups(id);

	for (let i = 0; i < groups.length; i += 1) {
		for (let y = 0; y < groups[i].devices.length; y += 1) {
			// eslint-disable-next-line no-await-in-loop
			const device = await getDevice(groups[i].devices[y]);
			if (device) {
				// eslint-disable-next-line no-await-in-loop
				const type = await getType(device.type);
				device.type = type;
				groups[i].devices[y] = device;
			}
		}
		groups[i].devices = groups[i].devices.filter((device) => typeof device === 'object');
	}

	return groups;
};

exports.updateGroups = async (id, valuesToChange) => {
	const [group] = await groupsData.getGroups(id);

	console.log(group.devices);
	for (let y = 0; y < group.devices.length; y += 1) {
		// eslint-disable-next-line no-await-in-loop
console.log(group.devices[y]);
		const devId = group.devices[y].id;
		const [device] = await devicesService.getDevices(devId);
console.log(device);
		try {
			// eslint-disable-next-line no-await-in-loop
			await device.setValue(valuesToChange.value);
			// eslint-disable-next-line no-await-in-loop
			await devicesService.updateDevices(devId, valuesToChange);
		} catch (error) {
			console.log(error);
			return { error };
		}
	}

	return groupsData.updateGroups(id, valuesToChange);
};

// exports.updateGroups = (id, valuesToChange) => groupsData.updateGroups(id, valuesToChange);
