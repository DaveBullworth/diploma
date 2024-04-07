const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const recordRouter = require('./recordRouter')
const categoryRouter = require('./categoryRouter')
const umRouter = require('./umRouter')
const extractRouter = require('./extractRouter')
const extractRecordRouter = require('./extractRecordRouter')
const positionRouter = require('./positionRouter')
const positionHierarchyRouter = require('./positionHierarchyRouter')


router.use('/user', userRouter)
router.use('/record', recordRouter)
router.use('/category', categoryRouter)
router.use('/um', umRouter)
router.use('/extract', extractRouter)
router.use('/extractRecord', extractRecordRouter)
router.use('/position', positionRouter)
router.use('/positionHierarchy', positionHierarchyRouter)


module.exports = router