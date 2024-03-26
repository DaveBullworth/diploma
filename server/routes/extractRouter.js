const Router = require('express')
const router = new Router()
const extractController = require('../controllers/extractController')

router.post('/', extractController.create)
router.get('/', extractController.getAll)
router.get('/:id', extractController.getOne)
router.delete('/:id', extractController.delete)
router.patch('/:id', extractController.update)

module.exports = router