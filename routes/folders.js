const express = require('express');
const Folders = require("../model/Documentation/folders");
const Note = require("../model/notes/notes");
const DocumentationFolder = require("../model/Documentation/documentation-folder");
const UsersRole = require("../model/roles/users-role");
let router = express.Router();
const auth = require('../middleware/auth.middleware');
const {findProject} = require("./db/projects");
const FolderUser = require("../model/Documentation/folder-user");
// /api/forge/folders

router.post('/create', auth, async (req, res) => {
    try {
        const project = await findProject(req.body.urn);
        const newFolder = new Folders({
            nameFolder: req.body.folder,
            idProject: project[0]._id
        })
        await newFolder.save();
        res.status(200);
    } catch {
        res.status(400);
    }
})

router.get('/get', auth, async (req, res) => {
    try {
        const project = await findProject(req.query.id);
        const role = await UsersRole.findOne({
            idProject: project[0]._id,
            idUser: req.user.userId
        })
        const folders = await FolderUser
            .find({idRole: role.idRole})
            .populate("idFolder")
        res.json(folders);
    } catch {
        res.status(400);
    }
})

router.get('/all', auth, async (req, res) => {
    try {
        const project = await findProject(req.query.id);
        const folders = await Folders.find({
            idProject: project[0]._id
        })
        res.send(folders);
    } catch {
        res.status(400);
    }
})

router.post('/assignFolder', auth, async (req, res) => {
    try {
        const idFolders = req.body.idFolders;
        const idRole = req.body.idRole;
        idFolders.map(async idFolder => {
            const folder = new FolderUser({
                idRole: idRole,
                idFolder: idFolder
            })
            await folder.save();
        })
        res.status(200);
    } catch {
        res.status(400);
    }
})

router.get('/delete', auth, async (req, res) => {
    try {
        const idFolder = req.query.id;
        await Folders.deleteOne({_id: idFolder});
        await Note.deleteMany({idFolder: idFolder});
        await DocumentationFolder.deleteMany({idFolder: idFolder});
        await FolderUser.deleteMany({idFolder: idFolder});
        res.status(200).end();
    } catch(e) {
        console.log(e);
        res.status(400).end();
    }
})
module.exports = router;