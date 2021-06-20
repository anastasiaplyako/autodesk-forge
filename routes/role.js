const express = require('express');
let router = express.Router();
const Roles = require("../model/roles/role");
const UsersRole = require("../model/roles/users-role");
const User = require("../model/user");
const RolesFolders = require("../model/Documentation/folder-user");
const auth = require('../middleware/auth.middleware');
const {findProject} = require("./db/projects");
const {addUserRole} = require("./db/roles");
const {addRole} = require("./db/roles");


router.get('/', auth, async (req, res) => {
    try {
        const idProject = req.query.id;
        const findRole = await Roles
            .find({idProject: idProject});
        res.json(findRole);
    } catch (e) {
        res.send(400).end();
    }
})

router.post('/createRole', auth, async (req, res) => {
    try {
        await addRole(req.body.nameRole, req.body.idProject);
        res.send(200).end();
    } catch (e) {
        res.status(400).end();
        console.log(e);
    }
})

router.post('/assignRole', async (req, res) => {
    try {
        const login = req.body.login;
        const findUser = await User.findOne({login: login});
        if (!findUser) {
            return res.status(400).end();
        }
        await addUserRole(req.body.idRole, findUser._id, req.body.idProject);
        res.send(200).end();
    } catch (e) {
        res.status(400).end();
    }
})

router.get('/own', auth, async (req, res) => {
    try {
        const idProject = req.query.id;
        const project = await findProject(idProject);
        const roles = await UsersRole
            .find({
                idProject: project[0]._id,
                idUser: req.user.userId
            })
            .populate("idRole");
        res.json(roles);
    } catch (e) {
        res.send(400).end();
    }
})

router.get('/delete', auth, async (req, res) => {
    try {
        const idRole = req.query.id;
        await Roles.deleteOne({_id: idRole});
        await UsersRole.deleteMany({idRole: idRole});
        await RolesFolders.deleteMany({idRole: idRole});
        res.send(200).end();
    } catch (e) {
        res.send(400).end();
    }
})

module.exports = router;