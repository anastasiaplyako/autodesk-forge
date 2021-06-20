const {Schema, model} = require("mongoose");

const schema = new Schema({
    urn: {type: String},
    number: {type: String},
    email: {type: String},
    img: {type: String},
    bucket: {type: String},
    fileName: {type: String},
})

module.exports = model("Project", schema)