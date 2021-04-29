const router = require('express').Router();
const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../data/device-types.json');

router.get('/', async (req, res) => {
	const types = await dataSource.select();
	return res.json(types);
});

router.get('/:id', async (req, res) => {
	const types = await dataSource.select();
	const typesFiltered = types.filter((type) => type.id === req.params.id);
	return res.json(typesFiltered);
});

module.exports = router;
