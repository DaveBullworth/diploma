const Router = require('express')
const positionHierarchyController = require('../controllers/positionHierarchyController')
const router = new Router()

router.post('/', positionHierarchyController.create)
router.get('/', positionHierarchyController.getAll)
router.get('/:id', positionHierarchyController.getOne)
router.delete('/:id', positionHierarchyController.delete)
router.patch('/:id', positionHierarchyController.update)

module.exports = router