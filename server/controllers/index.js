const router = require("express").Router();

const apiRoutes = require('./db');

router.use('/db', apiRoutes);

module.exports = router;