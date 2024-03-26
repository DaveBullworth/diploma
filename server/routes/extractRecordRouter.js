const Router = require('express')
const extractRecordController = require('../controllers/extractRecordController')
const router = new Router()

router.post('/', extractRecordController.create)
router.get('/', extractRecordController.getAll)
router.get('/:id', extractRecordController.getOne)
router.delete('/:id', extractRecordController.delete)
router.patch('/:id', extractRecordController.update)

module.exports = router