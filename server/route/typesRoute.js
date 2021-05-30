const router = require('express').Router();
const typesService = require('../service/typesService');

router.get('/', async (req, res) => {
	const types = await typesService.getTypes();
	return res.json(types);
});

router.get('/:id', async (req, res) => {
	const types = await typesService.getTypes(req.params.id);
	return res.json(types);
});

module.exports = router;
