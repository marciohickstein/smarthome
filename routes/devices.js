const router = require('express').Router();
const { ContextDataSource } = require('../utils/db/strategies/base/contextDataSource');
const { JSONDataSource } = require('../utils/db/jsonDataSource');

const dataSource = new ContextDataSource(new JSONDataSource());
dataSource.open('../../data/devices.json');

router.get('/', async (req, res) => {
	const devices = await dataSource.select({});
	return res.json(devices);
});

router.get('/:id', async (req, res) => {
	const devicesFiltered = await dataSource.selectById(req.params.id);
	return res.json(devicesFiltered);
});

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const fieldsToChange = req.body;
	const deviceChanged = await dataSource.update(id, fieldsToChange);

	return res.json(deviceChanged);
});

module.exports = router;
