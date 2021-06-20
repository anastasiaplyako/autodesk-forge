const express = require('express');
let router = express.Router();
const { getPublicToken } = require('./common/oauth');

// /api/forge/token
router.get('/', async (req, res) => {
    const token = await getPublicToken()
    res.send({
        access_token: token.access_token
    })
})

module.exports = router;