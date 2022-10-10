const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const uploadRoutes = require('./upload-routes.js');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/upload', uploadRoutes)

router.use((req,res)=> {
    res.status(404).end();
})

module.exports=router;