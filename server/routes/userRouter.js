const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', authMiddleware, userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/', authMiddleware, userController.getAll)
router.get('/:id', authMiddleware, userController.getOne)
router.delete('/:id', authMiddleware, userController.delete)
router.patch('/:id', authMiddleware, userController.update)

module.exports = router