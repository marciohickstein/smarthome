const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../datafiles/device-types.json');

exports.getTypes = async (id) => {
	const isById = (id);
	return await isById ? dataSource.selectById(id) : dataSource.select();
};
