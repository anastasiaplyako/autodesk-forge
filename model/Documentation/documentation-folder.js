const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    idDocumentation: {type: Types.ObjectId, ref: 'Documentation'},
    idFolder: {type: Types.ObjectId, ref: 'Folders'}
})

module.exports = model("DocumentationFolder", schema)