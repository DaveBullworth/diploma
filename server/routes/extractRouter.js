const Router = require('express')
const router = new Router()
const extractController = require('../controllers/extractController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, extractController.create)
router.get('/', extractController.getAll)
router.get('/:id', extractController.getOne)
router.delete('/:id', authMiddleware, extractController.delete)
router.patch('/:id', authMiddleware, extractController.update)

module.exports = router