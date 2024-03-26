const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const recordRouter = require('./recordRouter')
const categoryRouter = require('./categoryRouter')
const extractRouter = require('./extractRouter')
const extractRecordRouter = require('./extractRecordRouter')
const positionRouter = require('./positionRouter')
const positionHierarchyRouter = require('./positionHierarchyRouter')


router.use('/user', userRouter)
router.use('/record', recordRouter)
router.use('/category', categoryRouter)
router.use('/extract', extractRouter)
router.use('/extractRecord', extractRecordRouter)
router.use('/position', positionRouter)
router.use('/positionHierarchy', positionHierarchyRouter)


module.exports = router