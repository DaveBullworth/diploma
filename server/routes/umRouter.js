const Router = require('express')
const UMController = require('../controllers/umController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, UMController.create)
router.get('/', UMController.getAll)
router.get('/:id', UMController.getOne)
router.delete('/:id', authMiddleware, UMController.delete)
router.patch('/:id', authMiddleware, UMController.update)

module.exports = router