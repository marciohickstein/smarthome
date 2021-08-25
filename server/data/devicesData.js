const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../datafiles/devices.json');

exports.getDevices = async (id) => {
	try {
		const isById = (id);
		const result = isById ? await dataSource.selectById(id) : await dataSource.select({});
		return result;
	} catch (error) {
		throw new Error(error);
	}
};

exports.saveDevices = () => {

};

exports.updateDevices = async (id, valuesToChange) => dataSource.update(id, valuesToChange);

exports.deleteDevices = () => {

};
