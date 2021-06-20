const express = require('express');
let router = express.Router();
const { getInternalToken } = require('./common/oauth');

router.get('/token', async (req, res) => {
    const token = await getInternalToken()
    console.log("TOKEN = ", token);
    res.send({
        access_token: token.access_token
    })
})

module.exports = router;