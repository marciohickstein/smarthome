const router = require('express').Router();
const devicesService = require('../service/devicesService');

router.get('/', async (req, res) => {
	const devices = await devicesService.getDevicesJSON();
	return res.status(200).json(devices);
});

router.get('/:id', async (req, res) => {
	const devices = await devicesService.getDevicesJSON(req.params.id);
	return res.status(200).json(devices);
});

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const fieldsToChange = req.body;
	let deviceChanged;

	const [device] = await devicesService.getDevices(id);
	try {
		await device.setValue(fieldsToChange.value);
		deviceChanged = await devicesService.updateDevices(id, fieldsToChange);
		return res.status(200).json(deviceChanged);
	} catch (error) {
		deviceChanged = { error };
		return res.status(400).json(deviceChanged);
	}
});

module.exports = router;
