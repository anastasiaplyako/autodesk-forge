const {Schema, model} = require("mongoose");

const schema = new Schema({
    urn: {type: String},
    nameProject: {type: String},

    number: {type: String},
    email: {type: String},
    img: {type: String}
})

module.exports = model("Projects", schema)