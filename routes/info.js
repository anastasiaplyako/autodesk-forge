const express = require('express');
let router = express.Router();

const Project = require("../model/project/project");

// /api/forge/info
router.get('/', async (req, res) => {
    const project = await Project.findOne({_id: req.query.id});
    res.send({
        project
    })
})

router.post('/update', async (req, res) => {
    const updateProject = req.body.project;
    const project = await Project.updateOne({_id: updateProject._id}, {$set : {...updateProject}});
    res.send({
        project
    })
})

module.exports = router;