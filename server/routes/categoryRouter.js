const Router = require('express')
const categoryController = require('../controllers/categoryController')
const router = new Router()

router.post('/', categoryController.create)
router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.delete('/:id', categoryController.delete)
router.patch('/:id', categoryController.update)

module.exports = router