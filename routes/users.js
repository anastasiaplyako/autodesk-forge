const express = require('express');
let router = express.Router();
const UsersRole = require("../model/roles/users-role");

// /api/forge/users
router.get('/', async (req, res) => {
    const idProject = req.query.id;
    try {
        const findUsers = await UsersRole
            .find({idProject: idProject})
            .populate("idRole")
            .populate("idUser")
        console.log("findUser", findUsers);
        res.send(findUsers);
    } catch(e) {
        res.status(400).end();
    }
})

router.get('/delete', async (req, res) => {
    try {
        await UsersRole.deleteOne({_id: req.query.id});
        res.status(200).end();
    } catch(e) {
        res.status(400).end();
    }
})

router.post('/updateRole', async (req, res) => {
    const idUserRole = req.body.idUserRole;
    const newIdRole = req.body.idRole;
    try {
        await UsersRole.updateOne({ _id: idUserRole}, {$set: {idRole: newIdRole}});
        res.status(200).end();
    } catch(e) {
        res.status(400).end();
    }
})

module.exports = router;