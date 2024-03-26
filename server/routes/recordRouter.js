const Router = require('express')
const recordController = require('../controllers/recordController')
const router = new Router()

router.post('/', recordController.create)
router.get('/', recordController.getAll)
router.get('/:id', recordController.getOne)
router.delete('/:id', recordController.delete)
router.patch('/:id', recordController.update)

module.exports = router