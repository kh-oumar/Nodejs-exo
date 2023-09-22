const express = require('express');
const controller = require('./articles.controller');
const router = express.Router();

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;