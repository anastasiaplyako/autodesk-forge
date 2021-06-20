const {Schema, model} = require("mongoose");

const schema = new Schema({
    userId: {type: String, required: true},
    urn: {type: String, required: true},
})

module.exports = model("UserProject", schema)