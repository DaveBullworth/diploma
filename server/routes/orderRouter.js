const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, orderController.create)
router.get('/', orderController.getAll)
router.get('/:id', orderController.getOne)
router.delete('/:id', authMiddleware, orderController.delete)
router.patch('/:id', authMiddleware, orderController.update)

module.exports = router