const {Schema, model} = require("mongoose");

const schema = new Schema({
    nameTypeDocumentation: {type: String, required: true}
})

module.exports = model("TypeDocumentation", schema)