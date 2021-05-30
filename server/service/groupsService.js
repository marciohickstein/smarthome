const groupsData = require('../data/groupsData');
const devicesData = require('../data/devicesData');
const typesData = require('../data/typesData');

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
