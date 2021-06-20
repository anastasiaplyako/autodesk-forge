const express = require('express');
let router = express.Router();
const Projects = require("../model/projects")
// /api/forge/project

router.get('/readProject', async (req, res) =>{
    const idProject = req.query.id;
    const findProjectInfo = await Projects.findOne({_id: idProject});
    res.json(findProjectInfo)
})


module.exports = router;

