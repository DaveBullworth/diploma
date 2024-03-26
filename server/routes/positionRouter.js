const Router = require('express')
const positionController = require('../controllers/positionController')
const router = new Router()

router.post('/', positionController.create)
router.get('/', positionController.getAll)
router.get('/:id', positionController.getOne)
router.delete('/:id', positionController.delete)
router.patch('/:id', positionController.update)

module.exports = router