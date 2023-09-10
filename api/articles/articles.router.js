const express = require('express');
const controller = require('./articles.controller');
const router = express.Router();

router.post('/', controller.createArticle);
router.put('/:id', controller.updateArticle);
router.delete('/:id', controller.deleteArticle);

module.exports = router;