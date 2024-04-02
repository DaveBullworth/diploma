const Router = require('express')
const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, categoryController.create)
router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.delete('/:id', authMiddleware, categoryController.delete)
router.patch('/:id', authMiddleware, categoryController.update)

module.exports = router