const util = require('util');
const exec = util.promisify(require('child_process').exec);
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
	let deviceChanged;

	try {
		if (fieldsToChange.code) {
			const cmd = `/home/pi/rf-modules/433Utils/RPi_utils/codesend ${fieldsToChange.code}`;

			console.log(cmd);
			const { stderr } = await exec(cmd);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (!stderr) {
				throw new Error(stderr);
			}
		}
		deviceChanged = await dataSource.update(id, fieldsToChange);
	} catch (error) {
		// console.log('error:', error);
		deviceChanged = {};
	}

	return res.json(deviceChanged);
});

module.exports = router;
