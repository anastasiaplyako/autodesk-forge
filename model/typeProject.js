const {Schema, model} = require("mongoose");

const schema = new Schema({
    urn: {type: String},
    type: {type: String},
    status: {type: Boolean}
})

module.exports = model("TypeProject", schema)