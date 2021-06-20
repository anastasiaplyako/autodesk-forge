const express = require('express');
const Notes = require("../model/notes/notes");
const Project = require("../model/projects");
let router = express.Router();
const NotesObject = require("../model/notes/notesObject");
const RolesFolders = require("../model/Documentation/folder-user");
const UsersRole = require("../model/roles/users-role");
const Folders = require("../model/Documentation/folders");

const auth = require('../middleware/auth.middleware');

// /api/forge/notes

router.post('/create', auth, async (req, res) => {
    try {
        const noteText = req.body.notes;
        const idFolder = req.body.idFolder;
        const newNote = new Notes({
            note: noteText,
            idFolder: idFolder
        })
        await newNote.save();
        res.status(200).end();
    } catch (e) {
        res.status(500).end();
    }
})

router.get('/read', auth, async (req, res) => {
    try {
        const resultNote = [];
        const idProject = req.query.id;
        const role = await UsersRole
            .findOne({
            idProject: idProject,
            idUser: req.user.userId
        }).populate("idRole");
        let folders;
        if (role.idRole.nameRole === "admin") {
            folders = await Folders
                .find({idProject: idProject})
            await Promise.all(folders.map(async folder => {
                const findNotes = await Notes.find({idFolder: folder._id});
                resultNote.push(...findNotes);
            }))
        } else {
            folders = await RolesFolders
                .find({idRole: role.idRole})
                .populate("idFolder");
            await Promise.all(folders.map(async folder => {
                const findNotes = await Notes.find({idFolder: folder.idFolder._id});
                resultNote.push(...findNotes);
            }))
        }
        res.json(resultNote);
    } catch (e) {
        res.status(400).end();
        console.log(e);
    }
})

router.post('/delete', async (req, res) => {
    try {
        const _id = req.body._id;
        await Notes.remove({_id: _id});
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
        console.log(e);
    }
})

router.post('/update', async (req, res) => {
    try {
        const note = req.body.note;
        const _id = req.body.id;
        await Notes.updateOne({ _id: _id}, {$set: {note: note}});
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
        console.log(e);
    }
})

router.post('/addObject', async (req, res) => {
    const urn = req.body.urn;
    const project = await Project.findOne({urn: urn});
    const idNoteObject = req.body.idNoteObject;
    const textNoteObject = req.body.textNoteObject;
    const newNote = new NotesObject({
        idProject: project._id,
        note: textNoteObject,
        idNoteObject: idNoteObject,
    })
    await newNote.save();
    res.status(200).end();
})

router.get('/getObject', async (req, res) => {
    const urn = req.query.urn;
    const project = await Project.findOne({urn: urn})
    const findNotes = await NotesObject.find({idProject: project._id});
    res.send(findNotes);
})

router.post('/deleteObject', async (req, res) => {
    try {
        const _id = req.body._id;
        await NotesObject.remove({_id: _id});
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
        console.log(e);
    }
})

router.post('/updateObject', async (req, res) => {
    try {
        const textNodeObject = req.body.note;
        const _id = req.body.id;
        await NotesObject.updateOne({ _id: _id}, {$set: {note: textNodeObject}});
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
        console.log(e);
    }
})
module.exports = router;