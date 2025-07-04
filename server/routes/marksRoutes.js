const express = require('express');
const router = express.Router();
const cors = require('cors');
const { createMark, getmarks } = require('../controllers/markController');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
);

router.post('/createmarks',createMark);
router.get('/marks',getmarks);

module.exports = router;