const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../datafiles/groups.json');

exports.getGroups = async (id) => {
	const isById = id;
	return await isById ? dataSource.selectById(id) : dataSource.select({});
};

exports.updateGroups = async (id, valuesToChange) => dataSource.update(id, valuesToChange);
