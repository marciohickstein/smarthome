/* eslint-disable no-await-in-loop */
const router = require('express').Router();
const groupsService = require('../service/groupsService');

router.get('/', async (req, res) => {
	const groups = await groupsService.getGroups();
	return res.json(groups);
});

router.get('/:id', async (req, res) => {
	const groups = await groupsService.getGroups(req.params.id);
	return res.json(groups);
});

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const fieldsToChange = req.body;
	let groupChanged;

	try {
		groupChanged = await groupsService.updateGroups(id, fieldsToChange);
	} catch (error) {
		// console.log('error:', error);
		groupChanged = {};
	}

	return res.json(groupChanged);
});

module.exports = router;
