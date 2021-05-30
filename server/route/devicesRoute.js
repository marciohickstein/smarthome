const router = require('express').Router();
const devicesService = require('../service/devicesService');

router.get('/', async (req, res) => {
	const devices = await devicesService.getDevices();
	return res.status(200).json(devices);
});

router.get('/:id', async (req, res) => {
	const devices = await devicesService.getDevices(req.params.id);
	return res.status(200).json(devices);
});

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const fieldsToChange = req.body;
	let deviceChanged;

	try {
		if (fieldsToChange.code) {
			try {
				const result = await devicesService.sendRfCode(fieldsToChange.code);
				console.log(`Code sent: ${result}`);
			} catch (error) {
				console.log(`Code was not sent, reason: ${error}`);
			}
		}
		deviceChanged = await devicesService.updateDevices(id, fieldsToChange);

		return res.status(200).json(deviceChanged);
	} catch (error) {
		deviceChanged = { error };
		return res.status(400).json(deviceChanged);
	}
});

module.exports = router;
