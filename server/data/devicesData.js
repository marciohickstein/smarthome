const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../datafiles/devices.json');

exports.getDevices = async (id) => {
	const isById = (id);
	return await isById ? dataSource.selectById(id) : dataSource.select({});
};

exports.saveDevices = () => {

};

exports.updateDevices = async (id, valuesToChange) => dataSource.update(id, valuesToChange);

exports.deleteDevices = () => {

};
