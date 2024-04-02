const Router = require('express')
const recordController = require('../controllers/recordController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, recordController.create)
router.get('/', recordController.getAll)
router.get('/:id', recordController.getOne)
router.delete('/:id', authMiddleware, recordController.delete)
router.patch('/:id', authMiddleware, recordController.update)

module.exports = router