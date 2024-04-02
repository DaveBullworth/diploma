const Router = require('express')
const positionController = require('../controllers/positionController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, positionController.create)
router.get('/', positionController.getAll)
router.get('/:id', positionController.getOne)
router.delete('/:id', authMiddleware, positionController.delete)
router.patch('/:id', authMiddleware, positionController.update)

module.exports = router