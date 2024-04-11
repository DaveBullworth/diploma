const Router = require('express')
const orderRecordController = require('../controllers/orderRecordController')
const router = new Router()

router.post('/', orderRecordController.create)
router.get('/', orderRecordController.getAll)
router.get('/:id', orderRecordController.getOne)
router.delete('/:id', orderRecordController.delete)
router.patch('/:id', orderRecordController.update)

module.exports = router