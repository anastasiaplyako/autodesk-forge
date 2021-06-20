const Projects = require("../../model/project/project");

const findProject = async (urn) => {
    return (await Projects.find({
        urn: urn,
    }));
}

const addProject = async (bucket, fileName) => {
    const newUserBucket = new Projects({
        bucket: bucket,
        fileName: fileName,
    })
    await newUserBucket.save();
    return newUserBucket;
}

const findProjectNameBucket = async (name, bucket) => {
    console.log("name", name, "bucket", bucket);
    const project = await Projects.findOne({
        bucket: bucket,
        fileName: name,
    })
    console.log("project", project);
    return project;
}

const updateUrnInProject = async (project, urn) => {
    await Projects.updateOne({
        _id: project._id
    }, {$set: {urn: urn}});
}

module.exports = {
    addProject, findProject, findProjectNameBucket, updateUrnInProject
};